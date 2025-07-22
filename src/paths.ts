export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    webpages: '/dashboard/webpages',
    settings: '/dashboard/settings',
    // menu
    category: '/dashboard/menu/category',
    subcategory: '/dashboard/menu/subcategory',
    items: '/dashboard/menu/items',
    itemVarient: '/dashboard/menu/itemVarients',
    allitems: '/dashboard/allItems',
    // pizzacustomization
    cheeseOptions: '/dashboard/pizzacustomization/cheeseOptions',
    crustTypes: '/dashboard/pizzacustomization/crustTypes',
    doughTypes: '/dashboard/pizzacustomization/doughTypes',
    extraSauces: '/dashboard/pizzacustomization/extraSauces',
    sauces: '/dashboard/pizzacustomization/sauces',
    toppings: '/dashboard/pizzacustomization/toppings',
    sizes: '/dashboard/pizzacustomization/sizes',
    //resturants
    resturantMenuItems: '/dashboard/resturant-menu-items',
    //orders
    allOrders: '/dashboard/allOrders',
    locationSetup: '/dashboard/locationSetup',
    customers: '/dashboard/customers',
    coupons: '/dashboard/coupons',
    transactionReports: '/dashboard/transaction-reports',
    orderReports: '/dashboard/order-reports',
    campaignReports: '/dashboard/campaign-reports',
    foodReports: '/dashboard/food-reports',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
