const config = JSON.parse(Deno.readTextFileSync("./config.json"));
// // Uncomment this for access to mongodb
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const dbclient = new MongoClient();
dbclient.connectWithUri(config['DB_URL']);

export {
	config,
	dbclient,
	ObjectId
}
