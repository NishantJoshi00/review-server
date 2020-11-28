import type { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
import { hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt/mod.ts";
// import { users, User } from '../interfaces/users.ts';
import { usertable } from '../interfaces/user.ts';
import { config } from '../connections.ts'

// GET route to landing page AKA signup page
export const landing = async (ctx: RouterContext) => {
	const currentUser = await ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/landing.ejs`,
		{
			user: currentUser
		}
	);
}


// GET route for login page
export const login = async (ctx: RouterContext) => {
	const currentUser = await ctx.state.currentUser;
	console.log(currentUser)
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/user/login.ejs`,
		{
			user: currentUser
		}
	)
}


// Registration done at landing page maybe used later
export const register = async (ctx: RouterContext) => {
	const currentUser = await ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/register.ejs`,
		{
			user: currentUser
		}
	)
}

// POST request without authentication (Login)
export const pLogin =  async (ctx: RouterContext) => {
	const { value } = ctx.request.body({ type: "form"});
	const formData: URLSearchParams = await value;

	const username = formData.get('user[username]')
	const password = formData.get('user[password]')
	if (username == null || password == null) {
		console.log("[POST (/login)] Error in entered Data")
		return
	}
	// ?? CHANGE THE DB
	const user = await usertable.findOne({username: username});
	console.log(user)
	console.log()
	if (!user) {
		ctx.response.body = await renderFileToString(
			`${Deno.cwd()}/views/login.ejs`,
			{
				error: 'Something went wrong, (hint: check your usename!)',
				user: null
			}
		);
	} else if (!compareSync(password, user.password)) {
		ctx.response.body = await renderFileToString(
			`${Deno.cwd()}/views/login.ejs`,
			{
				error: 'Something went wrong, (hint: check your password!)',
				user: null
			}
		);
	} else {
		console.log
		const payload = {
			iss: user.username,
			exp: Date.now() + 1000 * 60 * 60
		};
		const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, config['JWT_KEY'] || '')
		ctx.cookies.set('jwt', jwt);
		ctx.response.redirect('/index');
	}
}


//POST request for 
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

	if (fname == null || lname == null || email == null || username == null || password == null) {
		ctx.response.redirect('/')
		console.log("[POST (/register)] Error in the formData")
		return
	}
	const userdata = {
		fname,
		lname,
		email,
		username,
		password: hashSync(password)
	}
	console.log(userdata)
	console.log("[POST (/register)] Adding to Database")
	usertable.insertOne(userdata)

	// // Add some middleware for adding extra layer of security before allowing any user

	ctx.response.redirect('/login');
}


// Logout post-route
export const logout = async (ctx: RouterContext) => {
	ctx.cookies.delete('jwt');
	ctx.response.redirect('/');
}
