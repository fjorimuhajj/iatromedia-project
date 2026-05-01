/**
 * homepage router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::homepage.homepage' as Parameters<typeof factories.createCoreRouter>[0]
);
