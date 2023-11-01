import { useContext } from "react";
import Task from "../task";
import { AppContext } from "../../context";
import { useRouter } from "next/router";

interface TaskListProps {
  tasks: Task[];
}


const TaskList: React.FC<TaskListProps> = () => {
  const { user, tasks } = useContext(AppContext).appState;
  const { push } = useRouter();
  return (
    <div>
      {tasks.map((task) => (
        <Task key={task._id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
