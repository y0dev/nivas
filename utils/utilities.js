const { compare, genSalt, hash } = require("bcryptjs");
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");
const logger = require("./logger").logger;

/**
 * UtilityService Class
 * Contains various utility methods used throughout the application
 */
class UtilityService {
  /**
   * Logs an error using the logger and console
   * @param {Error} err - The error to log
   */
  static handleError(err) {
    logger.error(err.stack || err);
    console.error(err.stack || err);
  }

  /**
   * Hashes a plain password using bcrypt
   * @param {string} plainPassword - The password to hash
   * @returns {Promise<string>} - The hashed password
   */
  static hashPassword(plainPassword) {
    return new Promise((resolve, reject) => {
      genSalt((err, salt) => {
        if (err) {
          return reject(err);
        }
        hash(plainPassword, salt, (error, hashedVal) => {
          if (error) {
            return reject(error);
          }
          resolve(hashedVal);
        });
      });
    });
  }

  /**
   * Compares a plain password with a hashed password
   * @param {string} plainPassword - The plain password
   * @param {string} hashedPassword - The hashed password
   * @returns {Promise<boolean>} - Whether the passwords match
   */
  static verifyPassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      compare(plainPassword, hashedPassword, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  /**
   * Hashes a string using SHA-256 algorithm
   * @param {string} text - The string to hash
   * @returns {string} - The hashed string
   */
  static hashString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  /**
   * Generates a UUID (version 1)
   * @returns {string} - The generated UUID
   */
  static generateUuid() {
    return uuidv1();
  }

  /**
   * Converts degrees to radians
   * @param {number} degrees - The value in degrees
   * @returns {number} - The value in radians
   */
  static #degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Converts radians to degrees
   * @param {number} radians - The value in radians
   * @returns {number} - The value in degrees
   */
  static #radToDeg(radians) {
    return (180 * radians) / Math.PI;
  }

  /**
   * Sleeps for a given number of seconds
   * @param {number} seconds - The number of seconds to sleep
   * @returns {Promise<void>}
   */
  static async sleep(seconds) {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }

  /**
   * Computes the bounding box of all points on the surface of a sphere
   * that are within a given distance of a center point
   * @param {number[]} centerPoint - The center coordinates [latitude, longitude]
   * @param {number} distance - The distance (in km) from the center point
   * @returns {number[]} - The bounding box coordinates [minLon, minLat, maxLon, maxLat]
   */
  static getBoundingBox(centerPoint, distance) {
    if (centerPoint.length !== 2) {
      this.handleError("Illegal arguments centerPoint");
      return [null];
    }

    const [degLat, degLon] = centerPoint;
    const RADIUS = 6378.1; // Earth's radius in km
    const radDist = distance / RADIUS;

    const radLat = this.#degToRad(degLat);
    const radLon = this.#degToRad(degLon);

    const MIN_LAT = this.#degToRad(-90);
    const MAX_LAT = this.#degToRad(90);
    const MIN_LON = this.#degToRad(-180);
    const MAX_LON = this.#degToRad(180);

    let minLat = radLat - radDist;
    let maxLat = radLat + radDist;
    let minLon, maxLon;

    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));

    if (minLat > MIN_LAT && maxLat < MAX_LAT) {
      minLon = radLon - deltaLon;
      maxLon = radLon + deltaLon;
      if (minLon < MIN_LON) {
        minLon += 2 * Math.PI;
      }
      if (maxLon > MAX_LON) {
        maxLon -= 2 * Math.PI;
      }
    } else {
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
   * Converts a currency string to a number
   * @param {string} currency - The currency string
   * @returns {number} - The numeric value of the currency
   */
  static currencyConverter(currency) {
    return Number(currency.replace(/[^0-9.-]+/g, ""));
  }

  /**
   * Calculates the percentage of two numbers
   * @param {number} num1 - The numerator
   * @param {number} num2 - The denominator
   * @returns {number} - The percentage
   */
  static percentage(num1, num2) {
    return Number(((num1 / num2) * 100).toFixed(2));
  }

  /**
   * Replaces spaces and commas in an address with hyphens
   * @param {string} address - The address string
   * @returns {string} - The hyphenated address
   */
  static hyphenateAddress(address) {
    return address.replace(/[\s,]+/g, "-");
  }

  /**
   * Calculates the percentiles for an array of numbers
   * @param {number[]} numbers - The array of numbers
   * @returns {Object} - The percentiles {25th_Percentile, 50th_Percentile, 75th_Percentile}
   */
  static calcPercentiles(numbers) {
    const filteredNumbers = numbers.filter((num) => !isNaN(num));
    const asc = (arr) => arr.sort((a, b) => a - b);
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    const mean = (arr) => sum(arr) / arr.length;
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
      return sorted[base + 1] !== undefined
        ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
        : sorted[base];
    };

    return {
      "25th_Percentile": quartile(filteredNumbers, 0.25),
      "50th_Percentile": quartile(filteredNumbers, 0.5),
      "75th_Percentile": quartile(filteredNumbers, 0.75),
    };
  }

  /**
   * Calculates the rent-to-price ratio of a property
   * @param {number} purchasePrice - The purchase price of the property
   * @param {number} monthlyRent - The monthly rent of the property
   * @returns {number} - The rent-to-price ratio
   */
  static calcRentToPriceRatio(purchasePrice, monthlyRent) {
    return (monthlyRent * 12) / purchasePrice;
  }

  /**
   * Calculates the rental yield of a property
   * @param {number} purchasePrice - The purchase price of the property
   * @param {number} monthlyRent - The monthly rent of the property
   * @param {number} additionalExpenses - Additional expenses (e.g., taxes, insurance)
   * @returns {number} - The rental yield
   */
  static calcRentalYield(purchasePrice, monthlyRent, additionalExpenses) {
    const annualGrossIncome = monthlyRent * 12;
    const annualNetIncome = annualGrossIncome - additionalExpenses;
    return annualNetIncome / purchasePrice;
  }

  /**
   * Gets user subscription settings based on the tier
   * @param {string} subscriptionTier - The subscription tier
   * @returns {Object} - The user settings {maxAmountResults, maxAmountSearches}
   */
  static getUserSubscription(subscriptionTier) {
    const userSettings = {
      maxAmountResults: 0,
      maxAmountSearches: 0,
    };

    switch (subscriptionTier.toLowerCase()) {
      case "free":
        userSettings.maxAmountResults = 10;
        userSettings.maxAmountSearches = 20;
        break;
      case "basic":
        userSettings.maxAmountResults = 25;
        userSettings.maxAmountSearches = 50;
        break;
      case "premium":
        userSettings.maxAmountResults = Number.MAX_SAFE_INTEGER;
        userSettings.maxAmountSearches = 100;
        break;
    }

    return userSettings;
  }

  /**
   * Safely parses JSON text
   * @param {string} text - The JSON text to parse
   * @returns {Object|null} - The parsed JSON object or null if parsing fails
   */
  static safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  }

  /**
   * Extracts JSON from a script text content
   * @param {string} text - The script text content
   * @returns {Object|null} - The extracted JSON object or null if not found
   */
  static extractJson(text) {
    const jsonStringMatch = text.match(/{.*}/s);
    if (jsonStringMatch) {
      return JSON.parse(jsonStringMatch[0]);
    }
    console.error("No JSON object found in script text.");
    return null;
  }

  /**
   * Builds a URL from a base URL and query parameters
   * @param {string} baseUrl - The base URL
   * @param {Object} queryParams - The query parameters
   * @returns {string} - The constructed URL
   */
  static buildUrl(baseUrl, queryParams) {
    let url = baseUrl;
    let isFirstParam = !baseUrl.includes('?');

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        const value = key === 'modelParams' ? JSON.stringify(queryParams[key]) : queryParams[key];
        const encodedValue = encodeURIComponent(value);
        url += isFirstParam ? `?${key}=${encodedValue}` : `&${key}=${encodedValue}`;
        isFirstParam = false;
      }
    }
    return url;
  }

  /**
   * Finds a key in a JSON object that contains a specific substring
   * @param {Object} obj - The JSON object
   * @param {string} substring - The substring to search for
   * @returns {string|null} - The matching key or null if not found
   */
  static findKeyContainingSubstring(obj, substring) {
    return Object.keys(obj).find(key => key.includes(substring)) || null;
  }

  /**
   * Finds the min and max values in an array of JSON objects
   * @param {Object[]} arr - The array of JSON objects
   * @param {string} propName - The property name to search for numeric values
   * @returns {Object} - The min and max values {min, max}
   */
  static findMinMax(arr, propName) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return { min: undefined, max: undefined };
    }

    let minVal = arr[0][propName];
    let maxVal = arr[0][propName];

    for (let i = 1; i < arr.length; i++) {
      const val = arr[i][propName];
      if (val < minVal) {
        minVal = val;
      }
      if (val > maxVal) {
        maxVal = val;
      }
    }

    return { min: minVal, max: maxVal };
  }
}

module.exports = UtilityService;
