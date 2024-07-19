import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql'
import {log} from '~/utils/log'

const tursoClient = createClient({
  // url: import.meta.env.TURSO_DATABASE_URL,
  // authToken: import.meta.env.TURSO_DATABASE_AUTH_TOKEN,
  url: 'http://127.0.0.1:8080',
});

export const db = await drizzle(tursoClient);

console.log("db: ", db)
log.info('Database connected');

