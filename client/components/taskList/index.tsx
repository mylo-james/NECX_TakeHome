import Task from "../task";
import classNames from "classnames";

interface TaskListProps {
  tasks: Task[];
  self?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, self = false }) => {
  return (
    <div className={"task-list"}>
      {tasks.map((task) => (
        <Task key={task._id.toString()} self={self} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
