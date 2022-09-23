import { bind } from 'decko';
import { Handler, NextFunction, Request, Response } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import { use } from 'passport';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { validationResult } from 'express-validator';

import { policy } from '../../config/policy';

import { JwtStrategy } from './strategies/jwt';
import { UserModel } from '../../api/components/user/user.model';

export type PassportStrategy = 'jwt';

export interface IGetUserAuthInfoRequest extends Request {
   user: UserModel // or any other type
 }
/**
 * AuthService
 *
 * Available passport strategies for authentication:
 *  - JWT (default)
 *
 * Pass a strategy when initializing module routes to setup this strategy for the complete module: Example: new UserRoutes('jwt')
 *
 * To setup a strategy for individual endpoints in a module pass the strategy on isAuthorized call
 * Example: isAuthorized('basic')
 */
export class AuthService {
	private defaultStrategy: PassportStrategy;
	private jwtStrategy: JwtStrategy;

	private readonly strategyOptions: StrategyOptions = {
		audience: 'expressjs-api-client',
		issuer: 'expressjs-api',
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: 'my-super-secret-key'
	};

	// JWT options
	private readonly signOptions: SignOptions = {
		audience: this.strategyOptions.audience,
		expiresIn: '8h',
		issuer: this.strategyOptions.issuer
	};

	public constructor(defaultStrategy: PassportStrategy = 'jwt') {
		// Setup default strategy -> use jwt if none is provided
		this.defaultStrategy = defaultStrategy;
		this.jwtStrategy = new JwtStrategy(this.strategyOptions);
	}

	/**
	 * Create JWT
	 *
	 * @param userID Used for JWT payload
	 * @returns Returns JWT
	 */
	public createToken(userID: number): string {
		return sign({ userID }, this.strategyOptions.secretOrKey as string, this.signOptions);
	}

	/**
	 * Middleware for verifying user permissions from acl
	 *
	 * @param resource Requested resource
	 * @param action Performed action on requested resource
	 * @returns Returns if action on resource is allowed
	 */
	public hasPermission(resource: string, action: string): Handler {
		return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
			try {
				const { u_id } = req.user as UserModel;
				const access: boolean = await policy.isAllowed(u_id, resource, action);

				if (!access) {
					return res.status(403).json({
						error: 'Missing user rights!'
					});
				}

				return next();
			} catch (err) {
				return next(err);
			}
		};
	}

	/**
	 * Init passport strategies
	 *
	 * @returns
	 */
	public initStrategies(): void {
		use('jwt', this.jwtStrategy.strategy);
	}

	/**
	 * Setup target passport authorization
	 *
	 * @param strategy Passport strategy
	 * @returns Returns if user is authorized
	 */
	@bind
	public isAuthorized(strategy?: PassportStrategy): Handler {
		return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
			try {
				if (process.env.NODE_TEST !== '1') {
					// if no strategy is provided use default strategy
					const tempStrategy: PassportStrategy = strategy || this.defaultStrategy;
					return this.doAuthentication(req, res, next, tempStrategy);
				}

				// Mock user
				const testUser: UserModel = UserModel.mockTestUser();
				req.user = testUser;
				policy.addUserRoles(testUser.u_id, 'TBD');

				return next();
			} catch (err) {
				return next(err);
			}
		};
	}

	@bind
	public validateRequest(req: Request, res: Response, next: NextFunction): Response | void {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array() });
		}

		return next();
	}

	/**
	 * Executes the target passport authorization
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @param strategy Passport strategy name
	 * @returns Returns if user is authorized
	 */
	@bind
	private doAuthentication(
		req: Request,
		res: Response,
		next: NextFunction,
		strategy: PassportStrategy
	): Handler | void {
		try {
			switch (strategy) {
				case 'jwt':
					return this.jwtStrategy.isAuthorized(req, res, next);
				default:
					throw new Error(`Unknown passport strategy: ${strategy}`);
			}
		} catch (err) {
			return next(err);
		}
	}
}