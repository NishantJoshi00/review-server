interface User {
	name: string,
	username: string,
	password: string
}
const users: User[] = [];
// TODO: Using an object instead of an array to access a database
export type { User };
export {
	users
}