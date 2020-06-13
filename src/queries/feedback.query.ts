import gql from "graphql-tag";

const FEEDBACK_PROPS = gql`
    fragment FeedbackProps on Feedback {
        id
        subject
        content
        created_at
        type {
            id
            name
        }
        resolved
    }
`;
// Query Section
export const GET_FEEDBACKS = gql`
    query GET_FEEDBACKS($type: ID) {
        GetFeedbacks(type: $type) {
            docs {
                ...FeedbackProps
            }
            page
            limit
            totalPages
            totalDocs
            nextPage
            prevPage
        }
        GetFeedbackTypes {
            docs {
                id
                name
            }
        }
    }
    ${FEEDBACK_PROPS}
`;

export const SEND_FEEDBACK = gql`
    mutation SendFeedback($model: FeedbackInput!) {
        NewFeedback(model: $model) {
            message
        }
    }
`;

export const RESOLVE_FEEDBACK = gql`
    mutation ResolveFeedback($id: ID!) {
        ResolveFeedback(id: $id) {
            message
        }
    }
`;
