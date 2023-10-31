import { createContext, useState } from "react";
import { appStateType } from "../types";
export const AppContext = createContext(null);

function Context({ children }) {
  const [appState, setAppState] = useState<appStateType>({
    user: null,
    tasks: null,
    follows: null,
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
}
export default Context;
