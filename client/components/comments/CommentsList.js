import { Row, Col, List } from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import slugify from "slugify";
import { useAuth } from "../../context/auth";
import { useWindowWidth } from "@react-hook/window-size";
import EditCommentModal from "./EditCommentModal";
import {
  fetchCommentsByPage,
  sendCommentDeletionRequest,
  generateCommentDescription,
} from "../../functions/comments";

/**
 * CommentsList component for rendering a list of comments.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {number} props.page - The current page number.
 * @param {string} props.keyword - The keyword for filtering comments.
 * @param {Function} props.setLoading - A function to update the loading state.
 * @param {Function} props.setCounter - A function to update the counter state.
 * @param {Function} props.setAmountOfDisplayedItems - A function to update the displayed items count.
 * @param {string} props.commentsURL - The URL for fetching comments.
 *
 * @returns {JSX.Element} The rendered CommentsList component.
 */
export default function CommentsList({
  page,
  keyword,
  setLoading,
  setCounter,
  setAmountOfDisplayedItems,
  commentsURL,
  canEdit,
}) {
  // state
  // All of the comments currently held by the list, received incrementally with paging.
  const [comments, setComments] = useState([]);
  const [editingModalSize, setEditingModalSize] = useState(720);
  const [editingModalVisibility, setEditingModalVisibility] = useState(false);
  /**
   * Object state for the comment currently being edited.
   * @param {object} item - The comment object itself.
   * @param {string} content - The comment's content.
   *  */
  const [currentlyEditing, setCurrentlyEditing] = useState({
    item: null,
    content: "",
  });
  // context
  const [auth] = useAuth();

  // hooks
  const windowSize = useWindowWidth();

  // effect for comment editing modal size
  useEffect(() => {
    setEditingModalSize(0.7 * windowSize);
  }, [windowSize]);

  // effect for fetching comments from server
  useEffect(() => {
    if (page === 1) return;
    fetchCommentsByPage(
      comments,
      setComments,
      setCounter,
      setLoading,
      commentsURL,
      page
    );
  }, [page]);

  // effect for fetching the latest comments from server
  useEffect(() => {
    if (auth?.token && page === 1) {
      fetchCommentsByPage(
        comments,
        setComments,
        setCounter,
        setLoading,
        commentsURL,
        page
      );
    }
  }, [auth?.token]);

  // effect for setting a proper comment amount based on keyword
  useEffect(() => {
    if (!keyword) setAmountOfDisplayedItems(comments.length);
    else setAmountOfDisplayedItems(getCommentsByKeyword(keyword).length);
  }, [keyword, comments]);

  const getCommentsByKeyword = (keyword) => {
    return comments.filter((comment) =>
      comment.content.toLowerCase().includes(keyword)
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <List
            itemLayout="horizontal"
            dataSource={getCommentsByKeyword(keyword)}
            renderItem={(item) => (
              <List.Item
                key={`Comment_${comments.findIndex(
                  (comment) => comment._id.toString() === item._id.toString()
                )})}`}
                actions={[
                  <Link
                    href={`/post/${slugify(item.postID.title)}#${item._id}`}
                  >
                    view
                  </Link>,
                  canEdit ? (
                    <a
                      onClick={() => {
                        setCurrentlyEditing({
                          item: item,
                          content: item.content,
                        });
                        setEditingModalVisibility(true);
                      }}
                    >
                      edit
                    </a>
                  ) : null,
                  canEdit ? (
                    <a
                      onClick={() =>
                        sendCommentDeletionRequest(item, comments, setComments)
                      }
                    >
                      delete
                    </a>
                  ) : null,
                ].filter((val) => val != null)}
              >
                <List.Item.Meta
                  title={item.content}
                  description={generateCommentDescription(item)}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <EditCommentModal
        currentlyEditing={currentlyEditing}
        setCurrentlyEditing={setCurrentlyEditing}
        comments={comments}
        setComments={setComments}
        modalVisibility={editingModalVisibility}
        setModalVisibility={setEditingModalVisibility}
        modalSize={editingModalSize}
      />
    </>
  );
}
