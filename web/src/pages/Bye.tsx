import React from "react";
import { useByeQuery } from "../generated/graphql";

interface ByeProps {}

export const Bye: React.FC<ByeProps> = ({}) => {
	const { data, error, loading } = useByeQuery({
		fetchPolicy: "network-only",
	});
	if (loading) {
		return <div>loading...</div>;
	}
	if (error) {
		console.log(error);
		return <div>error</div>;
	}
	if (!data) {
		return <div>no data</div>;
	}
	return <div>{JSON.stringify(data)}</div>;
};
