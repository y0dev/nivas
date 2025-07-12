import { Router } from 'express';
import { sendContactEmail } from './email.controller';

const router = Router({ mergeParams: true });

router.post('/contactUs', sendContactEmail);

export default router; 