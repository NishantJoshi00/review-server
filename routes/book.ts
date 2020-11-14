import type { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs/mod.ts";
// import { hashSync, compareSync} from "https://deno.land/x/bcrypt/mod.ts"; 
// import { create } from "https://deno.land/x/djwt/mod.ts";

export const index = async (ctx: RouterContext) => {
	const currentUser = ctx.state.currentUser;
	ctx.response.body = await renderFileToString(
		`${Deno.cwd()}/views/books/index.ejs`,
		{
			// user: currentUser
		}
	);
}
