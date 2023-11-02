import AuthForm from "../components/authForm";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context";
import Link from "next/link";
import Button from "../components/common/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import splash from "../public/splash.jpeg";
import Modal from "../components/common/Modal/Modal";

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
    <div className="splash-page">
      <div className="image-container">
        <Image
          className="splash-image"
          alt="two people at a desk one is not very productive, the other is very productive thanks to their todo app"
          src={splash}
        />
      </div>
      <div className="splash-text">
        <h1>Welcome to Mylo's take home interview for NEC-X!</h1>
        <p>
          This is a simple todo app that allows you to create, edit, and delete
          tasks, as well as view what your friends are working on.
        </p>{" "}
        {user ? (
          <Link href="/tasks">See my tasks</Link>
        ) : (
          <Button onClick={() => setShowModal(true)}>Let's get started!</Button>
        )}
      </div>

      {showModal && (
        <AuthForm
          register={register}
          setRegister={setRegister}
          onClose={onClose}
        />
      )}
    </div>
  );
}
