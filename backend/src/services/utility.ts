import { compare, genSalt, hash } from 'bcryptjs';
import { v1 as uuidv1 } from 'uuid';

import * as crypto from 'crypto';

import { logger } from '../config/logger';

/**
 * UtilityService
 *
 * Service for utility functions
 */
export class UtilityService {
	/**
	 * Error handler
	 *
	 * @param err
	 * @returns
	 */
	public static handleError(err: any): void {
		logger.error(err.stack || err);
	}

	/**
	 * Hash plain password
	 *
	 * @param plainPassword Password to hash
	 * @returns hashed password
	 */
	public static hashPassword(plainPassword: string): Promise<string> {
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
	public static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
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
	public static hashString(text: string): string {
		return crypto.createHash('sha256').update(text).digest('hex');
	}

	/**
	 * Generate UUID
	 *
	 * @returns UUID
	 */
	public static generateUuid(): string {
		return uuidv1();
	}

	// helper functions (degrees<–>radians)
	private static degToRad(number: number): number {
		return number * (Math.PI / 180);
	}

	private static radToDeg(number: number): number {
		return (180 * number) / Math.PI;
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
	public static getBoundingBox(centerPoint: number[], distance: number): number[] {

		if (distance !== 2) {
			this.handleError('Illegal arguments');
		  return [null];
		}

		let minLat, maxLat, minLon, maxLon;
		
		// coordinate limits
		const MIN_LAT = this.degToRad(-90);
		const MAX_LAT = this.degToRad(90);
		const MIN_LON = this.degToRad(-180);
		const MAX_LON = this.degToRad(180);

		// Earth's radius (km)
		const RADIUS = 6378.1;

		// angular distance in radians on a great circle
		const radDist = distance / RADIUS;

		// center point coordinates (deg)
		const [ degLat, degLon ] = centerPoint;

		// center point coordinates (rad)
		const radLat = this.degToRad(degLat);
		const radLon = this.degToRad(degLon);

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
		  this.radToDeg(minLon),
		  this.radToDeg(minLat),
		  this.radToDeg(maxLon),
		  this.radToDeg(maxLat)
		];
	 };
}