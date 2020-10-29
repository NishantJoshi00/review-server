export interface User {
	name: string,
	username: string,
	password: string
}
export const users: User[] = [];
// TODO: Using an object instead of an array to access a database