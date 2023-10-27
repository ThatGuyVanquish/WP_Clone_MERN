import ProfileLayout from "../../../components/layout/ProfileLayout";
import ShowList from "../../../components/general_use/ShowList";
import PostsList from "../../../components/posts/PostsList";
import axios from "axios";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  // Fetch the username and id
  const usernameResponse = await axios.get(
    `${process.env.API}/username/${slug}`
  );
  const { id, username } = usernameResponse.data;

  // Fetch the post count
  const postCountResponse = await axios.get(
    `${process.env.API}/post-count/${id}`
  );
  const postCount = postCountResponse.data;

  return {
    props: {
      id,
      username,
      postCount,
    },
  };
}
/**
 * Component for displaying posts in the Author view.
 * @returns {JSX.Element} JSX for the Posts component.
 */
export default function Posts({ id, username, postCount }) {
  return (
    <ProfileLayout id={id} username={username}>
      <ShowList
        ListComponent={PostsList}
        ListComponentProps={{
          postLoadURL: `/posts-by-user/${id}`,
        }}
        title="ALL POSTS"
        counterDescription="Posts"
        maxAmountOfItems={postCount}
        showSearch={true}
        showNewButton={false}
        newButtonURL="/author/posts/new"
      />
    </ProfileLayout>
  );
}
