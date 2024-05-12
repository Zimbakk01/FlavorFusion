import axios from "axios";
import { SetPosts } from "../redux/postSlice";
const API_URL="http://localhost:3000";


export const API = axios.create({
    baseURL:API_URL,
    responseType:"json",
});
/**
 * Function to make an API request using the provided configuration
 *
 * @param {string} url - The URL endpoint to make the request to
 * @param {string} token (optional) - An authorization token for authenticated requests
 * @param {Object} data (optional) - Data to send in the request body (for POST, PUT, etc.)
 * @param {string} method (optional) - HTTP method for the request (defaults to GET)
 *
 * @throws {Error} - Can throw an error if the API request fails
 *
 * @returns {Promise<any>} - Promise resolving to the API response data or an error object
 */
export const apiRequest = async({url,token,data,method}) => {
    try{
        const result = await API(url, {
            method : method || "GET",
            data : data,
            headers : {
                "content-type" : "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
        return result?.data;
    }catch(error){
        const err=error.response?.data;
        console.log(err);
        return{status : err.success,message : err.message};
    }
}

/**
 * Function to upload a file to Cloudinary
 *
 * @param {File} uploadFile - The file object to upload
 *
 * @throws {Error} - Can throw an error if the upload fails
 *
 * @returns {Promise<string>} - Promise resolving to the uploaded file's secure URL
 */
export const handleFileUpload = async (uploadFile) =>{
    const formData=new FormData();
    formData.append("file",uploadFile);
    formData.append("upload_preset", "socialmedia");
    try{
        const response= await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.
            REACT_APP_CLOUDINARY_ID}/image/upload/`,
            formData
        );
        return response.data.secure_url;
    }catch(error){
        console.log(error);
    }
};

/**
 * Function to fetch posts data from the API
 *
 * @param {string} token (optional) - Authorization token if user is authenticated
 * @param {function} dispatch - Redux dispatch function to update application state
 * @param {string} uri (optional) - The endpoint URL to fetch posts from (defaults to "/posts")
 * @param {Object} data (optional) - Additional data to send with the request
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<void>} - Does not return a value, dispatches actions to update state
 */
export const fetchPosts =async (token,dispatch,uri,data) =>{
    try{
        const res = await apiRequest({
            url : uri || "/posts",
            token : token,
            method : "POST",
            data : data || {},
        });
        dispatch(SetPosts(res?.data));
        return;
    }catch(error){
        console.log(error);
    }
};

/**
 * Function to like a post
 *
 * @param {string} uri - The endpoint URL of the post to like
 * @param {string} token - Authorization token for the authenticated user
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<any>} - Promise resolving to the API response data
 */
export const likePost =async (uri,token) =>{
    try{
        const res = await apiRequest({
            url : uri,
            token : token,
            method : "POST",
        });
        
        return res;
    }catch(error){
        console.log(error);
    }
};

/**
 * Function to delete a post
 *
 * @param {number} id - The ID of the post to delete
 * @param {string} token - Authorization token for the authenticated user
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<void>} - Does not return a value
 */
export const deletePost =async (id,token) =>{
    try{
        const res = await apiRequest({
            url : "/posts/" + id,
            token : token,
            method : "DELETE",
        });
        
        return;
    }catch(error){
        console.log(error);
    }
};

/**
 * Function to get user information (own or another user's profile)
 *
 * @param {string} token - Authorization token for the authenticated user
 * @param {number} id (optional) - ID of the user to get information for (defaults to logged-in user)
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<Object>} - Promise resolving to the user information object or handles authentication failure
 */
export const getUserInfo =async (token,id) =>{
    try{
        const uri = id===undefined?"/users/get-user":"/users/get-user/" +id;
        const res = await apiRequest({
            url : uri,
            token : token,
            method : "POST",
        });
         if(res?.message ==="Authentication failed"){
            localStorage.removeItem("user");
            window.alert("User session expired, Login again,");
            window.location.replace("login");
         }
        return res?.user;
    }catch(error){
        console.log(error);
    }
};

/**
 * Function to send a friend request to another user
 *
 * @param {string} token - Authorization token for the authenticated user
 * @param {number} id - ID of the user to send the friend request to
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<void>} - Does not return a value, but resolves on successful request
 */
export const sendFriendRequest =async (token,id) =>{
    try{
        
        const res = await apiRequest({
            url : "/users/friend-request",
            token : token,
            method : "POST",
            data : {requestTo : id},
        });
         
        return;
    }catch(error){
        console.log(error);
    }
};


/**
 * Function to view another user's profile
 *
 * @param {string} token - Authorization token for the authenticated user
 * @param {number} id - ID of the user whose profile you want to view
 *
 * @throws {Error} - Can throw an error if the request fails
 *
 * @returns {Promise<void>} - Does not return a value, but resolves on successful request to view profile
 */
export const viewUserProfile =async (token,id) =>{
    try{
        
        const res = await apiRequest({
            url : "/users/profile-view",
            token : token,
            method : "POST",
            data : {id},
        });
         
        return;
    }catch(error){
        console.log(error);
    }
};