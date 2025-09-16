declare global {
  interface Window {
    AppleID?: {
      auth: {
        signIn(): Promise<any>;
        init(config: any): void;
      };
    };
  }
}

export {};