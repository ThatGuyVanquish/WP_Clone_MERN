import { useAuth } from "../../context/auth";
import { Input, Button } from "antd";

const { TextArea } = Input;
/**
 * CommentForm component for rendering a comment input form.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {string} props.comment - The current comment text.
 * @param {Function} props.setComment - A function to update the comment text.
 * @param {Function} props.submit - A function to handle comment submission.
 * @param {boolean} props.loading - A flag indicating if comment submission is in progress.
 *
 * @returns {JSX.Element} The rendered CommentForm component.
 */
export default function CommentForm({ comment, setComment, submit, loading }) {
  // context
  const [auth] = useAuth();

  return (
    <>
      <TextArea
        showCount
        placeholder={
          auth?.user === null && auth?.token === ""
            ? "Please log in to comment!"
            : "Write a comment..."
        }
        rows={4}
        disabled={auth?.user === null && auth?.token === ""}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        value={comment}
        maxLength={400}
      />
      <Button
        style={{ marginTop: 10 }}
        type="primary"
        loading={loading}
        onClick={submit}
        disabled={(auth?.user === null && auth?.token === "") || comment === ""}
      >
        Post
      </Button>
    </>
  );
}
