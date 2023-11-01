const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL!;
import { User, Task } from "./types";

interface getAuthResponse {
  message: string;
  user: User | null;
  tasks: Task[] | [];
}

export const getSessionAPI = async (): Promise<getAuthResponse> => {
  try {
    const res = await fetch(`${backendUrl}/auth/check-session`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 200) {
      const { message, user, tasks } = await res.json();
      console.log(message);
      return { user, tasks, message };
    } else {
      const { message } = await res.json();
      console.error(message);
      return { user: null, tasks: [], message };
    }
  } catch (e) {
    console.error(e);
    return { user: null, tasks: [], message: e.message };
  }
};

export const loginAPI = async (
  email: string,
  password: string
): Promise<getAuthResponse> => {
  try {
    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 200) {
      const { message, user, tasks } = await res.json();
      return { message, user, tasks };
    } else {
      const { message } = await res.json();
      return { message, user: null, tasks: [] };
    }
  } catch (e) {
    console.error(e);
    return { message: e.message, user: null, tasks: [] };
  }
};

export const registerAPI = async (
  email: string,
  password: string
): Promise<getAuthResponse> => {
  try {
    const res = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (res.status === 201) {
      const { message, user, tasks } = await res.json();
      console.log(message);
      return { user, tasks, message };
    } else {
      const { message } = await res.json();
      console.error(message);
      return { user: null, tasks: [], message };
    }
  } catch (e) {
    console.error(e);
    return { user: null, tasks: [], message: e.message };
  }
};

export const signOutAPI = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${backendUrl}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 200) {
      const { message } = await res.json();
      console.log(message);
      return true;
    } else {
      const { message } = await res.json();
      console.error(message);
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

interface getTaskResponse {
  message: string;
  task: Task | null;
}

export const createTaskAPI = async (
  task: Partial<Task>
): Promise<getTaskResponse> => {
  try {
    const res = await fetch(`${backendUrl}/tasks/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (res.status === 200) {
      const { message, task } = await res.json();
      console.log(message);
      return { task, message };
    } else {
      const { message } = await res.json();
      console.error(message);
      return { task: null, message };
    }
  } catch (e) {
    console.error(e);
    return { task: null, message: e.message };
  }
};

export const editTaskAPI = async (task: Task): Promise<getTaskResponse> => {
  try {
    const res = await fetch(`${backendUrl}/tasks/${task._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (res.status === 200) {
      const { message, task } = await res.json();
      console.log(message);
      return { task, message };
    } else {
      const { message } = await res.json();
      console.error(message);
      return { task: null, message };
    }
  } catch (e) {
    console.error(e);
    return { task: null, message: e.message };
  }
};

export const deleteTaskAPI = async (
  taskId: string
): Promise<getTaskResponse> => {
  try {
    const res = await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 200) {
      const { message, task } = await res.json();
      console.log(message);
      return { task, message };
    } else {
      const { message } = await res.json();
      console.error(message);
      return { task: null, message };
    }
  } catch (e) {
    console.error(e);
    return { task: null, message: e.message };
  }
};
