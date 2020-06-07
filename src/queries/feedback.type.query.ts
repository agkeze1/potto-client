import gql from "graphql-tag";

const FEEDBACK_TYPE_PROPS = gql`
    fragment FeedbackTypeProps on FeedbackType {
        id
        name
        created_at
    }
`;

// Query Section
export const GET_FEEDBACK_TYPES = gql`
    query GET_FEEDBACK_TYPES {
        GetFeedbackTypes {
            docs {
                ...FeedbackTypeProps
            }
        }
    }
    ${FEEDBACK_TYPE_PROPS}
`;

export const NEW_FEEDBACK_TYPE = gql`
    mutation NewFeedbackType($name: String!) {
        NewFeedbackType(name: $name) {
            message
        }
    }
`;
export const REMOVE_FEEDBACK_TYPE = gql`
    mutation RemoveFeedbackType($id: ID!) {
        RemoveFeedbackType(id: $id) {
            message
        }
    }
`;
