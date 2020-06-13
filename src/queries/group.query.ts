import gql from "graphql-tag";

const GROUP_PROPS = gql`
    fragment GroupProps on NavigationGroup {
        id
        name
        created_at
        desc
    }
`;

// Query Section
export const GET_NAVIGATION_GROUPS = gql`
    query GET_NAVIGATION_GROUPS {
        GetNavigationGroups {
            docs {
                ...GroupProps
            }
        }
    }
    ${GROUP_PROPS}
`;

export const NEW_GROUP = gql`
    mutation NewNavigationGroup($name: String!, $desc: String!, $icon: String) {
        NewNavigationGroup(name: $name, desc: $desc, icon: $icon) {
            message
        }
    }
`;
