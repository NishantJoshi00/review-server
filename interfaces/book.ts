import { dbclient } from "../connections.ts"
const db = dbclient.database("bookworm")

interface BookStore {
	_id: {$oid: string},
	name: string,
	author: string,
	image: string,
	description: string
}

const booktable = db.collection<BookStore>("books");

export {
	booktable
}