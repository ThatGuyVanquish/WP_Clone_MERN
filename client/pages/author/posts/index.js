import AuthorLayout from "../../../components/layout/AuthorLayout";
import ShowList from "../../../components/general_use/ShowList";
import PostsList from "../../../components/posts/PostsList";
import { usePosts } from "../../../context/posts";
import { useEffect } from "react";
import { useAuth } from "../../../context/auth";

/**
 * Component for displaying posts in the Author view.
 * @returns {JSX.Element} JSX for the Posts component.
 */
export default function Posts() {
  // context
  const [auth] = useAuth();
  const { postCount, fetchPostCount } = usePosts();
  // hooks
  useEffect(() => {
    if (auth?.token) {
      fetchPostCount(auth.user._id);
    }
  }, [auth]);

  return (
    <AuthorLayout>
      <ShowList
        ListComponent={PostsList}
        ListComponentProps={{
          postLoadURL: `/posts-by-user/${auth?.user?._id}`,
        }}
        title="ALL POSTS"
        counterDescription="Posts"
        maxAmountOfItems={postCount}
        showSearch={true}
        showNewButton={true}
        newButtonURL="/author/posts/new"
        canEdit={true}
      />
    </AuthorLayout>
  );
}
