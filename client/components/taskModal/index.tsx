import { useState, useRef, useEffect, useContext } from "react";
import { createTaskAPI } from "../../api";
import { AppContext } from "../../context";

interface TaskModalProps {
  onClose: () => void;
}

export default function TaskModal({ onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const {
    appState: { user },
    setAppState,
  } = useContext(AppContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(onClose);

  useEffect(() => {
    const modal = modalRef.current;
    const closeButton = closeButtonRef.current;
    const cancelButton = cancelButtonRef.current;
    const input = inputRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "Tab") {
        if (document.activeElement === closeButton) {
          event.preventDefault();
          input.focus();
        } else if (document.activeElement === cancelButton) {
          event.preventDefault();
          closeButton.focus();
        } else {
          event.preventDefault();
          cancelButton.focus();
        }
      }
    };

    modal?.addEventListener("keydown", handleKeyDown);

    return () => {
      modal?.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { message, task } = await createTaskAPI({ title, user });
    console.log(message);
    setTitle("");
    setAppState((prevState) => ({
      ...prevState,
      tasks: [task, ...prevState.tasks],
    }));
    onClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="modal" ref={modalRef} onKeyDown={handleKeyDown}>
      <div className="modal-content">
        <button className="close" onClick={onClose} ref={closeButtonRef}>
          &times;
        </button>
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
          <button type="submit">Add Task</button>
          <button type="button" onClick={onClose} ref={cancelButtonRef}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
