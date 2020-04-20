import gql from "graphql-tag";

export const GUARDIAN_PROPS = gql`
  fragment GUARDIAN_PROPS on Guardian {
    id
    title
    name
    gender
    image
  }
`;

// Query Section
export const GET_GUARDIAN = gql`
  query GET_GUARDIAN($id: ID!) {
    GetGuardian(id: $id) {
      message
      doc {
        ...GUARDIAN_PROPS
      }
    }
  }
  ${GUARDIAN_PROPS}
`;

export const GET_GUARDIAN_TYPES = gql`
  query GET_GUARDIAN_TYPES {
    GetGuardianTypes {
      message
      docs {
        id
        name
      }
    }
  }
`;

// Mutation Section
export const NEW_GUARDIAN = gql`
  mutation NEW_GUARDIAN($model: GuardianInput!, $student: ID!) {
    NewGuardian(model: $model, student: $student) {
      message
      doc {
        ...GUARDIAN_PROPS
      }
    }
  }
  ${GUARDIAN_PROPS}
`;

export const NEW_GUARDIAN_TYPE = gql`
  mutation NEW_GUARDIAN_TYPE($name: String!) {
    NewGuardianType(name: $name) {
      message
      doc {
        id
        name
      }
    }
  }
`;

export const REMOVE_GUARDIAN_TYPE = gql`
  mutation REMOVE_GUARDIAN_TYPE($id: ID!) {
    RemoveGuardianType(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_GUARDIAN_TYPE = gql`
  mutation UPDATE_GUARDIAN_TYPE($id: ID, $name: String) {
    UpdateGuardianType(id: $id, name: $name) {
      message
      doc {
        id
        name
        created_at
      }
    }
  }
`;
