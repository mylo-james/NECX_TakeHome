import AuthForm from "../components/authForm";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import Link from "next/link";
import Button from "../components/common/Button";
import { useRouter } from "next/router";

export default function Home() {
  const [register, setRegister] = useState(false);
  const { user, loading } = useContext(AppContext).appState;
  const [showModal, setShowModal] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      push("/tasks");
    }
  }, [loading]);

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {user ? (
        <Link href="/tasks">See my tasks</Link>
      ) : (
        <Button onClick={() => setShowModal(true)}>Get started</Button>
      )}
      {showModal && (
        <AuthForm
          register={register}
          setRegister={setRegister}
          onClose={onClose}
        />
      )}
    </>
  );
}
