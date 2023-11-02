import { createContext, useState } from "react";
import { appStateType } from "../types";
export const AppContext = createContext(null);
export const SearchContext = createContext(null);

function Context({ children }) {
  const [appState, setAppState] = useState<appStateType>({
    user: null,
    tasks: [],
    follows: null,
    loading: true,
  });
  const [searchState, setSearchState] = useState({
    user: null,
    tasks: [],
  });

  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <SearchContext.Provider value={{ searchState, setSearchState }}>
        {children}
      </SearchContext.Provider>
    </AppContext.Provider>
  );
}
export default Context;
