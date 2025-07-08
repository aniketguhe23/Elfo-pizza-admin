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
    title: 'Add Menu Items',
    icon: 'plugs-connected',
    items: [
      { key: 'category', title: 'Category', href: paths.dashboard.category },
      { key: 'subCategory', title: 'Sub Category', href: paths.dashboard.subcategory },
      { key: 'items', title: 'Items', href: paths.dashboard.items },
      { key: 'itemsVarient', title: 'Items Varient', href: paths.dashboard.itemVarient },
    ],
  },
  {
    key: 'pizzaCustomization',
    title: 'Pizza Customization',
    icon: 'plugs-connected',
    items: [
      { key: 'sizes', title: 'Sizes', href: paths.dashboard.sizes },
      { key: 'doughTypes', title: 'Dough Types', href: paths.dashboard.doughTypes },
      { key: 'crustTypes', title: 'Crust Types', href: paths.dashboard.crustTypes },
      { key: 'sauces', title: 'Sauces', href: paths.dashboard.sauces },
      { key: 'cheeseOptions', title: 'Cheese Options', href: paths.dashboard.cheeseOptions },
      { key: 'toppings', title: 'Toppings', href: paths.dashboard.toppings },
      { key: 'extraSauces', title: 'Extra Sauces', href: paths.dashboard.extraSauces },
    ],
  },
  {
    key: 'allItems',
    title: 'All Items',
    href: paths.dashboard.allitems,
    icon: 'chart-pie',
  },
  {
    key: 'resturantItems',
    title: 'Resturant Items',
    href: paths.dashboard.resturantMenuItems,
    icon: 'chart-pie',
  },
];
