export type LogLevel = "debug" | "info" | "warn" | "error";

const formatTimestamp = (date: Date = new Date()): string => {
   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const day = days[date.getDay()];
   const month = date.getMonth() + 1;
   const dateNum = date.getDate();
   const year = date.getFullYear();
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");
   const seconds = String(date.getSeconds()).padStart(2, "0");
   return `${day.toUpperCase()} ${dateNum}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const write = (level: LogLevel, message: unknown, ...args: unknown[]): void => {
   if (!__DEV__) return;

   const timestamp = formatTimestamp();
   const prefix = `[${timestamp}]`;

   switch (level) {
      case "warn":
         console.warn(prefix, message, ...args);
         break;
      case "error":
         console.error(prefix, message, ...args);
         break;
      case "debug":
         console.debug(prefix, message, ...args);
         break;
      default:
         console.log(prefix, message, ...args);
         break;
   }
};

export const logger = {
   debug: (message: unknown, ...args: unknown[]) => write("debug", message, ...args),
   info: (message: unknown, ...args: unknown[]) => write("info", message, ...args),
   warn: (message: unknown, ...args: unknown[]) => write("warn", message, ...args),
   error: (message: unknown, ...args: unknown[]) => write("error", message, ...args),
};
