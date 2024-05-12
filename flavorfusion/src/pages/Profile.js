import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
    FriendsCard,
    Loading,
    PostCard,
    ProfileCard,
    TopBar,
} from "../components";
import { deletePost, fetchPosts, getUserInfo, likePost } from "../utils";

/**
 * Profile Component:
 * Renders the profile page for a user.
 * Fetches user information and posts from the backend API.
 * Handles post deletion and post like functionality.
 */
const Profile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { posts } = useSelector((state) => state.posts);
    const [userInfo, setUserInfo] = useState(user);
    const [loading, setLoading] = useState(false);
    const uri="/posts/get-user-post/"+id;
    /**
     * getUser Function:
     * Fetches user information from the backend API based on user ID.
     * Sets the user info state with the fetched data.
     *
     * @returns {void}
     */
    const getUser= async () =>{
            const res=await getUserInfo(user?.token,id);
            setUserInfo(res);
        };

    /**
     * getPosts Function:
     * Fetches posts from the backend API based on user ID.
     * Sets the posts state with the fetched data.
     *
     * @returns {void}
     */
    const getPosts= async () =>{
            await fetchPosts(user.token,dispatch,uri);
            setLoading(false);
        };
    /**
     * handleDelete Function:
     * Handles post deletion by sending a request to the backend API.
     * Updates the posts state after successful deletion.
     *
     * @param {string} id - The ID of the post to be deleted.
     * @returns {void}
     */
    const handleDelete = async(id) => {
        await deletePost(id,user.token);
        await getPosts();
    };
    /**
     * handleLikePost Function:
     * Handles post liking by sending a request to the backend API.
     * Updates the posts state after successful liking.
     *
     * @param {string} uri - The URI for the API request.
     * @returns {void}
     */
    const handleLikePost = async(uri) => {
        await likePost(uri, user?.token); 
        await getPosts();
    };

        useEffect(() =>{
            setLoading(true);
            getUser();
            getPosts();
        },[id]);
    return (
        <>
            <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
                <TopBar />
                <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
                    {/* LEFT */}
                    <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
                        <ProfileCard user={userInfo} />

                        <div className='block lg:hidden'>
                            <FriendsCard friends={userInfo?.friends} />
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className=' flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto'>
                        {loading ? (
                            <Loading />
                        ) : posts?.length > 0 ? (
                            posts?.map((post) => (
                                <PostCard
                                    post={post}
                                    key={post?._id}
                                    user={user}
                                    deletePost={handleDelete}
                                    likePost={handleLikePost}
                                />
                            ))
                        ) : (
                            <div className='flex w-full h-full items-center justify-center'>
                                <p className='text-lg text-ascent-2'>No Post Available</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
                        <FriendsCard friends={userInfo?.friends} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;