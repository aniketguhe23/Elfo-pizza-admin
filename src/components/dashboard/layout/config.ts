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
    title: 'Resturant Config',
    href: paths.dashboard.resturantMenuItems,
    icon: 'chart-pie',
  },
  {
    key: 'allOrders',
    title: 'Orders',
    href: paths.dashboard.allOrders,
    icon: 'chart-pie',
  },
  {
    key: 'locationSetup',
    title: 'Location Setup',
    href: paths.dashboard.locationSetup,
    icon: 'chart-pie',
  },
  {
    key: 'customer',
    title: 'Customers',
    href: paths.dashboard.customers,
    icon: 'chart-pie',
  },
  {
    key: 'coupons',
    title: 'Coupons',
    href: paths.dashboard.coupons,
    icon: 'chart-pie',
  },

  {
    key: 'reports',
    title: 'Reports',
    icon: 'plugs-connected',
    items: [
      { key: 'transactionReports', title: 'Transaction Reports', href: paths.dashboard.transactionReports },
      { key: 'orderReports', title: 'Order Reports', href: paths.dashboard.orderReports },
      { key: 'campaignReports', title: 'Campaign Reports', href: paths.dashboard.campaignReports },
      { key: 'foodReports', title: 'Food Reports', href: paths.dashboard.foodReports },
    ],
  },
  {
    key: 'pages',
    title: 'Pages',
    href: paths.dashboard.webpages,
    icon: 'chart-pie',
  },
  {
    key: 'pages',
    title: 'Refunds',
    href: paths.dashboard.refunds,
    icon: 'chart-pie',
  },
  {
    key: 'pages',
    title: 'Contact Support',
    href: paths.dashboard.contactSupport,
    icon: 'chart-pie',
  },
  {
    key: 'pages',
    title: 'Resturant Support',
    href: paths.dashboard.resturantSupport,
    icon: 'chart-pie',
  },
  {
    key: 'pages',
    title: 'Chat',
    href: paths.dashboard.chat,
    icon: 'chart-pie',
  },
];
