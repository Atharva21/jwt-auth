import { User } from "./entity/User";
import jwt from "jsonwebtoken";

export const createAccessToken = (user: User): string => {
	return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
		expiresIn: "15m",
	});
};

export const createRefreshToken = (user: User): string => {
	return jwt.sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_TOKEN_SECRET!,
		{
			expiresIn: "7d",
		}
	);
};
