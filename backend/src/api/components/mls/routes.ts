// import { Router } from 'express';
// import { body, param } from 'express-validator';

// import { AuthService, PassportStrategy } from '../../../services/auth';

// import { IComponentRoutes } from '../helper';

// import { MLSController } from './controller';

// export class MLSRoutes implements IComponentRoutes<MLSController> {
// 	readonly name: string = 'mls';
// 	readonly controller: MLSController = new MLSController();
// 	readonly router: Router = Router();
// 	authSerivce: AuthService;

// 	constructor(defaultStrategy?: PassportStrategy) {
// 		this.authSerivce = new AuthService(defaultStrategy);
// 		this.initRoutes();
// 	}

// 	initRoutes(): void {
// 		this.router.post(
// 			'/mls',
// 			body('city').isString(),
// 			body('state').isString(),
// 			body('zip_code').isString(),
// 			this.authSerivce.validateRequest,
// 			this.controller.signinUser
// 		);

// 		this.router.post(
// 			'/register/:uuid',
// 			param('uuid').isUUID(),
// 			body('email').isEmail(),
// 			body('firstname').isString(),
// 			body('lastname').isString(),
// 			body('password').isString(),
// 			this.authSerivce.validateRequest,
// 			this.controller.registerUser
// 		);

// 		this.router.post(
// 			'/invite',
// 			body('email').isEmail(),
// 			this.authSerivce.validateRequest,
// 			this.controller.createUserInvitation
// 		);

// 		this.router.post('/unregister', this.authSerivce.isAuthorized(), this.controller.unregisterUser);
// 	}
// }