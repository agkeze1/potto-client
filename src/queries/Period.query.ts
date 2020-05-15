import gql from "graphql-tag";

export const PERIOD_PROPS = gql`
  fragment PERIOD_PROPS on Period {
    id
    from
    to
    break
    taken
  }
`;

// Query Section
export const GET_PERIODS = gql`
  query GET_PERIODS {
    GetSchoolPeriodList {
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
      doc {
        ...PERIOD_PROPS
      }
    }
  }
  ${PERIOD_PROPS}
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
      doc {
        ...PERIOD_PROPS
      }
    }
  }
  ${PERIOD_PROPS}
`;
