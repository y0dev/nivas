import { compare, genSalt, hash } from 'bcryptjs';
import { v1 } from 'uuid';
import crypto from 'crypto';
import logger from './logger';

/*
  Youtube Video from Joshua Baldovino
  on Analyzing Zillow Data Automatically
  https://www.youtube.com/watch?v=D9jnmz_93XI
*/

// Interfaces
interface CenterPoint {
  [index: number]: number;
}

interface SubscriptionSettings {
  maxAmountResults: number;
  maxSearchesPerDay: number;
  maxDownloadsPerDay: number;
}

interface PercentileResult {
  q25: number;
  q50: number;
  q75: number;
  mean: number;
  std: number;
}

class UtilityService {
  /**
   * Error handler
   *
   * @param {Error} err
   * @returns
   */
  static handleError(err: Error | string): void {
    logger.error(err instanceof Error ? err.stack : err);
    console.log(err instanceof Error ? err.stack : err);
  }

  /**
   * Hash plain password
   *
   * @param plainPassword Password to hash
   * @returns hashed password
   */
  static hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt((err, salt) => {
        if (err) {
          reject(err);
        }

        hash(plainPassword, salt, (error, hashedVal) => {
          if (error) {
            reject(error);
          }

          resolve(hashedVal);
        });
      });
    });
  }

  /**
   * Compares plain password with hashed password
   *
   * @param plainPassword Plain password to compare
   * @param hashedPassword Hashed password to compare
   * @returns whether passwords match
   */
  static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(plainPassword, hashedPassword, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }

  /**
   * Hash string with sha256 algorithm
   *
   * @param text String to hash
   * @returns Returns hashed string
   */
  static hashString(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generate UUID
   *
   * @returns UUID
   */
  static generateUuid(): string {
    return v1();
  }

  // helper functions (degrees<–>radians)
  static #degToRad(number: number): number {
    return number * (Math.PI / 180);
  }

  static #radToDeg(number: number): number {
    return (180 * number) / Math.PI;
  }

  static async sleep(seconds: number): Promise<void> {
    await new Promise((r) => setTimeout(r, seconds * 1000));
  }

  /**
   * @param {number} distance - distance (km) from the point represented by centerPoint
   * @param {array[2]} centerPoint - two-dimensional array containing center coords [latitude, longitude]
   * @description
   *   Computes the bounding coordinates of all points on the surface of a sphere
   *   that has a great circle distance to the point represented by the centerPoint
   *   argument that is less or equal to the distance argument.
   *   Technique from: Jan Matuschek <http://JanMatuschek.de/LatitudeLongitudeBoundingCoordinates>
   * @author Alex Salisbury
   */
  static getBoundingBox(centerPoint: CenterPoint, distance: number): number[] {
    if (centerPoint.length !== 2) {
      this.handleError('Illegal arguments centerPoint');
      return [null as any];
    }

    let minLat: number, maxLat: number, minLon: number, maxLon: number;

    // coordinate limits
    const MIN_LAT = this.#degToRad(-90);
    const MAX_LAT = this.#degToRad(90);
    const MIN_LON = this.#degToRad(-180);
    const MAX_LON = this.#degToRad(180);

    // Earth's radius (km)
    const RADIUS = 6378.1;

    // angular distance in radians on a great circle
    const radDist = distance / RADIUS;

    // center point coordinates (deg)
    const [degLat, degLon] = centerPoint;

    // center point coordinates (rad)
    const radLat = this.#degToRad(degLat);
    const radLon = this.#degToRad(degLon);

    // minimum and maximum latitudes for given distance
    minLat = radLat - radDist;
    maxLat = radLat + radDist;
    // minimum and maximum longitudes for given distance
    minLon = undefined as any;
    maxLon = undefined as any;

    // define deltaLon to help determine min and max longitudes
    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));
    if (minLat > MIN_LAT && maxLat < MAX_LAT) {
      minLon = radLon - deltaLon;
      maxLon = radLon + deltaLon;
      if (minLon < MIN_LON) {
        minLon = minLon + 2 * Math.PI;
      }
      if (maxLon > MAX_LON) {
        maxLon = maxLon - 2 * Math.PI;
      }
    }
    // a pole is within the given distance
    else {
      minLat = Math.max(minLat, MIN_LAT);
      maxLat = Math.min(maxLat, MAX_LAT);
      minLon = MIN_LON;
      maxLon = MAX_LON;
    }
    return [
      this.#radToDeg(minLon),
      this.#radToDeg(minLat),
      this.#radToDeg(maxLon),
      this.#radToDeg(maxLat),
    ];
  }

  /**
   * @param {string} currency - currency needed to be converted into a number
   * @description
   *   Transforms a string currency into a number
   * @author Devontae Reid
   */
  static currencyConverter(currency: string): number {
    return Number(currency.replace(/[^0-9.-]+/g, ''));
  }

  /**
   * @param {number} num1 - numerator
   * @param {number} num2 - denominator
   * @description
   *   Calculates the percentage of two given numbers
   * @author Devontae Reid
   */
  static percentage(num1: number, num2: number): number {
    return Number(((num1 / num2) * 100).toFixed(2));
  }

  /**
   * @param {string} address
   * @description
   *   Replace spaces and commas with hyphens
   * @author Devontae Reid
   */
  static hyphenateAddress(address: string): string {
    return address.replace(/[\s,]+/g, '-');
  }

  /**
   * @param {array} numbers - array of numbers
   * @description
   *   Calculates percentiles for an array of numbers
   * @author Devontae Reid
   */
  static calcPercentiles(numbers: number[]): PercentileResult {
    const asc = (arr: number[]) => arr.sort((a, b) => a - b);

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const mean = (arr: number[]) => sum(arr) / arr.length;

    const std = (arr: number[]) => {
      const mu = mean(arr);
      const squareDiffs = arr.map((value) => {
        const diff = value - mu;
        const result = diff * diff;
        return result;
      });
      const avgSquareDiff = mean(squareDiffs);
      return Math.sqrt(avgSquareDiff);
    };

    const quartile = (arr: number[], q: number) => {
      const sorted = asc(arr);
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
        return sorted[base];
      }
    };

    const q25 = (arr: number[]) => quartile(arr, 0.25);
    const q50 = (arr: number[]) => quartile(arr, 0.5);
    const q75 = (arr: number[]) => quartile(arr, 0.75);
    const median = (arr: number[]) => q50(arr);

    return {
      q25: q25(numbers),
      q50: q50(numbers),
      q75: q75(numbers),
      mean: mean(numbers),
      std: std(numbers),
    };
  }

  /**
   * @param {number} purchasePrice - purchase price of property
   * @param {number} monthlyRent - monthly rent of property
   * @description
   *   Calculates the rent to price ratio
   * @author Devontae Reid
   */
  static calcRentToPriceRatio(purchasePrice: number, monthlyRent: number): number {
    const annualRent = monthlyRent * 12;
    return Number(((annualRent / purchasePrice) * 100).toFixed(2));
  }

  /**
   * @param {number} purchasePrice - purchase price of property
   * @param {number} monthlyRent - monthly rent of property
   * @param {number} additionalExpenses - additional expenses
   * @description
   *   Calculates the rental yield
   * @author Devontae Reid
   */
  static calcRentalYield(purchasePrice: number, monthlyRent: number, additionalExpenses: number = 0): number {
    const annualRent = monthlyRent * 12;
    const annualExpenses = additionalExpenses * 12;
    const netAnnualIncome = annualRent - annualExpenses;
    return Number(((netAnnualIncome / purchasePrice) * 100).toFixed(2));
  }

  /**
   * @param {string} subscriptionTier - subscription tier
   * @description
   *   Returns subscription settings based on tier
   * @author Devontae Reid
   */
  static getUserSubscription(subscriptionTier: string): SubscriptionSettings {
    const subscriptions: { [key: string]: SubscriptionSettings } = {
      free: {
        maxAmountResults: 5,
        maxSearchesPerDay: 3,
        maxDownloadsPerDay: 1,
      },
      basic: {
        maxAmountResults: 10,
        maxSearchesPerDay: 10,
        maxDownloadsPerDay: 5,
      },
      premium: {
        maxAmountResults: 25,
        maxSearchesPerDay: 50,
        maxDownloadsPerDay: 25,
      },
    };

    return subscriptions[subscriptionTier] || subscriptions.free;
  }
}

export default UtilityService; 