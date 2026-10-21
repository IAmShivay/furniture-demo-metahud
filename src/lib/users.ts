import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';

import { db } from '@/db';
import { users, type UserRow } from '@/db/schema';
import type { Role } from '@/lib/rbac';
import type { UserAddress, UserPreferences } from '@/db/schema';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  avatar: string | null;
  isActive: boolean;
  emailVerified: boolean;
  addresses: UserAddress[];
  preferences: UserPreferences;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toUserDTO(row: UserRow): UserDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as Role,
    phone: row.phone,
    avatar: row.avatar,
    isActive: row.isActive,
    emailVerified: row.emailVerified,
    addresses: row.addresses ?? [],
    preferences: row.preferences ?? {},
    lastLogin: row.lastLogin ? new Date(row.lastLogin).toISOString() : null,
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export async function listUsers(query: UserListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  const conditions: SQL[] = [];

  if (query.search) {
    const term = `%${query.search}%`;
    conditions.push(or(ilike(users.name, term), ilike(users.email, term)) as SQL);
  }

  if (query.role) {
    conditions.push(eq(users.role, query.role));
  }

  if (query.isActive !== undefined) {
    conditions.push(eq(users.isActive, query.isActive));
  }

  const where = conditions.length ? and(...conditions) : undefined;

  const orderBy =
    query.sortBy === 'name'
      ? query.sortOrder === 'desc'
        ? desc(users.name)
        : asc(users.name)
      : query.sortBy === 'role'
        ? query.sortOrder === 'desc'
          ? desc(users.role)
          : asc(users.role)
        : desc(users.createdAt);

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(users).where(where).orderBy(orderBy).limit(limit).offset((page - 1) * limit),
    db.select({ total: count() }).from(users).where(where),
  ]);

  return {
    users: rows.map(toUserDTO),
    pagination: {
      current: page,
      pages: Math.max(1, Math.ceil(total / limit)),
      total,
      limit,
    },
  };
}

export async function countUsersByRole(): Promise<Record<string, number>> {
  const rows = await db
    .select({ role: users.role, total: count() })
    .from(users)
    .groupBy(users.role);

  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.role] = row.total;
    return accumulator;
  }, {});
}

export async function countNewUsers(sinceDays = 30): Promise<number> {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({ total: count() })
    .from(users)
    .where(sql`${users.createdAt} >= ${since.toISOString()}`);

  return rows[0]?.total ?? 0;
}
