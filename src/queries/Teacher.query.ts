import gql from "graphql-tag";

export const TEACHER_PROPS = gql`
  fragment TEACHER_PROPS on Teacher {
    id
    first_name
    last_name
    middle_name
    email
    phone
    gender
    address
    doj
    dob
    image
    template
    created_at
    assigned_classes {
      id
      name
    }
    assigned_subject {
      id
      title
      code
      created_at
    }
  }
`;

// Query section
export const TEACHER_LIST = gql`
  query TEACHER_LIST($page: Int, $limit: Int) {
    GetTeachers(page: $page, limit: $limit) {
      docs {
        ...TEACHER_PROPS
      }
      totalDocs
      totalPages
      page
      limit
      nextPage
      prevPage
    }
  }
  ${TEACHER_PROPS}
`;

// Mutation Section
export const NEW_TEACHER = gql`
  mutation NEW_TEACHER($model: TeacherInput!) {
    NewTeacher(model: $model) {
      message
      doc {
        ...TEACHER_PROPS
      }
    }
  }
  ${TEACHER_PROPS}
`;

export const REMOVE_TEACHER = gql`
  mutation REMOVE_TEACHER($id: ID!) {
    RemoveTeacher(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_TEACHER = gql`
  mutation UPDATE_TEACHER($id: ID!, $model: TeacherUpdateInput!) {
    UpdateTeacher(id: $id, model: $model) {
      message
      doc {
        ...TEACHER_PROPS
      }
    }
  }
  ${TEACHER_PROPS}
`;
