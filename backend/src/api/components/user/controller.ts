import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

// import { UtilityService } from '../../../services/utility';
import { UserRepository } from './repository';
import { IUserDocument } from './user.types';

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
			const users: IUserDocument = await this.repo.find({});

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
			const { emailID } = req.params;

			const user: IUserDocument | undefined = await this.repo.findOne({
            email: emailID
         });

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}
}