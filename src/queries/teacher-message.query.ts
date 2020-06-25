import gql from "graphql-tag";

const TEACHER_MESSAGE_PROPS = gql`
    fragment TeacherMessageProp on TeacherMessage {
        id
        message
        created_at
        percent
        status
        teachers {
            id
            image
            name
            first_name
            phone
        }
        excluded {
            id
            name
            image
            phone
            first_name
        }
        all_phone
        invalid_phone
        successful_phone
        smsPage
        sms_message
    }
`;

export const GET_TEACHER_MESSAGE = gql`
    query GetTeacherMessage($page: Int, $limit: Int) {
        GetTeacherMessageLog(page: $page, limit: $limit) {
            docs {
                ...TeacherMessageProp
            }
            page
            limit
            nextPage
            prevPage
            totalPages
            totalDocs
        }
    }
    ${TEACHER_MESSAGE_PROPS}
`;

export const SEND_TEACHER_MESSAGE = gql`
    mutation SendTeachersMessage($model: TeacherMessageInput!) {
        SendTeachersMessage(model: $model) {
            message
            doc {
                ...TeacherMessageProp
            }
        }
    }
    ${TEACHER_MESSAGE_PROPS}
`;
