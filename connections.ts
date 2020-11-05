const config = JSON.parse(Deno.readTextFileSync("./config.json"));
// // Uncomment this for access to mongodb
// import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

// const dbclient = new MongoClient();
// dbclient.connectWithUri(config['DB_URL']);


export {
	config,
	// dbclient
}