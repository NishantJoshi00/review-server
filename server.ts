import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

import { userMiddleware } from "./middlewareUser.ts";
// import { authMiddleware } from "./middlewareAuth.ts";

import {
	home, login, register, pLogin, pRegister, logout
} from "./routes.ts"

const app = new Application();
const router = new Router();

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