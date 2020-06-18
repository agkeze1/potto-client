import gql from "graphql-tag";

const STUDENT_MESSAGE_PROPS = gql`
    fragment StudentMessageProp on StudentMessage {
        id
        message
        created_at
        status
        students {
            id
            passport
            surname
            first_name
            full_name
            gender
            current_class {
                id
                name
            }
            reg_no
        }

        all_phone
        invalid_phone
        successful_phone
        smsPage
        sms_message
    }
`;
export const GET_STUDENT_MESSAGE = gql`
    query GetStudentMessage($page: Int, $limit: Int) {
        GetStudentMessageLog(page: $page, limit: $limit) {
            docs {
                ...StudentMessageProp
            }
            page
            limit
            nextPage
            prevPage
            totalPages
            totalDocs
        }
    }
    ${STUDENT_MESSAGE_PROPS}
`;

export const SEND_STUDENT_MESSAGE = gql`
    mutation SendStudentMessage($model: StudentMessageInput!) {
        SendStudentsMessage(model: $model) {
            message
            doc {
                ...StudentMessageProp
            }
        }
    }
    ${STUDENT_MESSAGE_PROPS}
`;
