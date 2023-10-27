import AdminLayout from "../../components/layout/AdminLayout";
import ShowList from "../../components/general_use/ShowList";
import CommentsList from "../../components/comments/CommentsList";
import { fetchCommentCount } from "../../functions/comments";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";

/**
 * Admin page for managing comments.
 * @returns {JSX.Element} JSX for the admin page to manage comments.
 */
export default function Comments() {
  // state
  const [commentCount, setCommentCount] = useState(0);
  // context
  const [auth] = useAuth();
  // hooks
  useEffect(() => {
    if (auth?.token) {
      fetchCommentCount(setCommentCount, "/comment-count");
    }
  }, [auth]);

  return (
    <AdminLayout>
      <ShowList
        ListComponent={CommentsList}
        ListComponentProps={{
          commentsURL: "/comments",
        }}
        title="ALL COMMENTS"
        counterDescription="Comments"
        maxAmountOfItems={commentCount}
        showSearch={true}
        showNewButton={false}
        canEdit={true}
      />
    </AdminLayout>
  );
}
