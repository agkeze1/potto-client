import gql from "graphql-tag";

const NAVIGATION_PROPS = gql`
    fragment NavigationProps on Navigation {
        id
        name
        created_at
        group {
            id
            name
        }
        icon
        desc
        role {
            id
            name
        }
    }
`;

// Query Section
export const GET_NAVIGATION_LIST = gql`
    query GET_NAVIGATION_LIST($page: Int, $limit: Int) {
        GetNavigationList(page: $page, limit: $limit) {
            docs {
                ...NavigationProps
            }
            page
            limit
            totalPages
            totalDocs
            prevPage
            nextPage
        }
        GetRoles {
            docs {
                id
                name
            }
        }
        GetNavigationGroups {
            docs {
                id
                name
            }
        }
    }
    ${NAVIGATION_PROPS}
`;

export const REMOVE_NAVIGATION = gql`
    mutation RemoveNavigation($id: ID!) {
        RemoveNavigation(id: $id) {
            message
            doc {
                id
            }
        }
    }
`;

export const CREATE_NAVIGATION = gql`
    mutation NewNavigation($model: NavigationInput!) {
        NewNavigation(model: $model) {
            message
        }
    }
`;
