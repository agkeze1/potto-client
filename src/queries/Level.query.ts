import gql from "graphql-tag";

export const LEVEL_PROPS = gql`
  fragment LEVEL_PROPS on Level {
    id
    name
    created_at
  }
`;

// Query Section
export const GET_LEVELS = gql`
  query GET_LEVELS($school: ID!) {
    GetLevels(school: $school) {
      message
      docs {
        ...LEVEL_PROPS
      }
    }
  }
  ${LEVEL_PROPS}
`;

// Mutation Section
export const NEW_LEVEL = gql`
  mutation NEW_LEVEL($name: String!, $school: ID!) {
    NewLevel(name: $name, school: $school) {
      message
      doc {
        ...LEVEL_PROPS
      }
    }
  }
  ${LEVEL_PROPS}
`;
