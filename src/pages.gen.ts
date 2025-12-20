// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_DashboardIndex_getConfig } from './pages/dashboard/index';
// prettier-ignore
import type { getConfig as File_DashboardMonthlyAssetsYearMonthIndex_getConfig } from './pages/dashboard/monthly/assets/[yearMonth]/index';
// prettier-ignore
import type { getConfig as File_DashboardMonthlyIndex_getConfig } from './pages/dashboard/monthly/index';
// prettier-ignore
import type { getConfig as File_DashboardSalaryIndex_getConfig } from './pages/dashboard/salary/index';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_LoginIndex_getConfig } from './pages/login/index';
// prettier-ignore
import type { getConfig as File_MyIndex_getConfig } from './pages/my/index';

// prettier-ignore
type Page =
| ({ path: '/dashboard' } & GetConfigResponse<typeof File_DashboardIndex_getConfig>)
| ({ path: '/dashboard/monthly/assets/[yearMonth]' } & GetConfigResponse<typeof File_DashboardMonthlyAssetsYearMonthIndex_getConfig>)
| ({ path: '/dashboard/monthly' } & GetConfigResponse<typeof File_DashboardMonthlyIndex_getConfig>)
| ({ path: '/dashboard/salary' } & GetConfigResponse<typeof File_DashboardSalaryIndex_getConfig>)
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
