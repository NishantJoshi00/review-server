import type { Context } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v1.8/mod.ts"
import { usertable } from "../../interfaces/user.ts";
import { config } from "../../connections.ts"
export const userMiddleware = async(ctx: Context, next: Function) => {
	const jwt = ctx.cookies.get('jwt')
	if (jwt) {
		const data = await verify(jwt, config['JWT_KEY'] || '', 'HS512')
		if (data) {
			const user = usertable.findOne({username: data.iss});
			ctx.state.currentUser = user;
		} else {
			ctx.cookies.delete('jwt')
		}
		console.log("JWT Verified")
	} else {
		ctx.state.currentUser = null;
	}
	
	await next();
}
