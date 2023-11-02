import { useState, useContext, useRef, useEffect } from "react";
import { Task } from "../../types";
import { AppContext } from "../../context";
import { editTaskAPI, deleteTaskAPI } from "../../api";
import Button from "../common/Button";
import { toast } from "react-toastify";

interface TaskProps {
  task: Task;
  self?: boolean;
}

const Task: React.FC<TaskProps> = ({ task: taskProp, self }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(taskProp);
  const inputRef = useRef<HTMLInputElement>(null);
  const { appState, setAppState } = useContext(AppContext);

  const handleEditClick = () => {
    if (isEditing) {
      submitEdit({ ...task, title: inputRef.current?.value });
    }
    inputRef.current?.focus();
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    const res = await deleteTaskAPI(task._id.toString());
    if (res.message === "Task deleted") {
      toast.success("Task deleted");
      const newTasks = appState.tasks.filter(
        (appTask: Task) => appTask._id !== task._id
      );
      setAppState((appState) => ({ ...appState, tasks: newTasks }));
    }
  };

  const handleCheck = async () => {
    await submitEdit({ ...task, completed: !task.completed }, true);
  };

  const submitEdit = async (task, isCheck = false) => {
    if (!task.title) handleDelete();
    const res = await editTaskAPI(task);
    if (res.task) {
      if (!isCheck) toast.success(res.message);
      setTask(res.task);
    }
    setIsEditing(false);
  };

  if (!task) return;

  return (
    <div className="task">
      <input
        type="checkbox"
        disabled={!self}
        checked={task.completed}
        onChange={handleCheck}
      />
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditClick();
          }}
        >
          <input ref={inputRef} type="text" defaultValue={task.title} />
        </form>
      ) : (
        <span>{task.title}</span>
      )}

      {self && (
        <div className="button-container">
          <Button onClick={handleEditClick}>
            <i className="fa-solid fa-pen-to-square" />
          </Button>

          <Button onClick={handleDelete}>
            <i className="fa-solid fa-trash" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Task;
