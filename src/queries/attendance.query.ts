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
        active_class {
          id
          name
          level {
            id
            name
          }
        }
        form_teacher {
          id
          name
          image
        }
        attendances {
          id
          present
          manual
          student {
            id
            full_name
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
