import gql from "graphql-tag";

export const USER_PROPS = gql`
  fragment USER_PROPS on User {
    id
    name
    email
    gender
    phone
    image
    school {
      id
      name
    }
    created_at
  }
`;

// Query section
export const USER_LIST = gql`
  query USER_LIST($school: ID!, $page: Int, $limit: Int) {
    GetUsers(school: $school, page: $page, limit: $limit) {
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
