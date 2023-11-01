import { useEffect, useContext, useState } from "react";
import TaskList from "../../components/taskList";
import TaskModal from "../../components/taskModal";
import { AppContext } from "../../context";
import { useRouter } from "next/router";

function TasksPage() {
  const { user, tasks, loading } = useContext(AppContext).appState;
  const [showModal, setShowModal] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user?._id) {
      push("/");
    }
  }, [user]);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Task</button>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
      {tasks.length > 0 ? <TaskList /> : <p>No tasks yet. Add some!</p>}
    </>
  );
}

export default TasksPage;
