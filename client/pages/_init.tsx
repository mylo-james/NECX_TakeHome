import { useEffect, useContext } from "react";
import { AppContext } from "../context";
import { getSessionAPI } from "../api";
import "@fortawesome/fontawesome-free/css/all.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Init = () => {
  const { setAppState } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      const { user, tasks, message } = await getSessionAPI();
      toast.info(message);
      tasks.reverse();
      setAppState((appState) => ({ ...appState, user, tasks, loading: false }));
    })();
  }, []);

  return null;
};

export default Init;
