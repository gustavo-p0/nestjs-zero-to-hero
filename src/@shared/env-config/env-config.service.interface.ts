interface IEnvConfig {
  getDB_HOST(): string;
  getDB_PORT(): number;
  getDB_USERNAME(): string;
  getDB_PASSWORD(): string;
  getDB_DATABASE(): string;
  getJWT_SECRET(): string;
}

export { IEnvConfig };
