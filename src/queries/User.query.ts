import gql from "graphql-tag";

export const USER_PROPS = gql`
    fragment USER_PROPS on User {
        id
        name
        email
        gender
        phone
        image
        created_at
        admin
    }
`;

// Query section
export const USER_LIST = gql`
    query USER_LIST($page: Int, $limit: Int) {
        GetUsers(page: $page, limit: $limit) {
            message
            totalDocs
            totalPages
            page
            limit
            nextPage
            prevPage
            docs {
                ...USER_PROPS
            }
        }
    }
    ${USER_PROPS}
`;

// Mutation Section

export const USER_LOGIN = gql`
    mutation USER_LOGIN($email: String!, $password: String!) {
        Login(email: $email, password: $password) {
            message
            doc {
                ...USER_PROPS
                school {
                    id
                    name
                    logo
                    alias
                }
                admin
                superAdmin
            }
            token
        }
    }
    ${USER_PROPS}
`;

export const NEW_USER = gql`
    mutation NEW_USER($model: UserInput!) {
        NewUser(model: $model) {
            message
            doc {
                ...USER_PROPS
            }
        }
    }
    ${USER_PROPS}
`;

export const FIRST_USER = gql`
    query FIRST_SETUP {
        FirstSetup
    }
`;

export const USER_SETUP = gql`
    mutation USER_SETUP($model: UserInput!) {
        SetUp(model: $model) {
            message
            token
            doc {
                ...USER_PROPS
                school {
                    id
                    name
                    alias
                }
                admin
                superAdmin
            }
        }
    }
    ${USER_PROPS}
`;

export const REMOVE_USER = gql`
    mutation REMOVE_USER($id: ID!) {
        RemoveUser(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UPDATE_USER($id: ID!, $model: UserUpdateInput!) {
        UpdateUser(id: $id, model: $model) {
            message
            doc {
                ...USER_PROPS
            }
        }
    }
    ${USER_PROPS}
`;
export const GET_SUPER_ADMINS = gql`
    query GetSuperAdmins {
        GetSuperAdmins {
            docs {
                ...USER_PROPS
            }
        }
    }
    ${USER_PROPS}
`;

export const NEW_SUPER_ADMIN = gql`
    mutation NewSuperAdmin($model: UserInput!) {
        NewSuperAdmin(model: $model) {
            message
        }
    }
`;

export const UPDATE_USER_IMAGE = gql`
    mutation ChangeUserImage($id: ID!, $path: String!) {
        ChangeUserImage(id: $id, path: $path) {
            message
        }
    }
`;

export const PASSWORD_RESET = gql`
    mutation UserPasswordReset($email: String!) {
        UserPasswordReset(email: $email)
    }
`;
export const NEW_USER_PASSWORD = gql`
    mutation NewUserPassword($token: String!, $email: String!, $password: String!) {
        NewUserPassword(email: $email, token: $token, password: $password) {
            message
            doc {
                ...USER_PROPS
            }
            token
        }
    }
    ${USER_PROPS}
`;
