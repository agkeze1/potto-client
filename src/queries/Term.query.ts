import gql from "graphql-tag";

export const TERM_PROPS = gql`
  fragment TERM_PROPS on Term {
    id
    name
    created_at
  }
`;

// Query Section
export const TERM_LIST = gql`
  query TERM_LIST {
    GetTerms {
      message
      docs {
        ...TERM_PROPS
      }
    }
  }
  ${TERM_PROPS}
`;

// Mutation Section
export const NEW_TERM = gql`
  mutation NEW_TERM($name: String!) {
    NewTerm(name: $name) {
      message
      doc {
        ...TERM_PROPS
      }
    }
  }
  ${TERM_PROPS}
`;
