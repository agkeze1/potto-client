import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { authService } from "./services/Auth.Service";
import { GET_API_URL } from "./context/App";
import ApolloClient from "apollo-boost";
import ThemeSelector from "./theme/ThemeSelector";

const client = new ApolloClient({
    uri: GET_API_URL(),
    request: (operation) => {
        const token = authService.GetToken();
        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        });
    },
    onError: ({ networkError }) => {
        if (networkError) {
            networkError.message = "An error occurred! Check your internet connection and try again.";
        }
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router>
            <ThemeSelector>
                <App />
            </ThemeSelector>
        </Router>
    </ApolloProvider>,
    document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
