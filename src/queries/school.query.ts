import gql from "graphql-tag";

export const SCHOOL_PROPS = gql`
  fragment SCHOOL_PROPS on School {
    id
    name
    alias
    logo
    contactAddress
    contactEmail
    address
  }
`;

// Query Section
export const HAS_SCHOOL = gql`
  query HAS_SCHOOL {
    HasSchool
  }
`;

// Mutation Section
export const NEW_SCHOOL = gql`
  mutation NEW_SCHOOL($school: SchoolInput!) {
    NewSchool(schoolInput: $school) {
      message
      doc {
        ...SCHOOL_PROPS
      }
    }
  }
  ${SCHOOL_PROPS}
`;
