import type { AppProps } from "next/app";
import AppContext from "../context";
import { useCallback, useEffect } from "react";
import { getUsers } from "../api";

export default function MyApp({ Component, pageProps }: AppProps) {
  const loadUser = useCallback(() => {
    (async () => {
      const users = await getUsers(sessionStorage.getItem("sessionId"));
    })();
  }, []);

  useEffect(loadUser, []);

  return (
    <>
      <AppContext>
        <Component {...pageProps} />
      </AppContext>
    </>
  );
}
