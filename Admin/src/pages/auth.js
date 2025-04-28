

export const login = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {

  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

