import { EventEmitter } from "./EventEmitter";
import PubNub from "pubnub";
import { authService } from "./../services/Auth.Service";
const user = authService.GetUser();

/**
 *
 * @param {any} data incoming message(data)
 */
export const handleNewData = (message: any) => {
    /**
     *
     * Response should the following props
     * - action
     *  - content
     */
    const { content, action } = message;

    EventEmitter.dispatch(action, content);
};

interface iNotifyProvider {
    action: string;
    content: any;
}

export default class NotifyProvider {
    static pubNub: PubNub;

    static NotifyAll(message: iNotifyProvider) {
        if (this.pubNub) {
            this.pubNub.publish({
                message: message,
                channel: user.school.id,
            });
        }
    }
}
