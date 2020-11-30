import type { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { helpers } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
// import { hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts"; 
// import { create } from "https://deno.land/x/djwt/mod.ts";
import { booktable, comments } from '../interfaces/book.ts'
import { usertable } from '../interfaces/user.ts';
import { ObjectId } from "../connections.ts";

export const index = async (ctx: RouterContext) => {
	const currentUser = await ctx.state.currentUser;
	console.log("[GET ] New Book")
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/index.ejs`,
		{
			user: currentUser,
			books: await booktable.find({  })
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
	const author = formData.get("book[author]")
	const image = formData.get("book[image]")
	const description = formData.get("book[description]")
	const genre = formData.get("book[genre]");
	const launchYear = Number(formData.get("book[launchYear]"));
	const pageCount = Number(formData.get("book[pageCount]"));
	
	if (!name || !author || !image || !description || !genre || !launchYear || !pageCount) {
		console.log("[POST (/new)] Error in one of the fields")
		return
	}

	const entry = {
		name,
		author,
		image,
		description,
		genre,
		launchYear, 
		pageCount,
		comments: []
	}
	console.log(entry)
	console.log("[POST (/new)] Adding to Database")
	const { $oid } = await booktable.insertOne(entry);
	ctx.response.redirect(`/books/${$oid}`)
	console.log($oid)
}

export const getBook = async (ctx: RouterContext) => {

	const { bookId } = ctx.params;
	if (bookId == null) return
	console.log(bookId)
	const currentUser = ctx.state.currentUser;
	const book = await booktable.findOne({"_id": ObjectId(bookId)});
	if (!book) {
		ctx.response.redirect("/index")
	}
	console.log(book);
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/show.ejs`,
		{
			user: currentUser,
			book: book

		}
	);
}




export const postComment = async (ctx: RouterContext) => {
	const { value } = ctx.request.body({ type: "form"});
	const { bookId } = ctx.params;
	if (bookId == null) return
	console.log(bookId)
	const currentUser = await ctx.state.currentUser;
	const formData: URLSearchParams = await value;
	const body = formData.get("comment[body]")

	// console.log(currentUser)
	if (!body || !currentUser) {
		console.log("[POST (/comment)] Error in one of the fields")
		return
	}

	const entry = {
		author: currentUser._id["$oid"],
		body
	}
	// console.log(entry)
	console.log("[POST (/new)] Adding to Database")
	await comments.insertOne(entry);
	ctx.response.redirect(`/index`)
}