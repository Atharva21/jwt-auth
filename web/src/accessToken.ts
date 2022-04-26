let accessToken = "";

export const getAccessToken = () => {
	return accessToken;
};

export const setAccessToken = (newToken: string) => {
	accessToken = newToken;
};
