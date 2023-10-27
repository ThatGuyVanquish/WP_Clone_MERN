import SubscriberLayout from "../../components/layout/SubscriberLayout";
import ShowList from "../../components/general_use/ShowList";
import CommentsList from "../../components/comments/CommentsList";
import { fetchCommentCount } from "../../functions/comments";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";

/**
 * React component for the subscriber's comments page.
 * @returns {JSX.Element} The rendered component.
 */
export default function Comments() {
  // state
  const [commentCount, setCommentCount] = useState(0);
  // context
  const [auth] = useAuth();
  // hooks

  /**
   * Function to fetch and update the comment count for the current user.
   */
  useEffect(() => {
    if (auth?.token) {
      fetchCommentCount(setCommentCount, `/comment-count/${auth?.user?._id}`);
    }
  }, [auth]);

  return (
    <SubscriberLayout>
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
      />
    </SubscriberLayout>
  );
}
