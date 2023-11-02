import { useEffect, useContext, useState } from "react";
import TaskList from "../../components/taskList";
import { AppContext } from "../../context";
import { useRouter } from "next/router";
import Button from "../../components/common/Button";
import classNames from "classnames";
import { getUserByEmailAPI } from "../../api";

function UserPage() {
  const { loading, user: currentUser } = useContext(AppContext).appState;
  const [{ email, tasks }, setUser] = useState({
    email: null,
    tasks: [],
  });
  const {
    push,
    query: { email: queryEmail },
  } = useRouter();

  useEffect(() => {
    (async () => {
      if (loading) return;

      if (!currentUser?._id) {
        push("/");
      }

      const { user } = await getUserByEmailAPI(queryEmail as string);
      setUser(user);
      if (queryEmail === currentUser?.email) {
        push("/tasks");
      }
    })();
  }, [loading, currentUser, queryEmail]);

  return (
    <div className={classNames("tasks-page", "user-page")}>
      <h1>Tasks</h1>
      <p>{email}</p>
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} />
      ) : (
        <p>No tasks yet. Add some!</p>
      )}
    </div>
  );
}

export default UserPage;
