import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: JSON.parse(window?.localStorage.getItem("theme")) ?? "dark",
};


/**
 * Function creating a Redux slice named "theme" to manage the application's theme
 *
 * @param {Object} initialState - Initial state object for the slice
 * @param {Object} reducers - Object containing reducer functions for state updates
 *
 * @returns {Object} slice - Object containing reducer, actions, and potentially selectors
 */

/**
 * Reducer function that updates the "theme" state property with a new theme value
 *
 * @param {Object} state - Current state of the "theme" slice
 * @param {Object} action - Dispatched action object containing the payload (new theme value)
 *
 * @returns {void} - Does not return a value, directly modifies the state
 */
/**
 * Updates localStorage to persist the new theme setting
 *
 * @param {string} value - The new theme value to store in localStorage
 */
const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action) {
            state.theme = action.payload;
            localStorage.setItem("theme", JSON.stringify(action.payload));
        },
    },
});

export default themeSlice.reducer;
/**
 * Function that dispatches the "setTheme" action to update the "theme" state and localStorage
 *
 * @param {string} value - The new theme value to set ("light" or "dark")
 *
 * @returns {function} - Function to dispatch the action with the provided theme value (does not return a value)
 */
export function SetTheme(value) {
    return (dispatch) => {
        dispatch(themeSlice.actions.setTheme(value));
    };
}