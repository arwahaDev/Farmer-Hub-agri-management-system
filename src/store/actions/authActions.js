export const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
export const LOGOUT = "auth/LOGOUT";

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});

export const loginUser = (email, password) => (dispatch) => {
  if (!email?.trim() || !password) {
    return {
      success: false,
      message: "Email and password are required.",
    };
  }

  // Frontend-only example: this does not verify credentials.
  const user = { email: email.trim() };

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("authUser", JSON.stringify(user));

  dispatch(loginSuccess(user));

  return { success: true };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("authUser");

  dispatch(logout());
};