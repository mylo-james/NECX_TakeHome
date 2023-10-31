import { useContext } from "react";
import type { AppProps } from "next/app";
import Context, { AppContext } from "../context";
import { useCallback, useEffect } from "react";
import { getSessionAPI } from "../api";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Context>
        <Component {...pageProps} />
      </Context>
    </>
  );
}
