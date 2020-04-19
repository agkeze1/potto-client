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
      first_name
      middle_name
      last_name
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

// Mutation Section
export const NEW_CLASS = gql`
  mutation NEW_CLASS($name: String!, $level: ID!) {
    NewClass(name: $name, level: $level) {
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
