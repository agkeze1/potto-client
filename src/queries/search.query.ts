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
                current_class {
                    id
                    name
                }
                guardians {
                    id
                    title
                    full_name
                }
            }
        }
        SearchTeacher(keyword: $keyword) {
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
    }
`;
