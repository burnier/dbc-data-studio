/**
 * Database connection using Drizzle ORM with SQLite.
 */
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("./abigail2.db");
export const db = drizzle(sqlite, { schema });



