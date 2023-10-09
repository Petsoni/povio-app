type ObjectValues<T> = T[keyof T];

const USER_ROLES = {
  BACKEND: "BACKEND",
  FRONTEND: "FRONTEND",
  DESIGN: "DESIGN",
  FINANCE: "FINANCE",
  SUPPORT: "SUPPORT",
} as const;

/***
 * Types of certificates that can be requested (insert new types here)
 * @module {Student | Student Services}
 */
export type UserRole = ObjectValues<typeof USER_ROLES>;
