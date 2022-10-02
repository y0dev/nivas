import { IComponentRoutes } from "../helper";
import { PaymentController } from "./payment.controller";
import { AuthService, PassportStrategy } from '../../../services/auth';

import { body, param, query } from 'express-validator';
import { Router } from "express";

export class PaymentRoutes implements IComponentRoutes<PaymentController> {
   readonly name: string = 'payment';
	readonly controller: PaymentController = new PaymentController();
	readonly router: Router = Router();
   authSerivce: AuthService;

   constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

   initRoutes(): void {
      this.router.get(
			'/create/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission(this.name, 'read'),
			body('email').isEmail(),
			body('firstName').isString(),
			body('lastName').isString(),
			body('active').isBoolean(),
			this.controller.createCustomer
		);
   }
   initChildRoutes?(): void {
      throw new Error("Method not implemented.");
   }
   
}