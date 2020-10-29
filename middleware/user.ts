import { Context } from "https://deno.land/x/oak@v5.0.0/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"

import {users, User} from "../users.ts";

export const userMiddleware = async(ctx: Context, next: Function) => {
	const jwt = ctx.cookies.get('jwt')

	if (jwt) {
		const data = await validateJwt(jwt, Deno.env.get('JWT_KEY') || '', {isThrowing: false})
		if (data) {
			const user = users.find((u: User) => u.username == data.payload.iss);
			ctx.state.currentUser = user;
		} else {
			ctx.cookies.delete('jwt')
		}
	} else {
		ctx.state.currentUser = null;
	}
	await next();
}
