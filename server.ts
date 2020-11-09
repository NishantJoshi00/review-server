import { Application, Router, send , Context} from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

import { userMiddleware } from "./middlewareUser.ts";
// import { authMiddleware } from "./middlewareAuth.ts";

import {
	home, login, register, pLogin, pRegister, logout, dbtest
} from "./routes.ts"

const app = new Application();
const router = new Router();

// Serving files in the folder ./static with extension .js || .css
app.use(async (ctx: Context, next: Function) => {

	if (ctx.request.url.pathname.endsWith(".css") || 
	ctx.request.url.pathname.endsWith(".js")) {
		const fileName: string = ctx.request.url.pathname;
		console.log(`Accessing: ${fileName}`);
		await send(ctx, fileName, {
			root: `${Deno.cwd()}/static`
		});
	} else {
		await next()
	}
})

app.use(userMiddleware)
router
	.get("/", home)
	.get("/login", login)
	.post("/login", pLogin)
	.get("/register", register)
	.post("/register", pRegister)
	.get("/logout", logout)

app.addEventListener('error', evt => {
	console.log(evt.error);
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8080 });
console.log("Started The application on : http://localhost:8080 ")