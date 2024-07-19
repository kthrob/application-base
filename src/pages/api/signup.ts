import type { APIContext } from 'astro';
import { db } from '~/data';
import {eq} from 'drizzle-orm'
import { generateId } from 'lucia';
import { hash } from '@node-rs/argon2';
import { lucia } from '~/auth';
import {users} from '~/data/schema'

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get('username');
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (typeof username !== 'string' || username.length < 3 || username.length > 31 || !/^[a-z0-9_-]+$/.test(username)) {
    return new Response(
      JSON.stringify({
        error: 'Invalid username',
      }),
      {
        status: 400,
      }
    );
  }
  const password = formData.get('password');
  if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
    return new Response(
      JSON.stringify({
        error: 'Invalid password',
      }),
      {
        status: 400,
      }
    );
  }

  const email = formData.get('email');
  if (typeof email!=='string' ||!email.includes('@')) {
    return new Response(
      JSON.stringify({
        error: 'Invalid email',
      }),
      {
        status: 400,
      }
    );
  }
  
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateId(15);

  try {
    // db.prepare('INSERT INTO user (id, username, password_hash) VALUES(?, ?, ?)').run(userId, username, passwordHash);
    console.log("SIGNUP --------> ", email)
    const existingUser = await db.select().from(users).where()
    if (existingUser) console.log("EXISTING USER FOUND: ", existingUser)
    const newUser = await db.insert(users).values({ email: email, username: username, password_hash: passwordHash, id: userId}).returning()
    console.log("NEW USER CREATED: ", newUser)
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // return new Response();
    return context.redirect('/views/user');
  } catch (e) {
    // if (e.message === 'SQLITE_CONSTRAINT_UNIQUE') {
    //   return new Response(
    //     JSON.stringify({
    //       error: 'Username already used',
    //     }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }
    return new Response(
      JSON.stringify({
        error: 'An unknown error occurred',
        message: e.message,
      }),
      {
        status: 500,
      }
    );
  }
}
