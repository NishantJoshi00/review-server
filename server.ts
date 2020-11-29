import { Application, Router, send , Context} from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { userMiddleware } from "./routes/middleware/middlewareUser.ts";
import { authMiddleware } from "./routes/middleware/middlewareAuth.ts";
import { parse } from 'https://deno.land/std/flags/mod.ts';
import {
	landing, login, register, pLogin, pRegister, logout
} from "./routes/user.ts";

import {
	index, newBook, postBook, getBook, postComment
} from "./routes/book.ts";

const app = new Application();
const router = new Router();

// Serving files in the folder ./static with extension .js || .css
app.use(async (ctx: Context, next: Function) => {

	if (ctx.request.url.pathname.endsWith(".css") ||
		ctx.request.url.pathname.endsWith(".js") ||
		ctx.request.url.pathname.endsWith(".jpg")||
		ctx.request.url.pathname.endsWith(".png")) {
		const fileName: string = ctx.request.url.pathname;
		
		console.log(`Accessing: ${fileName}`);
		await send(ctx, fileName, {
			root: `${Deno.cwd()}/static`
		});
	} else {
		
		await next()
	}
})

app.use(userMiddleware);
router
	.get("/", landing)
	.get("/index",index)
	.get("/login", login)
	.get("/new",newBook)
	.post("/login", pLogin)
	.get("/register", register)
	.post("/register", pRegister)
	.get("/logout", logout)
	.post("/new", postBook)
	.get("/books/:bookId", getBook)
	.post("/new", authMiddleware, postComment)
	// .get("/dashboard", authMiddleware, dash);
app.addEventListener('error', evt => {
	console.log(evt.error);
})

app.use(router.routes());
app.use(router.allowedMethods());
const { args } = Deno;
const DEFAULT_PORT = 8000;
const argPort = parse(args).port;


app.listen({
	port: argPort ? Number(argPort) : DEFAULT_PORT
});

console.log(`Started The application on : http://localhost:${argPort ? Number(argPort) : DEFAULT_PORT} `);