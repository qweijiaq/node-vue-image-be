import express from 'express';
import * as paymentUrlController from './payment-url.controller';
import { paymentUrlGuard } from './payment-url.middleware';

const router = express.Router();

/**
 * 支付地址
 */
router.get('/payment-url', paymentUrlGuard, paymentUrlController.paymentUrl);

export default router;
