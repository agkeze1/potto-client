import gql from "graphql-tag";

const ACTIVE_TERM = gql`
  query ACTIVE_TERM {
    GetActiveTerm {
      message
      doc {
        term {
          id
          name
        }
      }
    }
  }
`;
const TOTAL_SCHOOL = gql`
  query TOTAL_SCHOOL {
    TotalSchools
  }
`;
const TOTAL_STUDENTS = gql`
  query TOTAL_STUDENTS {
    TotalStudents
  }
`;
const TOTAL_TEACHERS = gql`
  query TOTAL_TEACHERS {
    TotalTeachers
  }
`;
const TOTAL_USERS = gql`
  query TOTAL_USERS {
    TotalUsers
  }
`;
const TOTAL_SUBJECTS = gql`
  query TOTAL_SUBJECTS {
    TotalSubjects
  }
`;
const TOTAL_PERIODS = gql`
  query TOTAL_PERIODS {
    TotalPeriod
  }
`;
const TOTAL_DEVICES = gql`
  query TOTAL_DEVICES {
    TotalDevices
  }
`;
const TOTAL_ASSIGNED_DEVICES = gql`
  query TOTAL_ASSIGNED_DEVICES {
    TotalAssignedDevices
  }
`;
const TOTAL_UNASSIGNED_DEVICES = gql`
  query TOTAL_UNASSIGNED_DEVICES {
    TotalUnassignedDevices
  }
`;
const GRADUATED_STUDENTS = gql`
  query GRADUATED_STUDENTS {
    GraduatedStudentCount
  }
`;

// Upcoming Birthdays

const STU_BIRTHDAY = gql`
  query STU_BIRTHDAY {
    UpcomingStudentsBirthday {
      day
      month
      student {
        full_name
      }
    }
  }
`;
const TCHR_BIRTHDAY = gql`
  query TCHR_BIRTHDAY {
    UpcomingTeachersBirthday {
      day
      month
      teacher {
        name
      }
    }
  }
`;

// Ratios

const STU_CLASS_RATIO = gql`
  query STU_CLASS_RATIO {
    GetStudentClassRatio {
      class_name
      total
    }
  }
`;
const STU_LEVEL_RATIO = gql`
  query STU_LEVEL_RATIO {
    GetStudentLevelRatio {
      level_name
      total
    }
  }
`;
const STU_GENDER_RATIO = gql`
  query STU_GENDER_RATIO {
    CountStudentByGender {
      gender
      total
    }
  }
`;
const STU_STATE_RATIO = gql`
  query STU_STATE_RATIO {
    GetStudentStateRatio {
      state
      total
    }
  }
`;
const TCHR_GENDER_RATIO = gql`
  query TCHR_GENDER_RATIO {
    GetTeacherGenderRatio {
      gender
      total
    }
  }
`;
const USER_GENDER_RATIO = gql`
  query USER_GENDER_RATIO {
    GetUsersGenderRatio {
      gender
      total
    }
  }
`;

// Attendances

const WEEKLY_ROLLCAL_SUMMARY = gql`
  query WEEKLY_ROLLCAL_SUMMARY {
    GetWeeklyRollCallAttendanceRatio {
      date
      present
      absent
      exempted
      manual
      total
    }
  }
`;

export const DASHBOARD = {
  ACTIVE_TERM,
  TOTAL_SCHOOL,
  TOTAL_STUDENTS,
  TOTAL_TEACHERS,
  TOTAL_USERS,
  TOTAL_SUBJECTS,
  TOTAL_PERIODS,
  TOTAL_DEVICES,
  TOTAL_ASSIGNED_DEVICES,
  TOTAL_UNASSIGNED_DEVICES,
  GRADUATED_STUDENTS,
  STU_BIRTHDAY,
  TCHR_BIRTHDAY,
  STU_CLASS_RATIO,
  STU_LEVEL_RATIO,
  STU_GENDER_RATIO,
  STU_STATE_RATIO,
  TCHR_GENDER_RATIO,
  USER_GENDER_RATIO,
  WEEKLY_ROLLCAL_SUMMARY,
};
