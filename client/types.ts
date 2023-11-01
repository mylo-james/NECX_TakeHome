import { WithId, Document, ObjectId } from "mongodb";
export interface User extends WithId<Document> {
  email: string;
  pwHash: string;
}

export interface Task extends WithId<Document> {
  title: string;
  description: string;
  completed: boolean;
  userId: ObjectId;
}

export interface appStateType {
  user: User | null;
  tasks: Task[] | null;
  follows: User[] | null;
  loading: boolean;
}

export interface contextType {
  appState: appStateType;
  setAppState: Function;
}

export interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthFormProps {
  register: boolean;
  setRegister: (register: boolean) => void;
}

export interface IValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IProps {
  values: IValues;
  register: boolean;
  setRequirements: (reqs: string[]) => void;
  focusField: (errors: Partial<FormValues>) => void;
}
