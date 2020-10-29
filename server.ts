import { Application, Router, RouterContext } from "https://deno.lang/x/oak@v5.0.0/mod.ts";
import "https://deno.land/x/dotenv@v0.4.1/load.ts";

import { userMiddleware } from "./middleware/user.ts";
import { authMiddleware } from "./middleware/auth.ts";

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

app.addEventListener('error' evt => {
	console.log(evt.error);
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8080 });
console.log("Started The application on : http://localhost:8080 ")