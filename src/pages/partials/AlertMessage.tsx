import React, { FC } from "react";
// import { authService } from "../services/Authentication.Service";

// template
interface MessageProp {
	message?: string;
	failed?: boolean;
}

const AlertMessage: FC<MessageProp> = ({ message = "", failed = false }) => {
	const stateClass = failed ? "alert alert-danger" : "alert alert-success";
	if (message?.includes("Unauthorized access!")) {
		// authService.Logout();
		window.location.reload(true);
	}
	if (message)
		return (
			<div className={stateClass} uk-alert>
				<p>
					{message
						.replace("GraphQL error:", "")
						.replace("Network error:", "")}
				</p>
			</div>
		);
	return null;
};
export default AlertMessage;
