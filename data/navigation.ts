export type NavItem = {
  label: string;
  href: string;
  icon: "layout-grid" | "monitor" | "user-plus" | "megaphone" | "user" | "settings";
  badge?: number;
};

export const navMain: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "layout-grid" },
  { label: "Class Details", href: "/class-details", icon: "monitor" },
  { label: "CR Join Requests", href: "/cr-join-requests", icon: "user-plus", badge: 3 },
  { label: "Announcements", href: "/announcements", icon: "megaphone" },
  { label: "Profile", href: "/profile", icon: "user" },
];

export const navSystem: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "settings" },
];
