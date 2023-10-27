import AdminLayout from "../../../components/layout/AdminLayout";
import ShowList from "../../../components/general_use/ShowList";
import PostsList from "../../../components/posts/PostsList";
import { usePosts } from "../../../context/posts";
import { useEffect } from "react";
import { useAuth } from "../../../context/auth";

/**
 * Posts page component for displaying a list of posts in the admin panel.
 * @returns {JSX.Element} JSX for the Posts page.
 */
export default function Posts() {
  // context
  const [auth] = useAuth();
  const { postCount, fetchPostCount } = usePosts();
  // hooks
  useEffect(() => {
    if (auth?.token) {
      fetchPostCount();
    }
  }, [auth]);

  return (
    <AdminLayout>
      <ShowList
        ListComponent={PostsList}
        ListComponentProps={{
          postLoadURL: "/posts",
        }}
        title="ALL POSTS"
        counterDescription="Posts"
        maxAmountOfItems={postCount}
        showSearch={true}
        showNewButton={true}
        newButtonURL="/admin/posts/new"
        canEdit={true}
      />
    </AdminLayout>
  );
}
