const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL!;
import { userType, taskType } from "./types";

interface getAuthResponse {
  message: string;
  user: userType | null;
  tasks: taskType[] | [];
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
