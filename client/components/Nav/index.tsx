import { useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../../context";
import { contextType } from "../../types";
import AuthForm from "../authForm";
import { getSessionAPI, signOutAPI } from "../../api";

const Nav = () => {
  const {
    appState: { user },
    setAppState,
  } = useContext(AppContext);
  const { push } = useRouter();

  const loadUser = useCallback(() => {
    (async () => {
      const { user, tasks } = await getSessionAPI();
      setAppState((appState) => ({ ...appState, user, tasks }));
    })();
  }, []);

  useEffect(loadUser, []);

  const [register, setRegister] = useState(true);
  const handleSignOut = async () => {
    await signOutAPI();
    setAppState({ user: null, tasks: [], follows: [] });
    push("/");
  };

  return (
    <nav>
      <a href="/">Todo</a>
      {user ? (
        <>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <AuthForm register={register} setRegister={setRegister} />
      )}
    </nav>
  );
};

export default Nav;
