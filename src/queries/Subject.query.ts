import gql from "graphql-tag";

export const SUB_FRAGMENT = gql`
  fragment SUB_FRAGMENT on Subject {
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
        ...SUB_FRAGMENT
      }
    }
  }
  ${SUB_FRAGMENT}
`;

// Mutation Section
export const NEW_SUBJECT = gql`
  mutation NEW_SUBJECT($model: SubjectInput!) {
    NewSubject(model: $model) {
      message
      doc {
        ...SUB_FRAGMENT
      }
    }
  }
  ${SUB_FRAGMENT}
`;
