import gql from "graphql-tag";

export const PERIOD_PROPS = gql`
  fragment PERIOD_PROPS on Period {
    id
    from
    to
    break
    taken
    from_date
    to_date
  }
`;

// Query Section
export const GET_PERIODS = gql`
  query GET_PERIODS {
    GetSchoolPeriodList {
      message
      docs {
        id
        from
        to
        break
        from_date
        to_date
      }
    }
  }
`;

export const GET_DAY_PERIODS = gql`
  query GET_DAY_PERIODS($_class: ID!, $day: String!) {
    GetPeriodList(_class: $_class, day: $day) {
      message
      docs {
        ...PERIOD_PROPS
      }
    }
  }
  ${PERIOD_PROPS}
`;

// Mutation Secton
export const NEW_PERIOD = gql`
  mutation NEW_PERIOD($model: PeriodInput!) {
    NewPeriod(model: $model) {
      message
    }
  }
`;

export const REMOVE_PERIOD = gql`
  mutation REMOVE_PERIOD($id: ID!) {
    RemovePeriod(id: $id) {
      message
      doc {
        id
      }
    }
  }
`;

export const UPDATE_PERIOD = gql`
  mutation UPDATE_PERIOD($id: ID!, $model: PeriodInput!) {
    UpdatePeriod(id: $id, model: $model) {
      message
    }
  }
`;
