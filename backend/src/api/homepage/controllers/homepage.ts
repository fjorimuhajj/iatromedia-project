/**
 * homepage controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::homepage.homepage' as Parameters<typeof factories.createCoreController>[0]
);
