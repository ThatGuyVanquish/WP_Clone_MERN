import ProfileLayout from "../../../components/layout/ProfileLayout";
import ShowList from "../../../components/general_use/ShowList";
import CommentsList from "../../../components/comments/CommentsList";
import axios from "axios";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  // Fetch the username and id
  const usernameResponse = await axios.get(
    `${process.env.API}/username/${slug}`
  );
  const { id, username } = usernameResponse.data;

  // Fetch the comment count
  const commentCountResponse = await axios.get(
    `${process.env.API}/comment-count/${id}`
  );
  const commentCount = commentCountResponse.data;

  return {
    props: {
      id,
      username,
      commentCount,
    },
  };
}

/**
 * Component for displaying comments in the profile view.
 * @returns {JSX.Element} JSX for the Comments component.
 */
export default function Comments({ id, username, commentCount }) {
  return (
    <ProfileLayout id={id} username={username}>
      <ShowList
        ListComponent={CommentsList}
        ListComponentProps={{
          commentsURL: `/comments/${id}`,
        }}
        title="ALL COMMENTS"
        counterDescription="Comments"
        maxAmountOfItems={commentCount}
        showSearch={true}
        showNewButton={false}
      />
    </ProfileLayout>
  );
}
