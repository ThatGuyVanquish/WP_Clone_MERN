import { Modal } from "antd";
import CommentForm from "./CommentForm";
import { sendCommentUpdateRequest } from "../../functions/comments";
import { useState } from "react";

/**
 * EditCommentModal component for editing comments.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {Object} props.currentlyEditing - The comment being edited.
 * @param {Function} props.setCurrentlyEditing - A function to update the currently edited comment.
 * @param {Array} props.comments - The list of comments.
 * @param {Function} props.setComments - A function to update the comments list.
 * @param {boolean} props.modalVisibility - A boolean indicating if the modal is visible.
 * @param {Function} props.setModalVisibility - A function to update the modal visibility.
 * @param {number} props.modalSize - The size of the modal.
 *
 * @returns {JSX.Element} The rendered EditCommentModal component.
 */
export default function EditCommentModal({
  currentlyEditing,
  setCurrentlyEditing,
  comments,
  setComments,
  modalVisibility,
  setModalVisibility,
  modalSize,
}) {
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  return (
    <Modal
      className="EditCommentModal"
      title="EDIT COMMENT"
      open={modalVisibility}
      footer={null}
      onCancel={() => setModalVisibility(false)}
      onOk={() => setModalVisibility(false)}
      centered
      width={modalSize}
    >
      <CommentForm
        comment={currentlyEditing.content}
        setComment={(value) => {
          setCurrentlyEditing({ ...currentlyEditing, content: value });
        }}
        loading={loading}
        submit={() =>
          sendCommentUpdateRequest(
            currentlyEditing,
            setCurrentlyEditing,
            comments,
            setComments,
            setLoading,
            setModalVisibility
          )
        }
      />
    </Modal>
  );
}
