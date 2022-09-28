import axios from 'axios';
import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { MLSRepository } from './mls.repository';
import { IMLSDocument } from './mls.types';



export class MLSController {

	private readonly mlsRepo: MLSRepository = new MLSRepository();

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
	@bind
	async getZillow(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { city, state, zip_code } = req.body;
         const url = (city !== undefined && state !== undefined) ? `https://www.zillow.com/homes/${city},-${state}_rb/` :
         ``;
         const {} = await axios.get(
            url,
            {
              headers: {
               'user-agent':'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1'
              },
            },
          );
         // homes/zip_code_rb/
         // homes/city,-state_rb/
			// const user: User | undefined = await this.userRepo.read({
			// 	select: ['id', 'email', 'firstname', 'lastname', 'password', 'active'],
			// 	where: {
			// 		email,
			// 		active: true
			// 	}
			// });

			// if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
			// 	return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			// }

			// Create jwt -> required for further requests
			// const token: string = this.authService.createToken(user.id);

			// // Don't send user password in response
			// delete user.password;

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
	async retrieveSearches(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { u_id } = req.params;
			const { email } = req.body;

			const mlsDoc: IMLSDocument | undefined = await this.getUserSearches(u_id, email);

			if (!mlsDoc) {
				return res.status(403).json({ error: 'Invalid U_ID' });
			}

			return res.status(200).json(mlsDoc);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user invitation that is required for registration
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
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

	/**
	 * Unregister user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns HTTP response
	 */
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

	/**
	 * Get user invitation
	 *
	 * @param u_id
	 * @param email
	 * @returns User invitation
	 */
	@bind
	private async getUserSearches(u_id: string, email: string): Promise<IMLSDocument | undefined> {
		try {
			return this.mlsRepo.find({ u_id: u_id, email: email });
		} catch (err) {
			throw err;
		}
	}
}