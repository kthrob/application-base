import { defineMiddleware } from 'astro:middleware';
import { log } from '~/utils/log';
import { lucia } from '~/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null
  console.log("SESSION ID?: ", sessionId)
  if (!sessionId) {
    log.info('No session found')
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    log.info('Session is fresh')
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  if (!session) {
    log.info('Session is blank')
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  context.locals.session = session;
  context.locals.user = user;
  return next();
});
