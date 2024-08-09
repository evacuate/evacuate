declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly EMAIL: string;
    readonly PASSWORD: string;
  }
}
