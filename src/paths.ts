export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    webpages: '/dashboard/webpages',
    settings: '/dashboard/settings',
    category: '/dashboard/menu/category',
    subcategory: '/dashboard/menu/subcategory',
    items: '/dashboard/menu/items',
    itemVarient: '/dashboard/menu/itemVarients',
    allitems: '/dashboard/allItems',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
