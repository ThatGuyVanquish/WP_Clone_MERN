import Head from "next/head";
import { useState, useEffect } from "react";
import PostsPage from "../../components/posts/PostPageComponent";
import SidebarComponent from "../../components/posts/PostSidebarComponent";
import { Row, Col, Card } from "antd";
import { useCategories } from "../../context/categories";

export async function getServerSideProps({ params }) {
  const { slug } = params;
  return {
    props: {
      slug: slug,
    },
  };
}

/**
 * React component for displaying a list of posts in a specific category.
 * @returns {JSX.Element} The rendered component.
 */
export default function Posts({ slug }) {
  // context
  const {
    fetchPostCountInCategory,
    fetchCategoryName,
    fetchFirstPostsInCategory,
  } = useCategories();
  // state
  const [allPosts, setAllPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  // hooks
  /**
   * Effect hook to fetch category information and posts when the category slug changes.
   */
  useEffect(() => {
    fetchCategoryName(slug, setCategoryName);
    fetchFirstPostsInCategory(slug, setAllPosts);
    fetchPostCountInCategory(slug, setPostCount);
  }, [slug]);

  return (
    <>
      <Head>
        <title>Blog posts in {slug} category</title>
        <meta description={slug} />
      </Head>
      <div display="flex">
        <Row>
          <Col xs={24} xl={16}>
            <Card key="Posts">
              <PostsPage
                title={`Posts in the category: ${categoryName}`}
                allPosts={allPosts}
                setAllPosts={setAllPosts}
                postCount={postCount}
                loadMorePostsURL={`/category/${slug}`}
              />
            </Card>
          </Col>
          <Col xs={22} xl={6} offset={1}>
            <SidebarComponent />
          </Col>
        </Row>
      </div>
    </>
  );
}
