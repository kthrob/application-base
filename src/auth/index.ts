import { Lucia, TimeSpan } from 'lucia'
import { sessions, users } from '~/data/schema.ts'

import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '~/data'
import { log } from '~/utils/log'

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

log.info('auth: ', import.meta.env.PROD);
export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(1, 'd'),
  sessionCookie: {
    //name: 'session',
    //expires: true,
    attributes: {
      // set to `true` when using HTTPS
      secure: import.meta.env.PROD,
    },
  },
  getSessionAttributes: (attributes) => {
    return {
      value: attributes.value
    };
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      value: attributes.id,
    };
  },
});

// !MPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: typeof users
  }
  interface DatabaseSessionAttributes {
    value: string;
  }
}
