// import type { NavItemConfig } from '@/types/nav';
// import { paths } from '@/paths';

// export const navItems = [
//   { key: 'dashboard', title: 'Dashboard', href: paths.dashboard.overview, icon: 'chart-pie' },
//   { key: 'pages', title: 'Pages', href: paths.dashboard.webpages, icon: 'plugs-connected' },
//   // { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
//   // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
//   // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
//   // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
// ] satisfies NavItemConfig[];

// components/dashboard/sidenav/config.ts
import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems: NavItemConfig[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    href: paths.dashboard.overview,
    icon: 'chart-pie',
  },
  {
    key: 'pages',
    title: 'Pages',
    href: paths.dashboard.webpages,
    icon: 'chart-pie',
  },
  {
    key: 'menuItems',
    title: 'Menu Items',
    icon: 'plugs-connected',
    items: [
      { key: 'category', title: 'Category', href: paths.dashboard.category },
      { key: 'subCategory', title: 'Sub Category', href: paths.dashboard.subcategory },
      { key: 'items', title: 'Items', href: paths.dashboard.items },
      { key: 'itemsVarient', title: 'Items Varient', href: paths.dashboard.itemVarient },
    ],
  },
];
