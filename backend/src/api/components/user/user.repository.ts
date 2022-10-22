import { bind } from 'decko';
import { UserSchema } from "./user.schema";

import { AbsRepository } from '../helper';
import { IUserDocument } from './user.types';

export class UserRepository extends AbsRepository<IUserDocument> {
	constructor() {
		super('user', UserSchema);
	 }
}