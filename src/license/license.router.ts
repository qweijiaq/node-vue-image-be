import express from 'express';
import * as licenseController from './license.controller';
import { authGuard } from '../auth/auth.middleware';
import { paginate } from '../post/post.middleware';
import { LICENSES_PER_PAGE } from '../app/app.config';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 有效许可
 */
router.get('/valid-license', authGuard, licenseController.validLicense);

/**
 * 许可列表
 */
router.get(
  '/licenses',
  authGuard,
  paginate(LICENSES_PER_PAGE),
  accessLog({
    action: 'getLicenses',
    resourceType: 'license',
  }),
  licenseController.index,
);

export default router;
