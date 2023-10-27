import axios from "axios";
import { Row, Col, Card, Avatar, Button, Divider } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const { Meta } = Card;

const defaultImage = "/images/no_image.jpg";

/**
 * PostsPage is a component for displaying a list of posts.
 *
 * @component
 * @param {string} title - The title to be displayed at the top of the page.
 * @param {array} allPosts - An array of all posts to be displayed.
 * @param {function} setAllPosts - A function to set the list of all posts.
 * @param {number} postCount - The total count of posts.
 * @param {string} loadMorePostsURL - The URL for loading more posts.
 * @returns {JSX.Element} JSX element representing the posts page.
 */
export default function PostsPage({
  title,
  allPosts,
  setAllPosts,
  postCount,
  loadMorePostsURL,
}) {
  // state
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page === 1) return;
    loadMorePosts();
  }, [page]);

  const loadMorePosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${loadMorePostsURL}/${page}`);
      setAllPosts([...allPosts, ...data]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load more posts");
    }
  };

  const fontSize = title.toLowerCase() === "posts" ? 50 : 30;
  return (
    <>
      <Row>
        <Col span={24} style={{ textAlign: "center" }}>
          <Divider
            style={{
              borderTopWidth: 30,
              borderTopColor: "grey",
              borderColor: "grey",
            }}
          >
            <h1
              style={{
                marginLeft: 50,
                marginTop: 20,
                marginRight: 50,
                marginBottom: 20,
                fontSize: `${fontSize}px`,
              }}
            >
              {title}
            </h1>
          </Divider>
        </Col>
      </Row>
      <Row>
        {allPosts?.map((post) => (
          <Col xs={24} xl={8} key={post.title}>
            <Link href={`/post/${post.slug}`}>
              <Card
                key={post.title}
                hoverable
                style={{ textAlign: "center" }}
                cover={
                  <Avatar
                    shape="square"
                    style={{ height: "200px", objectFit: "cover" }}
                    src={post.featuredImage?.url || defaultImage}
                    alt={post.title}
                  />
                }
              >
                <Meta title={post.title} />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: "center", padding: 20 }}>
          {allPosts?.length < postCount && (
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Load More Posts
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}
