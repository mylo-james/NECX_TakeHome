import Nav from "../components/Nav";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppContext } from "../context";

export default function Home() {
  const { user } = useContext(AppContext).appState;
  const { push } = useRouter();

  return (
    <>
      <Link href="/tasks">See my tasks</Link>
    </>
  );
}
