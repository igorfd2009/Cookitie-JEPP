// Logger utilitário para centralizar logs
export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.log(message, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(message, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.warn(message, ...args);
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.info(message, ...args);
    }
  }
};

// Logger para servidor (Deno)
export const serverLogger = {
  log: (message: string, ...args: unknown[]) => {
    if (import.meta.env.PROD === false) {
      console.log(message, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (import.meta.env.PROD === false) {
      console.warn(message, ...args);
    }
  }
};
