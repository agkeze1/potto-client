import gql from "graphql-tag";

export const PLAN_PROPS = gql`
    fragment PLAN_PROPS on Plan {
        id
        name
        desc
        useSchoolAttendance
        useSubjectAttendance
        useRollCall
        created_at
    }
`;

export const NEW_PLAN = gql`
    mutation NewPlan($model: PlanInput!) {
        NewPlan(model: $model) {
            message
            doc {
                ...PLAN_PROPS
            }
        }
    }
    ${PLAN_PROPS}
`;

export const GET_PLANS = gql`
    query GetPlans {
        GetPlans {
            docs {
                ...PLAN_PROPS
            }
        }
    }
    ${PLAN_PROPS}
`;

export const UPDATE_PLAN = gql`
    mutation UpdatePlan($id: ID!, $model: PlanInput!) {
        UpdatePlan(id: $id, update: $model) {
            message
            doc {
                ...PLAN_PROPS
            }
        }
    }
    ${PLAN_PROPS}
`;

export const REMOVE_PLAN = gql`
    mutation RemovePlan($id: ID!) {
        RemovePlan(id: $id) {
            message
        }
    }
`;
