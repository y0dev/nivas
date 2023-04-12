const { compare, genSalt, hash } = require("bcryptjs");
const { v1 } = require("uuid");
const crypto = require("crypto");

const logger = require("./logger");

export class UtilityService {
  /**
   * Error handler
   *
   * @param err
   * @returns
   */
  static handleError(err) {
    logger.error(err.stack || err);
  }

  /**
   * Hash plain password
   *
   * @param plainPassword Password to hash
   * @returns hashed password
   */
  static hashPassword(plainPassword) {
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
  static verifyPassword(plainPassword, hashedPassword) {
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
  static hashString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  /**
   * Generate UUID
   *
   * @returns UUID
   */
  static generateUuid() {
    return v1();
  }

  // helper functions (degrees<–>radians)
  static #degToRad(number) {
    return number * (Math.PI / 180);
  }

  static #radToDeg(number) {
    return (180 * number) / Math.PI;
  }

  static async sleep(seconds) {
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
  static getBoundingBox(centerPoint, distance) {
    if (centerPoint.length !== 2) {
      this.handleError("Illegal arguments centerPoint");
      return [null];
    }

    let minLat, maxLat, minLon, maxLon;

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
    minLon = void 0;
    maxLon = void 0;

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
  static currencyConverter(currency) {
    return Number(currency.replace(/[^0-9.-]+/g, ""));
  }

  /**
   * @param {number} num1 - numerator
   * @param {number} num2 - denominator
   * @description
   *   Calculates the percentage of two given numbers
   * @author Devontae Reid
   */
  static percentage(num1, num2) {
    return Number(((num1 / num2) * 100).toFixed(2));
  }

  /**
   * @param {number[]} number - list of numbers
   * @description
   *   Calculates the percentiles for a given array of numbers
   * @author Devontae Reid
   */
  static calcPercentiles(numbers) {
    // sort array ascending
    const asc = (arr) => arr.sort((a, b) => a - b);

    const sum = (arr) => arr.reduce((a, b) => a + b, 0);

    const mean = (arr) => sum(arr) / arr.length;

    // sample standard deviation
    const std = (arr) => {
      const mu = mean(arr);
      const diffArr = arr.map((a) => (a - mu) ** 2);
      return Math.sqrt(sum(diffArr) / (arr.length - 1));
    };

    const quartile = (arr, q) => {
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

    const q25 = (arr) => quartile(arr, 0.25);

    const q50 = (arr) => quartile(arr, 0.5);

    const q75 = (arr) => quartile(arr, 0.75);

    const median = (arr) => q50(arr);

    return {
      "25th_Percentile": q25(numbers),
      "50th_Percentile": median(numbers),
      "75th_Percentile": q75(numbers),
    };
  }
}
