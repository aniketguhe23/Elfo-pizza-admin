// export interface NavItemConfig {
//   key: string;
//   title?: string;
//   disabled?: boolean;
//   external?: boolean;
//   label?: string;
//   icon?: string;
//   href?: string;
//   items?: NavItemConfig[];
//   // Matcher cannot be a function in order
//   // to be able to use it on the server.
//   // If you need to match multiple paths,
//   // can extend it to accept multiple matchers.
//   matcher?: { type: 'startsWith' | 'equals'; href: string };
// }

// types/nav.ts
export interface NavItemConfig {
  key: string;
  title: string;
  href?: string;
  icon?: keyof typeof navIcons;
  external?: boolean;
  disabled?: boolean;
  matcher?: (pathname: string) => boolean;
  items?: NavItemConfig[]; // ✅ nested sub-items
}
