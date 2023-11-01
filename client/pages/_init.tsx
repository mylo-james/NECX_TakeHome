import { useEffect, useContext } from "react";
import { AppContext } from "../context";
import { getSessionAPI } from "../api";

const Init = () => {
  const { setAppState } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const { user, tasks } = await getSessionAPI();
      tasks.reverse();
      setAppState((appState) => ({ ...appState, user, tasks, loading: false }));
    })();
  }, []);

  return null;
};

export default Init;
