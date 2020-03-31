import { Level } from "./Level.model";

export interface Subject {
  id: string;
  title: string;
  code: string;
  //   school: string;
  levels: Array<Level>;
}
