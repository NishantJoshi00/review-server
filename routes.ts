import type { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
import { hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
import { users, User } from './users.ts';

// DB integration
import { dbclient } from './connections.ts'
const db = dbclient.database("website")

interface UserAuth {
	_id: {$oid: string},
	fname: string,
	lname: string,
	email: string,
	username: string,
	password: string
}

const usertable = db.collection<UserAuth>("users");


// GET routes without user authentication
export const home = async (ctx: RouterContext) => {
	const currentUser = ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/home.ejs`,
		{
			user: currentUser
		}
	);
}

export const login = async (ctx: RouterContext) => {
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/login.ejs`,
		{
			error: false,
		}
	)
}

export const register = async (ctx: RouterContext) => {
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/register.ejs`,
		{}
	)
}

// POST request without authentication
export const pLogin =  async (ctx: RouterContext) => {
	const { value } = ctx.request.body({ type: "form-data"});
	const ff  = await value.read();
	const text = ff.fields


	const username = text['username']
	const password = text['password']

	const user = users.find((u: User) => u.username == username)
	if (!user) {
		ctx.response.body = await renderFileToString(
			`${Deno.cwd()}/views/login.ejs`,
			{
				error: 'Something went wrong, (hint: check your usename!)'
			}
		);
	} else if (!compareSync(password, user.password)) {
		ctx.response.body = await renderFileToString(
			`${Deno.cwd()}/views/login.ejs`,
			{
				error: 'Something went wrong, (hint: check your password!)'
			}
		);
	} else {
		const payload = {
			iss: user.username,
			exp: Date.now() + 1000 * 60 * 60
		};
		const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, Deno.env.get('JWT_KEY') || '')
		ctx.cookies.set('jwt', jwt);
		ctx.response.redirect('/');
	}
}

export const pRegister = async (ctx: RouterContext) => {
	const { value } = ctx.request.body({ type: "form"});
	const formData: URLSearchParams = await value;

	if (formData.get("user[pass]") != formData.get("user[repass]")) {
		ctx.response.body = await renderFileToString(
			`${Deno.cwd()}/views/login.ejs`,
			{
				error: 'Something went wrong, (hint: check your password!)'
			}
		);
	}
	const fname = formData.get("user[fname]");
	const lname = formData.get("user[lname]");
	const email = formData.get("user[email]");
	const username = formData.get("user[username]");
	const password = formData.get("user[pass]");

	if (fname == null || lname == null || email == null || username == null || password == null) return;
	const userdata = {
		fname,
		lname,
		email,
		username,
		password: hashSync(password)
	}
	usertable.insertOne(userdata)

	// // Add some middleware for adding extra layer of security before allowing any user

	ctx.response.redirect('/login');
}

// GET request after authentication

export const prRoute = async (ctx: RouterContext) => {
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/dashboard.ejs`,
		{}
	)
}

export const logout = async (ctx: RouterContext) => {
	ctx.cookies.delete('jwt');
	ctx.response.redirect('/');
}

export const dbtest = async (ctx: RouterContext) => {
	
}
