import AuthorLayout from "../../components/layout/AuthorLayout";
import ShowList from "../../components/general_use/ShowList";
import CommentsList from "../../components/comments/CommentsList";
import { fetchCommentCount } from "../../functions/comments";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";

/**
 * Component for displaying comments in the Author view.
 * @returns {JSX.Element} JSX for the Comments component.
 */
export default function Comments() {
  // state
  const [commentCount, setCommentCount] = useState(0);
  // context
  const [auth] = useAuth();
  // hooks
  useEffect(() => {
    if (auth?.token) {
      fetchCommentCount(setCommentCount, `/comment-count/${auth?.user?._id}`);
    }
  }, [auth]);

  return (
    <AuthorLayout>
      <ShowList
        ListComponent={CommentsList}
        ListComponentProps={{
          commentsURL: `/comments/${auth?.user?._id}`,
        }}
        title="ALL COMMENTS"
        counterDescription="Comments"
        maxAmountOfItems={commentCount}
        showSearch={true}
        showNewButton={false}
        canEdit={true}
      />
    </AuthorLayout>
  );
}
