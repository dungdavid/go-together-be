import { User } from '@prisma/client';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export function toAuthUser(user: User): AuthUser {
  return { id: user.id, username: user.username, displayName: user.displayName };
}
