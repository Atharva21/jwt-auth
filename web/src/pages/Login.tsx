import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useLoginMutation();
	const history = useHistory();
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				const response = await login({
					variables: {
						email,
						password,
					},
					update: (store, { data }) => {
						if (!data) {
							return null;
						}
						store.writeQuery<MeQuery>({
							query: MeDocument,
							data: {
								me: data.login.user,
							},
						});
					},
				});
				console.log(response);
				if (response && response.data) {
					setAccessToken(response.data.login.accessToken);
				}
				history.push("/");
			}}
		>
			<div>
				<input
					type="text"
					value={email}
					placeholder="email"
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
			</div>
			<div>
				<input
					type="password"
					value={password}
					placeholder="password"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
			</div>
			<button type="submit">Login</button>
		</form>
	);
};
