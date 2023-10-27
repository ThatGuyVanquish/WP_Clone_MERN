import toast from "react-hot-toast";
import axios from "axios";
import LinkToProfile from "../components/user/ProfileLink";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

/**
 * Deletes a comment and updates the comments list.
 *
 * @param {object} comment - The comment to delete.
 * @param {array} comments - The list of all comments.
 * @param {function} setComments - A function to set the updated comments list.
 */
export const sendCommentDeletionRequest = async (
  comment,
  comments,
  setComments
) => {
  const confirmation = window.confirm(
    "Are you sure you want to delete this comment?"
  );
  if (!confirmation) return;
  try {
    const { data } = await axios.delete(`/comment/${comment._id}`);
    if (data.ok) {
      const newComments = comments.filter((c) => c._id != comment._id);
      setComments(newComments);
      toast.success("Comment deleted successfully");
    } else toast.error(`Failed to delete comment because of ${data.err}`);
  } catch (err) {
    toast.error(err);
  }
};

/**
 * Edits a comment and updates the comments list.
 *
 * @param {object} currentlyEditing - The comment being edited and its content.
 * @param {function} setCurrentlyEditing - A function to reset the comment being edited.
 * @param {array} comments - The list of all comments.
 * @param {function} setComments - A function to set the updated comments list.
 * @param {function} setLoading - A function to set the loading state for modal button.
 * @param {function} setModalVisibility - A function to set the visibility of the modal.
 */
export const sendCommentUpdateRequest = async (
  currentlyEditing,
  setCurrentlyEditing,
  comments,
  setComments,
  setLoading,
  setModalVisibility
) => {
  setLoading(true);
  try {
    const { data } = await axios.put(`/comment/${currentlyEditing.item._id}`, {
      content: currentlyEditing.content,
    });
    if (data.error) {
      setLoading(false);
      toast.error("Failed to edit comment: ", data.error);
      return;
    }
    const newComments = comments.map((c) => {
      c._id.toString() === data._id.toString()
        ? (c.content = currentlyEditing.content)
        : null;
      return c;
    }, []);
    setComments(newComments);
    setModalVisibility(false);
    setLoading(false);
    setCurrentlyEditing({ item: null, content: "" });
    toast.success("Comment edited successfully");
  } catch (err) {
    setLoading(false);
    toast.error("Failed to edit comment: ", err);
  }
};

/**
 * Fetches the comment count and updates the state.
 *
 * @param {function} setCommentCount - A function to set the comment count.
 * @param {string} url - The URL to fetch the comment count.
 */
export const fetchCommentCount = async (setCommentCount, url) => {
  try {
    const { data } = await axios.get(url);
    setCommentCount(data);
  } catch (err) {
    toast.error("Failed to fetch comment count: ", err);
  }
};

/**
 * Fetches comments by page and updates the comments list.
 *
 * @param {array} comments - The list of all comments.
 * @param {function} setComments - A function to set the updated comments list.
 * @param {function} setCounter - A function to set the counter.
 * @param {function} setLoading - A function to set the loading state.
 * @param {string} url - The URL to fetch comments.
 * @param {number} page - The page number.
 */
export const fetchCommentsByPage = async (
  comments,
  setComments,
  setCounter,
  setLoading,
  url,
  page
) => {
  setLoading(true);
  try {
    const { data } = await axios.get(`${url}/${page}`);
    if (page === 1) {
      setComments(data);
      setCounter(data.length);
    } else {
      setCounter(comments.length + data.length);
      setComments([...comments, ...data]);
    }
    setLoading(false);
  } catch (err) {
    toast.error(`Failed to fetch comments from page ${page}: ${err.message}`);
  }
};

/**
 * Submits a comment and updates the comments list.
 *
 * @param {object} post - The post to which the comment is sent.
 * @param {string} comment - The comment's content.
 * @param {function} setComment - A function to set the updated comment's content.
 * @param {array} comments - The list of all comments.
 * @param {function} setComments - A function to set the updated comments list.
 * @param {function} setLoading - A function to set the loading state.
 */
export const sendCommentCreationRequest = async (
  post,
  comment,
  setComment,
  comments,
  setComments,
  setLoading
) => {
  try {
    setLoading(true);
    const { data } = await axios.post(`/comment/${post._id}`, { comment });
    if (data?.error) {
      setLoading(false);
      toast.error(`Failed to submit comment: ${data.error}`);
      return;
    } else {
      setComments([data, ...comments]);
      setComment("");
      toast.success("Comment posted successfully!");
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);
    toast.error(`Failed to submit comment: ${err.message}`);
  }
};

/**
 * Generates a description for a comment.
 *
 * @param {object} item - The comment item.
 * @returns {string} - The generated comment description.
 */
export const generateCommentDescription = (item) => {
  const postTitle = item.postID.title;
  const createdAt = item.createdAt;
  const lastEdit = item.updatedAt;
  const wasEdited = createdAt != lastEdit;
  const description = (
    <p>
      By {item.author ? <LinkToProfile user={item.author} /> : "DELETED USER"} |
      On {postTitle} |{" "}
      {wasEdited
        ? `${dayjs(lastEdit).format("L LT")} (EDITED)`
        : dayjs(createdAt).format("L LT")}
    </p>
  );

  return description;
};
