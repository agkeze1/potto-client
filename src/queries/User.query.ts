import gql from "graphql-tag";

export const USER_PROPS = gql`
  fragment USER_PROPS on User {
    id
    name
    email
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
  query GET_USER_LIST($page: Int, $limit: Int) {
    GetUsers(page: $page, limit: $limit) {
      docs {
        ...USER_PROPS
      }
      totalDocs
      totalPages
      page
      limit
      nextPage
      prevPage
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
    NewUserAccount(model: $model) {
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
  mutation USER_SETUP($userInput: UserInput!) {
    SetUp(UserInput: $userInput) {
      message
      token
      doc {
        ...USER_PROPS
      }
    }
  }
  ${USER_PROPS}
`;
