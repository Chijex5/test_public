// localStorageUtils.js
export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
};

export const setUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};
