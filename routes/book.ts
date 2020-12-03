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
	console.log("[GET /] New Book")
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
	const currentUser = await ctx.state.currentUser;


	/// <- RETRIVING THE COMMENT FROM THE BOOK
	const book = await booktable.findOne({"_id": ObjectId(bookId)});
	if (book == null) {
		ctx.response.redirect("/index")
		return
	}
	// console.log(book);
	let coms = book.comments;
	if (coms == undefined) coms = []
	console.log("THis is Value: ")
	const comm = book.comments.map(async (x, y) => {
		const value = await comments.findOne({_id: x});
		console.log(value)
		console.log(await usertable.findOne({ _id: value?.author }))
		return {
			author: (await usertable.findOne({ _id: value?.author}))?.username,
			body: value?.body,
			time: value?.time,
		}
	})
	const comment: {
		author: string | undefined;
		body: string | undefined;
		time: Date | null | undefined;
	}[] = []
	for (let i = 0; i < comm.length; i++) {
		comment[i] = await comm[comm.length - 1 - i];
	}
	// <-
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/show.ejs`,
		{
			user: currentUser,
			book: book,
			comment: comment
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
	if (!body || !currentUser) {
		console.log("[POST (/comment)] Error in one of the fields")
		return
	}

	const entry = {
		author: currentUser._id,
		body,
		book: ObjectId(bookId)
	}
	console.log(entry)
	console.log("[POST (/new)] Adding to Database")
	const commentId = await comments.insertOne(entry);

	// -> INSERTING THE COMMENT INTO THE BOOK
	const book = await booktable.findOne({ _id: ObjectId(bookId) });
	if (book == null) return
	console.log(book);
	book.comments.push(commentId);


	await booktable.updateOne({ _id: ObjectId(bookId) }, { $set: { comments: book.comments } });
	// <-
	ctx.response.redirect(`/books/${bookId}`);
}