import gql from "graphql-tag";

export const LEVEL_PROPS = gql`
    fragment LEVEL_PROPS on Level {
        id
        name
        created_at
    }
`;

// Query Section
export const GET_LEVELS = gql`
    query GET_LEVELS {
        GetLevels {
            docs {
                ...LEVEL_PROPS
            }
        }
    }
    ${LEVEL_PROPS}
`;

// Mutation Section
export const NEW_LEVEL = gql`
    mutation NEW_LEVEL($name: String!) {
        NewLevel(name: $name) {
            message
            doc {
                ...LEVEL_PROPS
            }
        }
    }
    ${LEVEL_PROPS}
`;

export const REMOVE_LEVEL = gql`
    mutation REMOVE_LEVEL($id: ID!) {
        RemoveLevel(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const UPDATE_LEVEL = gql`
    mutation UPDATE_LEVEL($id: ID!, $name: String!) {
        UpdateLevel(id: $id, name: $name) {
            message
            doc {
                ...LEVEL_PROPS
            }
        }
    }
    ${LEVEL_PROPS}
`;
