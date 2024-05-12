import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";


/**
 * Function that combines multiple reducers into a single root reducer
 *
 * @param {Object} reducers - An object containing individual slice reducers
 *   * key: The name of the state property managed by the reducer
 *   * value: The reducer function for that state property
 *
 * @throws {Error} - Can throw an error if any of the provided reducers are not functions
 *
 * @returns {function} rootReducer - The combined root reducer function
 */
const rootReducer = combineReducers({
    user: userSlice,
    theme: themeSlice,
    posts: postSlice,
});

export { rootReducer };