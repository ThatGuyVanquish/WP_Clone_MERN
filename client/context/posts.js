import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Link from "next/link";
import LinkToProfile from "../components/user/ProfileLink";

// Create a context for managing posts data.
const PostsContext = createContext();

/**
 * Provider component for managing posts data.
 * @param {object} children - The child components to be wrapped by the provider.
 * @component
 */
export function PostsProvider({ children }) {
  // State for managing posts data, post count, and latest posts.
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [latestPosts, setLatestPosts] = useState([]);

  // Router hook for routing in the application.
  const router = useRouter();

  // Function to fetch the post count.
  const fetchPostCount = async (userID = 0) => {
    try {
      const url = userID ? `/post-count/${userID}` : "/post-count";
      const { data } = await axios.get(url);
      setPostCount(data);
    } catch (err) {}
  };

  // Function to fetch posts by page.
  const fetchPostsByPage = async (
    morePostsURL,
    page,
    setLoading,
    setCounter,
    admin = false
  ) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${morePostsURL}/${page}?admin=${admin}`
      );
      if (page === 1) {
        setPosts(data);
        setCounter(data.length);
      } else {
        setCounter(posts.length + data.length);
        setPosts([...posts, ...data]);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  // Function to fetch a specific post.
  const fetchPost = async ({
    setContent,
    setTitle,
    media,
    setMedia,
    setPostCategories,
    setPostID,
    setLoading,
  }) => {
    try {
      const { data } = await axios.get(`/post/${router.query.slug}`);
      if (data) {
        setPostID(data._id);
        setTitle(data.title);
        setContent(data.content);
        setPostCategories(data.categories.map((category) => category.name));
        setMedia({ ...media, selected: data.featuredImage });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      toast.error(`Failed to fetch post: ${err.message}`);
    }
  };

  // Function to send a request to create a new post.
  const sendPostCreationRequest = async (
    media,
    setMedia,
    setLoading,
    title,
    content,
    categories,
    route
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/create-post`, {
        title,
        content,
        categories,
        featuredImage: media?.selected?._id,
      });
      if (data?.error) {
        setLoading(false);
        toast.error(data?.error);
      } else {
        setLoading(false);
        toast.success(`Successfully published ${title}`);
        localStorage.removeItem("content");
        localStorage.removeItem("title");
        setMedia({ ...media, selected: null });
        router.push(`/${route}/posts`);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Failed to create post: " + err);
    }
  };

  // Function to send a request to update an existing post.
  const sendPostUpdateRequest = async (
    postID,
    title,
    content,
    postCategories,
    media,
    setMedia,
    setLoading,
    route
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/post/${postID}`, {
        title,
        content,
        categories: postCategories,
        featuredImage: media?.selected?._id,
      });
      setLoading(false);
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setLoading(false);
        toast.success(`Successfully updated ${title}`);
        setMedia({ ...media, selected: null });
        router.push(`/${route}/posts`);
      }
    } catch (err) {
      setLoading(false);
      toast.error(`Failed to edit post: ${err.message}`);
    }
  };

  // Function to send a request to delete a post.
  const sendPostDeletionRequest = async (post) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmation) return;
    try {
      const { data } = await axios.delete(`/post/${post._id}`);
      if (data.ok) {
        toast.success(`${post.title} deleted successfully`);
        const newPosts = posts.filter(
          (currentPost) => currentPost._id != post._id
        );
        setPosts(newPosts);
        setPostCount(postCount - 1);
      } else {
        toast.error(`Failed to delete ${post.title} because of ${data.err}`);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const generatePostDescription = (post, comments) => {
    return (
      <pre>
        {dayjs(post.createdAt).format("MMMM DD, YYYY hh:mm A")} /{" "}
        {comments.length} Comments /{post?.categories.length > 0 ? " in " : ""}
        {post.categories.map((category, index) => (
          <span key={category._id}>
            <Link
              style={{ color: "inherit" }}
              href={`/category/${category.slug}`}
            >
              {category.name}
            </Link>
            {index < post.categories.length - 1 ? ", " : ""}
          </span>
        ))}{" "}
        {post?.categories.length > 0 && "/ "}
        By{" "}
        {post?.author ? <LinkToProfile user={post.author} /> : "DELETED USER"}
      </pre>
    );
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        postCount,
        setPostCount,
        latestPosts,
        setLatestPosts,
        fetchPostCount,
        fetchPostsByPage,
        fetchPost,
        sendPostCreationRequest,
        sendPostUpdateRequest,
        sendPostDeletionRequest,
        generatePostDescription,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

/**
 * Custom hook to easily access posts data and related functions.
 * @returns {object} - An object containing posts data and functions for managing posts.
 */
export function usePosts() {
  return useContext(PostsContext);
}

/**
 * Custom hook to fetch the latest posts.
 * @returns {object} - An object containing the latest posts.
 */
export function useLatestPosts() {
  const { latestPosts, setLatestPosts } = usePosts();

  /**
   * useEffect hook to fetch the latest posts when the component mounts.
   * @function
   */
  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await axios.get("/posts/1");
        setLatestPosts(data);
      } catch (err) {}
    };

    getPosts();
  }, []);

  return { latestPosts, setLatestPosts };
}
