import os from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import parseArgs from "minimist";

const argv = parseArgs(process.argv.slice(2), {
  alias: { p: ["PORT", "port"], m: ["mode", "MODE"] },
  default: { p: 8080, m: "FORK" }
});

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  NODE_ENV,
  PORT: process.env.PORT || Number(argv.PORT) || 8080,
  MODE: process.env.MODE || argv.MODE || "FORK",
  numCPUs: os.cpus().length,
  logsFolder: path.join(__dirname, "logs"),
  fileSystemDb: {
    path: path.join(__dirname, "..", "DB"),
    messagesFile: "mensajes.json",
    productsFile: "productos.json"
  },
  mariaDb: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: process.env.MARIADB_USER || "root",
      password: process.env.MARIADB_PWD || "",
      database: process.env.MARIADB_DB || "test",
      charset: "utf8mb4"
    }
  },
  sqlite3: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "..", "DB", "ecommerce.sqlite")
    },
    useNullAsDefault: true
  },
  mongoDb: {
    connectionString: process.env.MONGODB_URI || "mongodb://localhost/test",
    options: {
      //useNewUrlParser: true, //No necesario desde mongoose 6
      //useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 5000
    }
  },
  mongoDbAtlas: {
    connectionString: process.env.MONGODB_ATLAS_URI,
    options: {
      //useNewUrlParser: true, //No necesario desde mongoose 6
      //useUnifiedTopology: true, //No necesario desde mongoose 6
      serverSelectionTimeoutMS: 7000
    }
  },
  session: {
    mongoStoreOptions: {
      mongoUrl:
        process.env.PERS === "mongodb"
          ? process.env.MONGODB_URI
          : process.env.MONGODB_ATLAS_URI,
      mongoOptions:
        process.env.PERS === "mongodb"
          ? { useUnifiedTopology: true }
          : {
              useNewUrlParser: true,
              useUnifiedTopology: true
            }
    },
    options: {
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 10 * 60 * 1000
      }
    }
  }
};

export default config;
