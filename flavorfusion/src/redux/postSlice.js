import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: {},
};
/**
 * Function creating a Redux slice named "post" to manage post data
 *
 * @param {Object} initialState - Initial state object for the slice
 * @param {Object} reducers - Object containing reducer functions for state updates
 *
 * @returns {Object} slice - Object containing reducer, actions, and potentially selectors
 */

/**
 * Reducer function that updates the "posts" state property with fetched posts data
 *
 * @param {Object} state - Current state of the "post" slice
 * @param {Object} action - Dispatched action object containing the payload (fetched posts)
 *
 * @returns {void} - Does not return a value, directly modifies the state
 */
const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        getPosts(state, action) {
            state.posts = action.payload;
        },
    },
});

export default postSlice.reducer;
/**
 * Function that dispatches the "getPosts" action to update the "posts" state with retrieved posts
 *
 * @param {Object} post - Data containing the retrieved posts
 *
 * @returns {function} - Function to dispatch the action with the provided posts (does not return a value)
 */
export function SetPosts(post) {
    return (dispatch, getState) => {
        dispatch(postSlice.actions.getPosts(post));
    };
}