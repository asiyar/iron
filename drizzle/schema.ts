import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const coachPrograms = mysqlTable("coachPrograms", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  summary: text("summary").notNull(),
  goal: varchar("goal", { length: 120 }).notNull(),
  visibility: mysqlEnum("visibility", ["private_link", "public"]).default("private_link").notNull(),
  shareCode: varchar("shareCode", { length: 32 }).notNull().unique(),
  templateJson: text("templateJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiRecommendations = mysqlTable("aiRecommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sourceFingerprint: varchar("sourceFingerprint", { length: 64 }).notNull(),
  recommendationJson: text("recommendationJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CoachProgram = typeof coachPrograms.$inferSelect;
export type InsertCoachProgram = typeof coachPrograms.$inferInsert;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
