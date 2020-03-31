import gql from "graphql-tag";

export const STU_PROPS = gql`
  fragment STU_PROPS on Student {
    id
    first_name
    middle_name
    surname
    reg_no
    gender
    address
    dob
    passport
    created_at
    graduated
    state
    lga
    selected_subjects {
      title
      code
    }
    current_class {
      name
      level {
        name
      }
    }
    guardians {
      title
      full_name
      address
      image
      type {
        id
        name
      }
    }
  }
`;
export const STU_MIN_PROPS = gql`
  fragment STU_MIN_PROPS on Student {
    id
    first_name
    middle_name
    surname
    reg_no
    gender
    passport
    current_class {
      name
      level {
        name
      }
    }
  }
`;

// Query Section
export const GET_STUDENT = gql`
  query GET_STUDENT($id: ID!) {
    GetStudent(id: $id) {
      message
      doc {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

export const GET_STUDENT_BY_REG_NO = gql`
  query GET_STUDENT_BY_REG_NO($id: String!) {
    GetStudentByRegNo(id: $id) {
      message
      doc {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

export const GET_STUDENTS_BY_LEVEL = gql`
  query GET_STUDENTS_BY_LEVEL($level: ID!, $page: Int, $limit: Int) {
    GetStudentsOfSameLevel(level: $level, page: $page, limit: $limit) {
      message
      docs {
        ...STU_PROPS
      }
      totalDocs
      totalPages
      page
      limit
      nextPage
      prevPage
    }
  }
  ${STU_PROPS}
`;

export const GET_STUDENTS_BY_CLASS = gql`
  query GET_STUDENTS_BY_CLASS($classId: ID!) {
    GetStudentOfSameClass(classId: $classId) {
      message
      docs {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

// Mutation Section
export const NEW_STUDENT = gql`
  mutation NEW_STUDENT($model: StudentInput!) {
    NewStudent(model: $model) {
      message
      doc {
        ...STU_MIN_PROPS
      }
    }
  }
  ${STU_MIN_PROPS}
`;
