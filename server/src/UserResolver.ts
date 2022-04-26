import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { User } from "./entity/User";
import { compare, hash } from "bcryptjs";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;
	@Field()
	user: User;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return "Hello World!";
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	@Mutation(() => Boolean)
	async register(
		// @Arg("email", () => String) email: string, --> when we want to explicitly define the type of the argument as per graphql types.
		@Arg("email", () => String) email: string, //typegraphql will infer the type of the argument based on the type of the argument.
		@Arg("password", () => String) password: string
	) {
		try {
			await User.insert({
				email,
				password: await hash(password, 12),
			});
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg("email", () => String) email: string,
		@Arg("password", () => String) password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error("no user found");
		}
		const valid = await compare(password, user.password);
		if (!valid) {
			throw new Error("bad password");
		}
		// login successful

		sendRefreshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user,
		};
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() { payload }: MyContext) {
		return `your userId is ${payload?.userId}`;
	}

	@Mutation(() => Boolean)
	async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, "tokenVersion", 1);
		return true;
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: MyContext) {
		const authorization = context.req.headers["authorization"];
		if (!authorization) {
			return null;
		}
		try {
			const token = authorization?.split(" ")[1];
			const payload: any = verify(
				token,
				process.env.ACCESS_TOKEN_SECRET!
			);
			context.payload = payload as any;
			return User.findOne(payload.userId);
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { res }: MyContext) {
		sendRefreshToken(res, "");
		return true;
		// 👇 also works
		// res.clearCookie('jid')
	}
}
