import gql from "graphql-tag";

export const TIMETABLE_PROPS = gql`
  fragment TIMETABLE_PROPS on Timetable {
    id
    day
    period {
      from
      to
      total
    }
    created_at
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
`;

export const CLASS_TT_PROPS = gql`
  fragment CLASS_TT_PROPS on ClassTimetableList {
    day
    total
    timetable_list {
      id
      period {
        from
        to
        total
      }
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
  }
`;

// Query Section
export const GET_CLASS_TIMETABLE = gql`
  query GET_CLASS_TIMETABLE($_class: ID!) {
    GetClassTimetable(_class: $_class) {
      message
      docs {
        ...CLASS_TT_PROPS
      }
    }
  }
  ${CLASS_TT_PROPS}
`;

export const GET_TIMETABLE_OF_CLASS = gql`
  query GET_TIMETABLE_OF_CLASS($_class: ID!) {
    GetTimetableForClass(_class: $_class) {
      message
      docs {
        ...TIMETABLE_PROPS
      }
    }
  }
  ${TIMETABLE_PROPS}
`;

// Mutation Section
export const NEW_TIMETABLE = gql`
  mutation NEW_TIMETABLE($model: TimetableInput!) {
    NewTimetable(model: $model) {
      status
      message
    }
  }
`;
export const REMOVE_TIMETABLE = gql`
  mutation REMOVE_TIMETABLE($id: ID!) {
    RemoveTimetable(id: $id) {
      status
      message
    }
  }
`;
