import { atom } from "recoil";
import { EmployeeData } from "@/src/type";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface inputDataTypes {
  currentDate: string;
  employees: EmployeeData[];
  dayOffNum: string;
  dayOffMax: string;
}

export const inputDataAtom = atom<inputDataTypes>({
  key: "inputData",
  default: {
    currentDate: "",
    employees: [],
    dayOffNum: "",
    dayOffMax: "",
  },
  effects_UNSTABLE: [persistAtom],
});
