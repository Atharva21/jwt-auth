import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import cors from "cors";

(async () => {
	const app = express();
	app.use(
		cors({
			credentials: true,
			origin: "http://localhost:3000",
		})
	);
	app.use(cookieParser());
	app.get("/", (_, res) => res.send("Hello World!"));

	app.post("/refresh_token", async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: "" });
		}
		let payload: any = null;
		try {
			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
		} catch (error) {
			console.error(error);
			return res.send({ ok: false, accessToken: "" });
		}
		const user = await User.findOne({ id: payload.userId });
		if (!user) {
			return res.send({ ok: false, accessToken: "" });
		}

		if (user.tokenVersion !== payload.tokenVersion) {
			return res.send({ ok: false, accessToken: "" });
		}

		sendRefreshToken(res, createRefreshToken(user));

		return res.send({ ok: true, accessToken: createAccessToken(user) });
	});

	await createConnection();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
		}),
		context: ({ req, res }) => ({ req, res }),
		// typeDefs: `
		// 	type Query {
		// 		hello: String
		// 	}
		// `,
		// resolvers: {
		// 	Query: {
		// 		hello: () => "Hello World!",
		// 	},
		// },
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(4000, () =>
		console.log("Express server is running on port 4000")
	);
})();
