import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../../services/auth';
import { UtilityService } from '../../../services/utility';
import { UserModel } from '../user/user.model';
import { UserRepository } from '../user/user.repository';
import { IUserDocument } from '../user/user.types';

// import { User } from '../user/model';
// import { UserRole } from '../user-role/model';
// import { UserRepository } from '../user/repository';

// import { UserInvitation } from '../user-invitation/model';
// import { UserInvitationRepository } from '../user-invitation/repository';
// import { UserInvitationMailService } from '../user-invitation/services/mail';

export class AuthController {
	private readonly authService: AuthService = new AuthService();
	// private readonly userInvMailService: UserInvitationMailService = new UserInvitationMailService();

	private readonly userRepo: UserRepository = new UserRepository();
	// private readonly userInvRepo: UserInvitationRepository = new UserInvitationRepository();

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, password } = req.body;

			const userDoc: IUserDocument | undefined = await this.userRepo.find({
				email: email
			});

         const user: UserModel = new UserModel(userDoc);

			if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
				return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			}

			// Create jwt -> required for further requests
			const token: string = this.authService.createToken(user.u_id);

			// Don't send user password in response
			delete user.password;

			return res.json({ token, user });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Register new user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { uuid } = req.params;
			const { userName, email, firstName, lastName, password } = req.body;

			// const invitation: UserInvitation | undefined = await this.getUserInvitation(uuid, email);

			// if (!invitation) {
			// 	return res.status(403).json({ error: 'Invalid UUID' });
			// }

			const userDoc: IUserDocument | undefined = await this.userRepo.find({
				email: email
			});

         const user: UserModel = new UserModel(userDoc);

			if (user) {
				return res.status(400).json({ error: 'Email is already taken' });
			}
         
			const newUser: IUserDocument = await UserModel.createUser({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
         });
			// newUser.userRole = new UserRole(1, 'Admin');

			// await this.userInvRepo.delete(invitation);

			return res.status(200).json(newUser);
		} catch (err) {
			return next(err);
		}
	}

	// /**
	//  * Create user invitation that is required for registration
	//  *
	//  * @param req Express request
	//  * @param res Express response
	//  * @param next Express next
	//  * @returns HTTP response
	//  */
	// @bind
	// async createUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	// 	try {
	// 		const { email } = req.body;

	// 		const existingUser: User | undefined = await this.userRepo.read({
	// 			where: {
	// 				email
	// 			}
	// 		});

	// 		if (existingUser) {
	// 			return res.status(400).json({ error: 'Email is already taken' });
	// 		}

	// 		const existingInvitation: UserInvitation | undefined = await this.userInvRepo.read({
	// 			where: {
	// 				email
	// 			}
	// 		});

	// 		if (existingInvitation) {
	// 			return res.status(400).json({ error: 'User is already invited' });
	// 		}

	// 		// UUID for registration link
	// 		const uuid = UtilityService.generateUuid();

	// 		const invitation: UserInvitation = new UserInvitation(undefined, email, uuid, true);

	// 		await this.userInvRepo.save(invitation);
	// 		await this.userInvMailService.sendUserInvitation(email, uuid);

	// 		return res.status(200).json(uuid);
	// 	} catch (err) {
	// 		return next(err);
	// 	}
	// }

	// /**
	//  * Unregister user
	//  *
	//  * @param req Express request
	//  * @param res Express response
	//  * @param next Express next
	//  * @returns HTTP response
	//  */
	// @bind
	// async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
	// 	try {
	// 		const { email } = req.user as User;

	// 		const user: User | undefined = await this.userRepo.read({
	// 			where: {
	// 				email
	// 			}
	// 		});

	// 		if (!user) {
	// 			return res.status(404).json({ error: 'User not found' });
	// 		}

	// 		await this.userRepo.delete(user);

	// 		return res.status(204).send();
	// 	} catch (err) {
	// 		return next(err);
	// 	}
	// }

	// /**
	//  * Get user invitation
	//  *
	//  * @param uuid
	//  * @param email
	//  * @returns User invitation
	//  */
	// @bind
	// private async getUserInvitation(uuid: string, email: string): Promise<UserInvitation | undefined> {
	// 	try {
	// 		return this.userInvRepo.read({ where: { uuid, email } });
	// 	} catch (err) {
	// 		throw err;
	// 	}
	// }
}