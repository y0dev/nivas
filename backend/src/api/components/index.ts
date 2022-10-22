import { Router } from 'express';

import { UserRoutes } from './user/user.routes';
import { MLSRoutes } from './mls/mls.routes';
import { PaymentRoutes } from './payment/payment.routes';

/**
 * Init component routes
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerApiRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/users`, new UserRoutes().router);
	router.use(`${prefix}/payment`, new PaymentRoutes().router);
	router.use(`${prefix}/mls`, new MLSRoutes().router);
}