import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
    edit: false,
};

/**
 * Function creating a Redux slice named "user" to manage user data and edit mode
 *
 * @param {Object} initialState - Initial state object for the slice
 * @param {Object} reducers - Object containing reducer functions for state updates
 *
 * @returns {Object} slice - Object containing reducer, actions, and potentially selectors
 */

/**
 * Reducer function that updates the "user" state with logged-in user information
 *
 * @param {Object} state - Current state of the "user" slice
 * @param {Object} action - Dispatched action object containing the payload (user data)
 *
 * @returns {void} - Does not return a value, directly modifies the state
 */
/**
 * Updates localStorage to persist logged-in user information
 *
 * @param {string} value - The user data to store in localStorage (stringified)
 */
/**
 * Reducer function that resets the "user" state to indicate logged-out state
 *
 * @param {Object} state - Current state of the "user" slice
 *
 * @returns {void} - Does not return a value, directly modifies the state
 */
/**
 * Reducer function that updates the "edit" state flag to indicate user profile edit mode
 *
 * @param {Object} state - Current state of the "user" slice
 * @param {Object} action - Dispatched action object containing the payload (edit mode flag)
 *
 * @returns {void} - Does not return a value, directly modifies the state
 */
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout(state) {
            state.user = null;
            localStorage?.removeItem("user");
        },
        updateProfile(state, action) {
            state.edit = action.payload;
        },
    },
});
export default userSlice.reducer;

/**
 * Function that dispatches the "login" action to update the "user" state and localStorage with user data
 *
 * @param {Object} user - User data object containing information for the logged-in user
 *
 * @returns {function} - Function to dispatch the action with the provided user data (does not return a value)
 */
export function UserLogin(user) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.login(user));
    };
}
/**
 * Function that dispatches the "logout" action to reset the "user" state and remove user data from localStorage
 *
 * @returns {function} - Function to dispatch the action to log out the user (does not return a value)
 */
export function Logout() {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.logout());
    };
}
/**
 * Function that dispatches the "updateProfile" action to update the "edit" state flag indicating user profile edit mode
 *
 * @param {boolean} val - Flag indicating user profile edit mode (true for editing)
 *
 * @returns {function} - Function to dispatch the action with the edit mode flag (does not return a value)
 */
export function UpdateProfile(val) {
    return (dispatch, getState) => {
        dispatch(userSlice.actions.updateProfile(val));
    };
}