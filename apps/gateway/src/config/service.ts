function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }

  return value;
}

export const SERVICES = {
  USERS: getRequiredEnv("USER_SERVICE_URL"),
  ORDERS: getRequiredEnv("ORDER_SERVICE_URL"),
} as const;
