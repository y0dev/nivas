import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { UtilityService } from '../../../services/utility';
import { UserModel } from './user.model';

// import { UtilityService } from '../../../services/utility';
import { UserRepository } from './user.repository';
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
			const { email } = req.params;

			const user: IUserDocument | undefined = await this.repo.findOne({
            email: email
         });

			return res.json(user);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	 @bind
	 async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		 try {
			 const { email, userName, firstName, lastName, password, active } = req.body;
 
			 const existingUser: UserModel | undefined = await this.repo.find({
				 email: email
			 });
 
			 if (existingUser) {
				 return res.status(400).json({ error: 'Email is already taken' });
			 }
 
			 const user: IUserDocument = await UserModel.createUser({
				userName: userName,
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			 });

 
			 return res.json(user);
		 } catch (err) {
			 return next(err);
		 }
	 }
 

}