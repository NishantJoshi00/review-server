import type { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
// import { hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts"; 
// import { create } from "https://deno.land/x/djwt/mod.ts";
import { booktable } from '../interfaces/book.ts'


export const index = async (ctx: RouterContext) => {
	const currentUser = ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/index.ejs`,
		{
			user: currentUser
		}
	);
}

export const newBook = async (ctx: RouterContext) => {
	const currentUser = ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/form.ejs`,
		{
			user: currentUser
		}
	);
}

export const postBook = async (ctx: RouterContext) => {
	const { value } = ctx.request.body({ type: "form"});
	const formData: URLSearchParams = await value;
	const name = formData.get("book[name]")
	const author = formData.get("book[name]")
	const image = formData.get("book[image]")
	const description = formData.get("book[description]")

	if (!name || !author || !image || !description) {
		console.log("[POST (/new)] Error in one of the fields")
		return
	}

	const entry = {
		name,
		author,
		image,
		description
	}
	console.log(entry)
	console.log("[POST (/new)] Adding to Database")
	booktable.insertOne(entry)
	
}