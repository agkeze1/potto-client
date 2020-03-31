import gql from "graphql-tag";

export const SCHOOL_PROPS = gql`
  fragment SCHOOL_PROPS on School {
    id
    name
    alias
    logo
    contact_address
    contact_email
    contact_phone
    address
    created_at
  }
`;

// Query Section
export const HAS_SCHOOL = gql`
  query HAS_SCHOOL {
    HasSchool
  }
`;

// Get list of schools
export const GET_SCHOOL_LIST = gql`
  query GET_SCHOOL_LIST($page: Int, $limit: Int) {
    GetSchools(page: $page, limit: $limit) {
      docs {
        ...SCHOOL_PROPS
      }
      totalDocs
      totalPages
      page
      limit
      nextPage
      prevPage
    }
  }
  ${SCHOOL_PROPS}
`;

// Mutation Section
export const NEW_SCHOOL = gql`
  mutation NEW_SCHOOL($model: SchoolInput!) {
    NewSchool(model: $model) {
      message
      doc {
        ...SCHOOL_PROPS
      }
    }
  }
  ${SCHOOL_PROPS}
`;
