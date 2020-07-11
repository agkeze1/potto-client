import gql from "graphql-tag";

export const EXEMPTION_PROP = gql`
    fragment EXEMPTION_PROP on Exemption {
        id
        start
        end
        desc
        created_at
        students {
            id
            first_name
            middle_name
            surname
            full_name
            reg_no
            gender
            dob
            state
            passport
            created_at
            current_class {
                id
                name
            }
            guardians {
                id
                full_name
            }
        }
    }
`;

export const GET_EXEMPTIONS = gql`
    query GetExemptions($page: Int, $limit: Int) {
        GetExemptions(page: $page, limit: $limit) {
            docs {
                ...EXEMPTION_PROP
            }
            page
            limit
            totalPages
            totalDocs
            nextPage
            prevPage
        }
    }
    ${EXEMPTION_PROP}
`;
export const NEW_EXEMPTION = gql`
    mutation NewExemption($model: ExemptionInput!) {
        NewExemption(model: $model) {
            message
            doc {
                ...EXEMPTION_PROP
            }
        }
    }
    ${EXEMPTION_PROP}
`;
