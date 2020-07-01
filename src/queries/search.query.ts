import gql from "graphql-tag";

export const ALL_SEARCH = gql`
    query ALL_SEARCH($search: String!) {
        StudentSearch(keyword: $search) {
            docs {
                id
                surname
                full_name
                reg_no
                gender
                state
                dob
                current_class {
                    id
                    name
                }
                guardians {
                    id
                    title
                    full_name
                }
                passport
            }
        }
        SearchTeacher(keyword: $search) {
            docs {
                id
                first_name
                name
                phone
                gender
                dob
                image
                doj
            }
        }
        SearchGuardian(keyword: $search) {
            docs {
                id
                name
                phone
                state
                full_name
                gender
                type {
                    id
                    name
                }
            }
        }
    }
`;
