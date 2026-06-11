export interface Config {
  general: GeneralConfig;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  database: DatabaseConfig;
  authentication: AuthenticationConfig;
}

export interface GeneralConfig {
  webUrl: string;
}
export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface DatabaseConfig {
  url: string;
}

export interface AuthenticationConfig {
  secret: string;
  trusted: string[];
  url: string;
}
