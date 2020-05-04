import gql from "graphql-tag";

export const SUB_PROPS = gql`
  fragment SUB_PROPS on Subject {
    id
    title
    code
    created_at
    levels {
      name
    }
  }
`;

// Query Section
export const GET_SUBJECTS = gql`
  query GET_SUBJECTS($school: ID!) {
    GetSubjects(school: $school) {
      message
      docs {
        ...SUB_PROPS
      }
    }
  }
  ${SUB_PROPS}
`;

export const GET_SUB_BY_LEVEL = gql`
  query GET_SUB_BY_LEVEL($level: ID!) {
    GetSubjectsForRegistration(level: $level) {
      message
      docs {
        ...SUB_PROPS
      }
    }
  }
  ${SUB_PROPS}
`;

// Mutation Section
export const NEW_SUBJECT = gql`
  mutation NEW_SUBJECT($model: SubjectInput!) {
    NewSubject(model: $model) {
      message
      doc {
        ...SUB_PROPS
      }
    }
  }
  ${SUB_PROPS}
`;

export const REMOVE_SUBJECT = gql`
  mutation REMOVE_SUBJECT($id: ID!) {
    RemoveSubject(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_SUBJECT = gql`
  mutation UPDATE_SUBJECT($id: ID!, $title: String!, $code: String!) {
    UpdateSubject(id: $id, title: $title, code: $code) {
      message
      doc {
        ...SUB_PROPS
      }
    }
  }
  ${SUB_PROPS}
`;
