

## Components
- `server.ts` is the main file which is to be executed
- `users.ts` is where the database integration can be done
- `routes.ts` is where this route handlers are defined
- `middleware` is for providing authentication
- add all the webpages in the dir `assets/webpages` of ejs format

## Installation
- For Linux installation use the `install.sh`
- For Windows installation use powershell to run `install.ps1`

## Execution
- To run the server use the command
	```bash
	$ deno run --allow-net --allow-read --allow-env -r server.ts (Run the run.sh bash file after giving it +x permissions)
	```
- For starting the database integration, follow:
	1. uncomment the code for import in connections.ts
	2. use the following command for running the server
		```bash
		$ deno run --allow-net --allow-write --allow-read --allow-plugin --allow-env --unstable server.ts
	3. check the documentation at [Docs](https://deno.land/x/mongo@v0.13.0)

## Updated Components
- `server.ts` is the main file which is to be executed
- Store all the Mongo interfaces in the `interfaces` folder
- The `routes` folder is meant for (you guessed it) saving routes in different files according to it's use case. 
  i.e. all routes regarding users go to `user.ts`. For routes regarding book records create a `book.ts`
- `middleware` folder within the route folder holds all the middlewares including authentication
- `static` and `views` is for front end 