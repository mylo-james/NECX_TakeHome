import type { AppProps } from "next/app";
import Context from "../context";
import Init from "./_init";
import Nav from "../components/nav";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Context>
        <Init />
        <Nav />
        <Component {...pageProps} />
      </Context>
    </>
  );
}
