import { useState, useRef, useEffect, useContext } from "react";
import { createTaskAPI } from "../../api";
import { AppContext } from "../../context";
import Button from "../common/Button";
import TextButton from "../common/TextButton";
import classNames from "classnames";
import Modal from "../common/Modal/Modal";
import { toast } from "react-toastify";

interface TaskModalProps {
  onClose: () => void;
}

export default function TaskModal({ onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const {
    appState: { user },
    setAppState,
  } = useContext(AppContext);
  const modalRef = useRef(null);
  const submitButtonRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      toast.error("Please enter a title");
      return;
    }
    const { message, task } = await createTaskAPI({ title, user });
    toast.success(message);
    setTitle("");
    setAppState((prevState: any) => ({
      ...prevState,
      tasks: [task, ...prevState.tasks],
    }));
    onClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <div className="task-modal">
      <Modal onClose={onClose} focusableRefs={[inputRef, submitButtonRef]}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Task Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleTitleChange}
            ref={inputRef}
          />
          <Button ref={submitButtonRef} type="submit">
            Add Task
          </Button>
        </form>
      </Modal>
    </div>
  );
}
