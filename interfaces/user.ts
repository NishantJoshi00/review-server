import { dbclient } from '../connections.ts'
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

export {
	usertable
};