export interface userType {}

export interface taskType {
  title: string;
  description: string;
  completed: boolean;
  userId: string;
}

export interface appStateType {
  user: userType | null;
  tasks: taskType[] | null;
  follows: userType[] | null;
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
  submitting: boolean;
  register: boolean;
  setRequirements: (reqs: string[]) => void;
  setSubmitting: (submitting: boolean) => void;
  focusField: (errors: Partial<FormValues>) => void;
}
