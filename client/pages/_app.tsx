import type { AppProps } from "next/app";
import Context from "../context";
import Init from "./_init";
import "../sass/main.scss";
import { ToastContainer } from "react-toastify";
import SearchBar from "../components/searchBar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Context>
        <ToastContainer
          position="bottom-left"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          theme="light"
          limit={2}
        />
        <Init />
        <SearchBar />
        <Component {...pageProps} />
      </Context>
    </>
  );
}
