const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface getUsersResponse {}

export const getUsers = async (sessionId) => {
  try {
    const res = await fetch(`${backendUrl}/users`);
    if (res.status === 200) {
      const users = await res.json();
      return users;
    }
    return null;
  } catch (e) {
    console.error(e);
  }
};
