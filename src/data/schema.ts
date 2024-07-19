import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

import { email } from 'valibot'
import { sql } from 'drizzle-orm'

export const users = sqliteTable(
	'users',
	{
		id: text('id').notNull().primaryKey(),
    username: text('username').notNull().unique(),
    password_hash: text('password_hash').notNull(),
    email: text('email').notNull().unique(),
		// first_name: text('first_name'),
		// last_name: text('last_name'),
		// email: text('email').notNull().unique(),
		// hashed_password: text('hashed_password').notNull(),
		created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		// verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
		role: text('role', { enum: ['User', 'Admin', 'Dev'] }).notNull().default('User'),
	},
	// (user) => ({
	// 	emailIdx: uniqueIndex('emailIdx').on(user.email),
	// })
)

export const sessions = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull(),
})

export type User = {
  id: string
  userName: string
  email: string
  passwordHash: string
  createdAt: Date
  role: 'User' | 'Admin' | 'Dev'
}
