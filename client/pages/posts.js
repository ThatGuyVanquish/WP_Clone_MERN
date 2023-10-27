import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import PostsPage from "../components/posts/PostPageComponent";

/**
 * Function that retrieves the post data from the server on the server side.
 * @param {object} params - The parameters including the post slug.
 * @returns {object} The posts data.
 */
export async function getServerSideProps({ params }) {
  const { data } = await axios.get(`${process.env.API}/posts/1`);
  return { props: { posts: data } };
}

/**
 * React component for rendering the list of recent blog posts.
 * @param {object} posts - The initial set of blog posts.
 * @returns {JSX.Element} The rendered component.
 */
export default function Posts({ posts }) {
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    getPostCount();
  }, []);

  /**
   * Fetches the total count of blog posts.
   */
  const getPostCount = async () => {
    try {
      const { data } = await axios.get(`/post-count`);
      setPostCount(data);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <>
      <Head>
        <title>Recent blog posts</title>
        <meta description="ALL BLOG POSTS ON THE CMS" />
      </Head>
      <PostsPage
        title={"Posts"}
        allPosts={allPosts}
        setAllPosts={setAllPosts}
        postCount={postCount}
        loadMorePostsURL={"/posts"}
      />
    </>
  );
}
