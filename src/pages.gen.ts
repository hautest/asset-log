// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_AssetsYearMonthIndex_getConfig } from './pages/assets/[yearMonth]/index';
// prettier-ignore
import type { getConfig as File_DashboardIndex_getConfig } from './pages/dashboard/index';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_LoginIndex_getConfig } from './pages/login/index';
// prettier-ignore
import type { getConfig as File_MyIndex_getConfig } from './pages/my/index';

// prettier-ignore
type Page =
| ({ path: '/assets/[yearMonth]' } & GetConfigResponse<typeof File_AssetsYearMonthIndex_getConfig>)
| ({ path: '/dashboard' } & GetConfigResponse<typeof File_DashboardIndex_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/login' } & GetConfigResponse<typeof File_LoginIndex_getConfig>)
| ({ path: '/my' } & GetConfigResponse<typeof File_MyIndex_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
