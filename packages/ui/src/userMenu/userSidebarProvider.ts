import { createSidebar } from '../sidebarFactory';

/**
 * Provider for the mobile userMenu, implementing the sidebar
 */

const {
  Provider: UserSidebarProvider,
  Drawer: UserSidebarDrawer,
  useSidebar: useUserSidebar,
} = createSidebar('user');

export { UserSidebarDrawer, UserSidebarProvider, useUserSidebar };
