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

export const GET_ACTIVE_TERM = gql`
  query GET_ACTIVE_TERM {
    GetActiveTerm {
      message
      doc {
        id
        startDate
        term {
          id
          name
        }
      }
    }
  }
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

export const REMOVE_TERM = gql`
  mutation REMOVE_TERM($id: ID!) {
    RemoveTerm(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_TERM = gql`
  mutation UPDATE_TERM($id: ID!, $name: String!) {
    UpdateTerm(id: $id, name: $name) {
      message
      doc {
        ...TERM_PROPS
      }
    }
  }
  ${TERM_PROPS}
`;

export const NEW_ACTIVE_TERM = gql`
  mutation NEW_ACTIVE_TERM($model: ActiveTermInput!) {
    NewActiveTerm(model: $model) {
      message
      doc {
        id
        term {
          id
          name
        }
      }
    }
  }
`;
