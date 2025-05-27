
'use client';

export type User = {
  username: string;
  userType: 'vendedora' | 'cliente' | string; // Allow string for flexibility if other types exist
};

const USER_KEY = 'shopvision_user';

export function saveUserToLocalStorage(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUserFromLocalStorage(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
      }
    }
  }
  return null;
}

export function removeUserFromLocalStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}
