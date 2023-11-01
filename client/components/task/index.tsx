import { useState, useContext, useRef, useEffect } from "react";
import { Task } from "../../types";
import { AppContext } from "../../context";
import { editTaskAPI, deleteTaskAPI } from "../../api";

interface TaskProps {
  task: Task;
}

const Task: React.FC<TaskProps> = ({ task: taskProp }) => {
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
      const newTasks = appState.tasks.filter(
        (appTask: Task) => appTask._id !== task._id
      );
      setAppState((appState) => ({ ...appState, tasks: newTasks }));
    }
  };

  const handleCheck = async () => {
    await submitEdit({ ...task, completed: !task.completed });
  };

  const submitEdit = async (task) => {
    if (!task.title) handleDelete();
    const res = await editTaskAPI(task);
    if (res.task) {
      setTask(res.task);
    }
    setIsEditing(false);
  };

  if (!task) return;

  return (
    <div>
      <input type="checkbox" checked={task.completed} onChange={handleCheck} />
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
      <button onClick={handleEditClick}>✏️</button>

      <button onClick={handleDelete}>🗑️</button>  
    </div>
  );
};

export default Task;
