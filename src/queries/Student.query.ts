import gql from "graphql-tag";

export const STU_PROPS = gql`
  fragment STU_PROPS on Student {
    id
    first_name
    middle_name
    surname
    full_name
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
      id
      name
      level {
        id
        name
      }
    }
    guardians {
      id
      title
      name
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
    full_name
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
export const GUARDIAN_PROPS = gql`
  fragment GUARDIAN_PROPS on Guardian {
    id
    title
    name
    full_name
    type {
      id
      name
    }
    address
    state
    lga
    hometown
    phone
    email
    gender
    image
    created_at
    student {
      ...STU_PROPS
    }
  }
  ${STU_PROPS}
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

export const SEARCH_STUDENTS = gql`
  query SEARCH_STUDENTS(
    $regNo: String
    $level: ID
    $_class: ID
    $page: Int
    $limit: Int
  ) {
    SearchStudents(
      regNo: $regNo
      level: $level
      _class: $_class
      page: $page
      limit: $limit
    ) {
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

export const GET_GUARDIAN = gql`
  query GET_GUARDIAN($id: ID!) {
    GetGuardian(id: $id) {
      message
      doc {
        ...GUARDIAN_PROPS
      }
    }
  }
  ${GUARDIAN_PROPS}
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

export const REMOVE_STUDENT = gql`
  mutation REMOVE_STUDENT($id: ID!) {
    RemoveStudent(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UPDATE_STUDENT($id: ID!, $model: StudentUpdateInput!) {
    UpdateStudent(id: $id, model: $model) {
      message
      doc {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

export const ADD_GUARDIAN = gql`
  mutation ADD_GUARDIAN($id: ID!, $guardianId: ID!) {
    AddStudentGuardian(id: $id, guardianId: $guardianId) {
      message
      doc {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

export const GET_STUDENT_OFF = gql`
  query GEtStudentsForGraduation($level: ID!) {
    GetStudentsForGraduation(level: $level) {
      docs {
        id
        full_name
        passport
        surname
        current_class {
          id
          name
        }
        reg_no
        gender
      }
    }
  }
`;

export const GRADUATE_STUDENTS = gql`
  mutation GraduateStudent($users: [ID!]!) {
    GraduateStudents(users: $users) {
      message
    }
  }
`;

export const FIND_STUDENTS = gql`
  query FindStudents($search: String!) {
    StudentSearch(keyword: $search) {
      docs {
        ...STU_PROPS
      }
    }
  }
  ${STU_PROPS}
`;

export const GET_STUDENT_REG = gql`
  query GetStudentByRegNo($reg: String!) {
    GetStudentByRegNo(id: $reg) {
      doc {
        id
        first_name
        middle_name
        surname
        full_name
        reg_no
        gender
        dob
        passport
        current_class {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_GUARDIAN = gql`
  mutation UPDATE_GUARDIAN($id: ID, $model: GuardianUpdateInput!) {
    UpdateGuardian(id: $id, model: $model) {
      message
      doc {
        ...GUARDIAN_PROPS
      }
    }
  }
  ${GUARDIAN_PROPS}
`;
