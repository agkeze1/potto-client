import gql from "graphql-tag";

export const TEACHER_PROPS = gql`
    fragment TEACHER_PROPS on Teacher {
        id
        first_name
        last_name
        middle_name
        name
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

export const GET_ALL_TEACHER = gql`
    query GET_ALL_TEACHER {
        GetAllTeachers {
            docs {
                ...TEACHER_PROPS
            }
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

export const GET_ALL_TEACHERS_SHORT = gql`
    query GET_ALL_TEACHERS_SHORT {
        GetAllTeachers {
            docs {
                id
                name
                email
                image
                first_name
                phone
                gender
            }
        }
    }
`;
export const GET_TEACHER_ATTENDANCE = gql`
    query GetTeacherAttendances($teacher: ID!, $from: String!, $to: String!) {
        GetTeacherSubjectAttendance(teacher: $teacher, start: $from, end: $to) {
            docs {
                id
                timetable {
                    id
                    period {
                        from
                        to
                        from_time
                        to_time
                        total
                    }
                    subject {
                        id
                        title
                    }
                    assigned_class {
                        id
                        name
                    }
                }
                date
            }
            total
        }
    }
`;

export const GET_TEACHER_TIMETABLE = gql`
    query GetTeacherTimetables($id: ID!) {
        GetTeacherTimetables(teacher: $id) {
            docs {
                total
            }
        }
    }
`;

export const TEACHER_LOGIN = gql`
    mutation TEACHER_LOGIN($email: String!, $password: String!) {
        TeacherLogin(email: $email, password: $password) {
            token
            message
            doc {
                ...TEACHER_PROPS
            }
        }
    }
    ${TEACHER_PROPS}
`;

export const UPDATE_PASSWORD_TEACHER = gql`
    mutation UpdateTeacherPassword($old: String!, $_new: String!) {
        UpdateTeacherPassword(oldPassword: $old, newPassword: $_new) {
            message
            token
        }
    }
`;
export const PASSWORD_RESET = gql`
    query TeacherPasswordReset($no: String!) {
        PasswordReset(no: $no)
    }
`;

export const CHANGE_TEACHER_PASSWORD = gql`
    mutation ChangeTeacherPassword($email: String!, $newPassword: String!) {
        ChangeTeacherPassword(email: $email, newPassword: $newPassword) {
            token
            message
            doc {
                ...TEACHER_PROPS
            }
        }
    }
    ${TEACHER_PROPS}
`;
