import AuthorLayout from "../../../components/layout/AuthorLayout";
import EditPostComponent from "../../../components/posts/EditPostComponent";

/**
 * Component for editing a post in the Author view.
 * @returns {JSX.Element} JSX for the AuthorEditPost component.
 */
export default function AuthorEditPost() {
  return (
    <AuthorLayout>
      <EditPostComponent />
    </AuthorLayout>
  );
}
