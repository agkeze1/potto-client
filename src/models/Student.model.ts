import { Subject } from "./Subject.model";
import { Guardian } from "./Guardian.model";

export interface Student {
  id: string;
  first_name: string;
  middle_name: string;
  surname: string;
  reg_no: string;
  dob: string;
  //   admissionDate:string;
  gender: string;
  passport: string;
  current_class: string;
  state: string;
  lga: string;
  address: string;
  selected_subjects: Array<Subject>;
  graduated: boolean;
  guardians: Array<Guardian>;
}
