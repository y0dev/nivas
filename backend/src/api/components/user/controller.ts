import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '../../../services/utility';

export class UserController {
   private readonly repo: UserRepository = new UserRepository();

	/**
	 * Read users
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const users: User[] = await this.repo.readAll({}, true);

			return res.json(users);
		} catch (err) {
			return next(err);
		}
	}

   /**
	 * Read user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
   async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			const user: User | undefined = await this.repo.read({
				where: {
					id: +userID
				}
			});

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}
}