import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

import { findUserById, toUserDTO, type UserDTO } from '@/lib/users';
import { hasMinimumRole, type Role } from '@/lib/rbac';
import { SESSION_COOKIE, sessionCookieOptions, verifySessionToken } from '@/lib/session';

export { SESSION_COOKIE, sessionCookieOptions };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  return verifySessionToken(token);
}

export async function getCurrentUser(): Promise<UserDTO | null> {
  const payload = await getSessionPayload();

  if (!payload) return null;

  const row = await findUserById(payload.sub);

  if (!row || !row.isActive) return null;

  return toUserDTO(row);
}

export async function requireUser(minimumRole?: Role): Promise<UserDTO | null> {
  const user = await getCurrentUser();

  if (!user) return null;
  if (minimumRole && !hasMinimumRole(user.role, minimumRole)) return null;

  return user;
}
