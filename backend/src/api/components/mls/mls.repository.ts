import { MLSSchema } from "./mls.schema";

import { AbsRepository } from '../helper';
import { IMLSDocument } from './mls.types';

export class MLSRepository extends AbsRepository<IMLSDocument> {
	constructor() {
		super('mls', MLSSchema);
	 }
}