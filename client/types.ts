export interface userType {}

export interface taskType {}

export interface appStateType {
  user: userType | null;
  tasks: taskType[] | null;
  follows: userType[] | null;
}

export interface contextType {
  appState: appStateType;
  setAppState: Function;
}
