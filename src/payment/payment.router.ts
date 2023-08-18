import express from 'express';
import * as paymentController from './payment.controller';

const router = express.Router();

/**
 * 支付方法
 */
router.get('/payments', paymentController.index);

export default router;
