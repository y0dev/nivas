import { BasicStrategy as Strategy_Basic } from 'passport-http';
import { Strategy as Strategy_Jwt } from 'passport-jwt';
import { UserModel } from '../../../api/components/user/user.model';
import { UserRepository } from '../../../api/components/user/user.repository';

// import { policy } from '../../../config/policy';

// import { User } from '../../../api/components/user/model';

/**
 * Abstract BaseStrategy
 *
 * Other strategies inherits from this one
 */
export abstract class BaseStrategy {
	protected readonly repo: UserRepository = new UserRepository();
	protected _strategy: Strategy_Jwt | Strategy_Basic;

	/**
	 * Get strategy
	 *
	 * @returns Returns Passport strategy
	 */
	public get strategy(): Strategy_Jwt | Strategy_Basic {
		return this._strategy;
	}

	/**
	 * Sets acl permission for user
	 *
	 * @param user
	 * @returns
	 */
	protected async setPermissions(user: UserModel): Promise<void> {
		// add role from db
		// await policy.addUserRoles(user.u_id, 'TBD');
	}
}