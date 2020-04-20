import gql from "graphql-tag";

export const ROLE_PROPS = gql`
  fragment ROLE_PROPS on Role {
    id
    name
    created_at
    desc
  }
`;

// Query Section
export const GET_ROLES = gql`
  query GET_ROLES {
    GetRoles {
      message
      docs {
        ...ROLE_PROPS
      }
    }
  }
  ${ROLE_PROPS}
`;

// Mutation Section
export const NEW_ROLE = gql`
  mutation NEW_ROLE($name: String!, $desc: String!) {
    NewRole(name: $name, desc: $desc) {
      message
      doc {
        ...ROLE_PROPS
      }
    }
  }
  ${ROLE_PROPS}
`;

export const REMOVE_ROLE = gql`
  mutation REMOVE_ROLE($id: ID!) {
    RemoveRole(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UPDATE_ROLE($id: ID!, $name: String!, $desc: String!) {
    UpdateRole(id: $id, name: $name, desc: $desc) {
      message
      doc {
        ...ROLE_PROPS
      }
    }
  }
  ${ROLE_PROPS}
`;
