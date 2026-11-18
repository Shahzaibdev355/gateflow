function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
}

export const SERVICES = {
  USERS: getRequiredEnv("USERS_SERVICE_URL"),
  ORDERS: getRequiredEnv("ORDERS_SERVICE_URL"),
} as const;
