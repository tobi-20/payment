import express from 'express';
import { createPaymentHandler } from '../handlers/handlers';
const router = express.Router();
router.post('/payments', createPaymentHandler);
export default router;
