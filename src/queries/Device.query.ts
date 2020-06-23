import gql from "graphql-tag";

export const DEVICE_PROPS = gql`
  fragment DEVICE_PROPS on Device {
    id
    name
    mac
    created_at
    state_histories {
      date
      state
    }
    assigned_class {
      id
      name
      level {
        id
        name
      }
    }
  }
`;

// Query Section
export const GET_ASSIGNED_DEVICES = gql`
  query GET_ASSIGNED_DEVICES {
    GetAssignedDevices {
      message
      docs {
        ...DEVICE_PROPS
      }
    }
  }
  ${DEVICE_PROPS}
`;

export const GET_UNASSIGNED_DEVICES = gql`
  query GET_UNASSIGNED_DEVICES {
    GetUnassignedDevices {
      message
      docs {
        ...DEVICE_PROPS
      }
    }
  }
  ${DEVICE_PROPS}
`;

// Mutation
export const ASSIGN_DEVICE = gql`
  mutation ASSIGN_DEVICE($id: ID, $_class: ID!) {
    AssignToClass(id: $id, _class: $_class) {
      message
      doc {
        ...DEVICE_PROPS
      }
    }
  }
  ${DEVICE_PROPS}
`;

export const UNASSIGN_DEVICE = gql`
  mutation UNASSIGN_DEVICE($id: ID) {
    UnAssignDevice(id: $id) {
      message
      doc {
        ...DEVICE_PROPS
      }
    }
  }
  ${DEVICE_PROPS}
`;
