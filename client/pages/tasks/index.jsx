import { useEffect, useContext, useState } from "react";
import TaskList from "../../components/taskList";
import TaskModal from "../../components/taskModal";
import { AppContext } from "../../context";
import { useRouter } from "next/router";
import Button from "../../components/common/Button";
import classNames from "classnames";
import { signOutAPI } from "../../api";

function TasksPage() {
  const {
    appState: { user, tasks, loading },
    setAppState,
  } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const { push } = useRouter();

  const handleSignOut = async () => {
    await signOutAPI();
    setAppState({ user: null, tasks: [], follows: [] });
    push("/");
  };

  useEffect(() => {
    if (loading) return;
    if (!user?._id) {
      push("/");
    }
  }, [user]);

  return (
    <div className={classNames("tasks-page")}>
      {user && (
        <Button className="sign-out-button" onClick={handleSignOut}>
          Sign out
        </Button>
      )}
      <Button className="add-task-button" onClick={() => setShowModal(true)}>
        Add Task
      </Button>
      <h1>My Tasks</h1>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} self />
      ) : (
        <p>No tasks yet. Add some!</p>
      )}
    </div>
  );
}

export default TasksPage;
