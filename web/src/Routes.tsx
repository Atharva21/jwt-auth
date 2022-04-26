import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Header } from "./Header";
import { Bye } from "./pages/Bye";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const Routes: React.FC = () => {
	return (
		<BrowserRouter>
			<Header />
			<div>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/bye" component={Bye} />
					<Route path="/" render={() => <h1>Not Found!</h1>} />
				</Switch>
			</div>
		</BrowserRouter>
	);
};
