import { useContext } from "react";
import { AppContext } from "../../context";
import { contextType } from "../../types";

const Nav = () => {
  const {
    appState: { user, follows, tasks },
  } = useContext<contextType>(AppContext);
  return (
    <nav>
      <a href="/">Todo</a>
      {user ? (
        <>
          <button>Sign out</button>
        </>
      ) : (
        <>
          <button>Sign In</button>
          <button>Register</button>
        </>
      )}
    </nav>
  );
};

export default Nav;
