import { bind } from 'decko';
import { Router } from 'express';
import { Document, Model, Query, Types } from 'mongoose';

// import { AuthService } from '../../services/auth';
export interface IComponentRoutes<T> {
	readonly name: string;
	readonly controller: T;
	readonly router: Router;
	// authSerivce: AuthService;

	initRoutes(): void;
	initChildRoutes?(): void;
}

export interface IRead<T> {
   retrieve: (callback: (error: any, result: any) => void) => void;
   findById: (id: string, callback: (error: any, result: T) => void) => void;
   findOne(cond?: Object, callback?: (err: any, res: T) => void): Query<T>;
   find(cond: Object, fields: Object, options: Object, callback?: (err: any, res: T[]) => void): Query<T[]>;
 }
 
 export interface IWrite<T> {
   create: (item: T, callback: (error: any, result: any) => void) => void;
   update: (_id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) => void;
   delete: (_id: string, callback: (error: any, result: any) => void) => void;
 }

export abstract class AbsRepository<T extends Document> implements IRead<T>, IWrite<T> {
	protected readonly _name: string;
	protected readonly _model: Model<Document>;

	constructor(name: string, schemaModel: Model<Document>) {
		this._name = name;
		this._model = schemaModel;
	}

	/**
	 * Read all entities from db
	 *
    * @param callback function calldown
	 * @returns Entity array
	 */
	@bind
   retrieve(callback: (error: any, result: T) => void) {
      try {
         this._model.find({}, callback);
		} catch (err) {
			throw new Error(err);
		}
   }

   /**
	 * Read a certain entity from db
	 *
	 * @param _id Find options
    * @param callback function calldown
	 * @returns Entity
	 */
   @bind
   findById(_id: string, callback: (error: any, result: T) => void) {
      try {
			this._model.findById(_id, callback);
		} catch (err) {
			throw new Error(err);
		}
   }

	/**
	 * Read a certain entity from db
	 *
	 * @param options Find options
    * @param callback function calldown
	 * @returns Entity
	 */
	@bind
   findOne(options?: Object, callback?: (err: any, res: T) => void): Query<T> {
      try {
			return this._model.findOne(options, callback);
		} catch (err) {
			throw new Error(err);
		}
   }

   /**
	 * Read a certain entity from db
	 *
	 * @param options Find options
    * @param callback function calldown
	 * @returns Entity
	 */
   @bind
   find(cond?: Object, fields?: Object, options?: Object, callback?: (err: any, res: T[]) => void): Query<T[] | undefined> {
      try {
			return this._model.find(cond, options, callback);
		} catch (err) {
			throw new Error(err);
		}
    }

	/**
	 * Save new or updated entity to db
	 *
	 * @param entity Entity to save
    * @param callback function calldown
	 * @returns Saved entity
	 */
	@bind
   create(entity: T, callback: (error: any, result: T) => void) {
      try {
			this._model.create(entity, callback);
		} catch (err) {
			throw new Error(err);
		}
   }

   update(_id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
      try {
         this._model.update({ _id: _id }, item, callback);
		} catch (err) {
			throw new Error(err);
		}
    }

	/**
	 * Delete entity from db
	 *
	 * @param _id Find options
    * @param callback function calldown
	 * @returns Deleted entity
	 */
	@bind
   delete(_id: string, callback: (error: any, result: any) => void) {
      try {
			this._model.remove({ _id: this.toObjectId(_id) }, (err) => callback(err, null));
		} catch (err) {
			throw new Error(err);
		}
   }

   private toObjectId(_id: string): Types.ObjectId {
      return Types.ObjectId.createFromHexString(_id);
   }
}