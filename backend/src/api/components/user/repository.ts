import { bind } from 'decko';
import UserSchema from "./user.schema";

import { AbsRepository } from '../helper';
import { UserModel } from './user.model';

export class UserRepository extends AbsRepository<UserModel> {
	constructor() {
		super('user', UserSchema);
	 }

	/**
	 * Read user by email from db
	 *
	 * @param email Email to search for
	 * @returns User
	 */
	@bind
	readByEmail(email: string): Promise<UserModel> {
		try {
			return this.find({
				email: email
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}