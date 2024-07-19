import type { Config } from 'drizzle-kit'
//import * as dotenv from 'dotenv';
export default {
  dialect: 'sqlite',
	schema: './src/data/schema.ts',
	out: './src/data',
	driver: 'turso',
	dbCredentials: {
    // url: process.env.TURSO_DATABASE_URL!,
		// authToken: process.env.TURSO_AUTH_TOKEN,
    url:'http://127.0.0.1:8080'
	},
} satisfies Config
