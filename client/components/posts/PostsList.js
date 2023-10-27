import { Row, Col, List } from "antd";
import { useEffect } from "react";
import slugify from "slugify";
import { usePosts } from "../../context/posts";
import Link from "next/link";
import { useAuth } from "../../context/auth";
import LinkToProfile from "../user/ProfileLink";

/**
 * Component for displaying a list of posts, with options for editing and deleting.
 * @component
 * @param {number} page - The page number to fetch posts.
 * @param {string} keyword - A keyword to filter and search for specific posts.
 * @param {Function} setLoading - A function to set the loading state.
 * @param {Function} setCounter - A function to set the counter.
 * @param {Function} setAmountOfDisplayedItems - A function to set the number of displayed items.
 * @param {string} postLoadURL - The URL to fetch posts from.
 */
export default function PostsList({
  page,
  keyword,
  setLoading,
  setCounter,
  setAmountOfDisplayedItems,
  postLoadURL,
  canEdit,
}) {
  // context
  const { posts, fetchPostsByPage, sendPostDeletionRequest } = usePosts();
  const [auth] = useAuth();
  // hooks

  // useEffect hook to fetch posts when needed
  useEffect(() => {
    if (page > 1) {
      fetchPostsByPage(postLoadURL, page, setLoading, setCounter, true);
    }
  }, [page]);

  useEffect(() => {
    if (auth?.token && page === 1) {
      fetchPostsByPage(postLoadURL, page, setLoading, setCounter, true);
    }
  }, [auth]);

  // useEffect hook to calculate the number of posts according to given keyword
  useEffect(() => {
    if (!keyword) setAmountOfDisplayedItems(posts.length);
    else setAmountOfDisplayedItems(getPostsByKeyword(keyword).length);
  }, [posts, keyword]);

  /**
   * Filter and retrieve posts that match a given keyword.
   * @param {string} keyword - The keyword to search for in post titles.
   * @returns {array} - An array of posts matching the keyword.
   */
  const getPostsByKeyword = (keyword) =>
    posts.filter((post) => post.title.toLowerCase().includes(keyword));
  return (
    <Row>
      <Col span={24}>
        <List
          itemLayout="horizontal"
          dataSource={getPostsByKeyword(keyword)}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <Link href={`/post/${slugify(item.title)}`}>view</Link>,
              ].concat(
                canEdit
                  ? [
                      <Link href={`/admin/posts/${slugify(item.title)}`}>
                        edit
                      </Link>,
                      <a onClick={() => sendPostDeletionRequest(item)}>
                        delete
                      </a>,
                    ]
                  : []
              )}
            >
              <List.Item.Meta
                title={item.title}
                description={<LinkToProfile user={item.author} />}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
