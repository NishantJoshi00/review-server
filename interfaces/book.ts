import { dbclient } from "../connections.ts"
const db = dbclient.database("bookworm")


interface Comment {
	_id: {$oid: string},
	author: {
		$ref: "users",
		$id: {$oid: string}
	}
	title: string,
	body: string
}
const comments = db.collection<Comment>("comments");


interface BookStore {
	_id: {$oid: string},
	name: string,
	author: string,
	image: string,
	description: string,
	genre: string,
	pageCount: number,
	launchYear: number,
	comment: {
		$ref: "comments",
		$id: {$oid: string}
	}[]
}


const booktable = db.collection<BookStore>("books");

export {
	booktable,
	comments
}