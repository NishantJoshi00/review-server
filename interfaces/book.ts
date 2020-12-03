import { dbclient, ObjectId } from "../connections.ts"
const db = dbclient.database("bookworm")


interface Comment {
	_id: {$oid: string},
	author: ObjectId
	body: string,
	time: null | Date,
	book: ObjectId
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
	comments: ObjectId[] // HEAVY TO COMPUTE
}


const booktable = db.collection<BookStore>("books");

export {
	booktable,
	comments
}