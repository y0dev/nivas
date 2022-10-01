import { Router } from 'express';
import { body, header, param } from 'express-validator';

import { AuthService, PassportStrategy } from '../../../services/auth';

import { IComponentRoutes } from '../helper';

import { MLSController } from './mls.controller';

export class MLSRoutes implements IComponentRoutes<MLSController> {
	readonly name: string = 'mls';
	readonly controller: MLSController = new MLSController();
	readonly router: Router = Router();
	authService: AuthService;

	constructor(defaultStrategy?: PassportStrategy) {
		this.authService = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/search',
         header('user-agent').isString(),
			body('city').isString(),
			body('state').isString(),
			body('user_id').isString(),
			this.authService.validateRequest,
			this.controller.getZillowByCity
		);


		this.router.get(
			'/search/:zipcode',
         header('user-agent').isString(),
			body('user_id').isString(),
			param('zipcode').isString(),
			this.authService.validateRequest,
			this.controller.getZillowByZipCode
		);

		this.router.get(
			'/history/:uuid',
			param('uuid').isUUID(),
			this.authService.validateRequest,
			this.controller.retrieveSearches
		);

	}
}