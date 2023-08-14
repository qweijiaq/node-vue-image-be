import express from 'express';
import * as productController from './product.controller';

const router = express.Router();

/**
 *  许可产品
 */
router.get('/products/license', productController.showLicenseProduct);

/**
 * 订阅产品
 */
router.get('/products/subscription', productController.showSubscriptionProduct);

export default router;
