export const ROLES = ['customer', 'support', 'manager', 'admin'] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LEVEL: Record<Role, number> = {
  customer: 0,
  support: 1,
  manager: 2,
  admin: 3,
};

export const ROLE_LABELS: Record<Role, string> = {
  customer: 'Customer',
  support: 'Support Agent',
  manager: 'Manager',
  admin: 'Administrator',
};

export const isRole = (value: unknown): value is Role =>
  typeof value === 'string' && (ROLES as readonly string[]).includes(value);

export const hasMinimumRole = (role: Role | undefined | null, minimum: Role): boolean => {
  if (!role) return false;
  return ROLE_LEVEL[role] >= ROLE_LEVEL[minimum];
};
