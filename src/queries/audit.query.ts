import gql from "graphql-tag";

export const AUDIT_PROPS = gql`
    fragment AUDIT_PROPS on AuditLog {
        id
        summary
        action
        user {
            id
            name
            image
            email
        }
        desc
        created_at
    }
`;

export const GET_LOGS = gql`
    query GetAudits($page: Int, $limit: Int, $user: ID, $action: String) {
        GetAudits(page: $page, limit: $limit, user: $user, action: $action) {
            docs {
                ...AUDIT_PROPS
            }
            page
            limit
            nextPage
            prevPage
            totalDocs
            totalPages


        }
    }
    ${AUDIT_PROPS}
`;
