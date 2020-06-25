import gql from "graphql-tag";

export const ROLL_CALL = gql`
  query ROLL_CALL($_class: ID!, $start: String!, $end: String!) {
    GetClassRollCallAttendances(_class: $_class, start: $start, end: $end) {
      message
      docs {
        total
        date
        device {
          id
          name
        }
        attendances {
          id
          present
          manual
          student {
            id
            full_name
            gender
            passport
          }
        }
        stats {
          present
          absent
          exempted
          manual
        }
      }
    }
  }
`;

export const TIMETABLE_ATTENDANCE = gql`
  query TIMETABLE_ATTENDANCE($timetable: ID!) {
    GetAttendanceByTimetable(timetable: $timetable) {
      message
      docs {
        id
        date
        device {
          id
          name
        }
        stats {
          present
          absent
          exempted
          manual
        }
        students {
          student {
            id
            full_name
            passport
            gender
            reg_no
          }
          present
          exempted
          manual
        }
      }
    }
  }
`;

export const STU_ROLL_CALL_ATT = gql`
  query STU_ROLL_CALL_ATT($student: ID!) {
    GetStudentRollCallAttendances(student: $student) {
      message
      docs {
        total
      }
    }
  }
`;

export const STU_SUB_ATT = gql`
  query STU_SUB_ATT($student: ID!) {
    GetSubjectAttendanceByStudent(student: $student) {
      message
      docs {
        total
        timetable {
          id
          period {
            from
            to
          }
          day
          teacher {
            id
            name
          }
          subject {
            id
            title
            code
          }
        }
        device {
          id
          name
        }
        attendances {
          id
          date
          present
          exempted
          manual
        }
      }
    }
  }
`;
