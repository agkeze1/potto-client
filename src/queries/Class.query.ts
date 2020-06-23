import gql from "graphql-tag";

export const CLASS_PROPS = gql`
    fragment CLASS_PROPS on Class {
        id
        name
        created_at
        level {
            id
            name
        }
        form_teacher {
            id
            first_name
            middle_name
            last_name
            phone
            image
            name
            created_at
        }
    }
`;

// Query Section
export const GET_CLASSES = gql`
    query GET_CLASSES($level: ID!) {
        GetClasses(level: $level) {
            message
            docs {
                ...CLASS_PROPS
            }
        }
    }
    ${CLASS_PROPS}
`;

export const GET_CLASS = gql`
    query GET_CLASS($id: ID!) {
        GetClass(id: $id) {
            message
            doc {
                ...CLASS_PROPS
            }
        }
    }
    ${CLASS_PROPS}
`;

// Mutation Section
export const NEW_CLASS = gql`
    mutation NEW_CLASS($name: String!, $level: ID!, $formTeacher: ID) {
        NewClass(name: $name, level: $level, formTeacher: $formTeacher) {
            message
            doc {
                ...CLASS_PROPS
            }
        }
    }
    ${CLASS_PROPS}
`;

export const REMOVE_CLASS = gql`
    mutation REMOVE_CLASS($id: ID!) {
        RemoveClass(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const UPDATE_CLASS = gql`
    mutation UPDATE_CLASS($id: ID, $name: String, $formTeacher: ID) {
        UpdateClass(id: $id, name: $name, formTeacher: $formTeacher) {
            message
            doc {
                ...CLASS_PROPS
            }
        }
    }
    ${CLASS_PROPS}
`;

// Query Section
export const GET_CLASSES_MINI = gql`
    query GET_CLASSES_MINI($level: ID!) {
        GetClasses(level: $level) {
            docs {
                id
                name
            }
        }
    }
`;
