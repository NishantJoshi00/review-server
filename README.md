

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
	$ deno run --allow-net server.ts
	```
