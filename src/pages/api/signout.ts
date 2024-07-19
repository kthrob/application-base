import type { APIContext } from 'astro'
import { lucia } from '~/auth'

export async function POST(context: APIContext): Promise<Response> {
	console.log('LOGOUT API: ', context.locals.session)
	if (!context.locals.session) {
		return new Response(null, {
			status: 401,
		})
	}

	await lucia.invalidateSession(context.locals.session.id)

	const sessionCookie = lucia.createBlankSessionCookie()
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

	return context.redirect('/')
}
