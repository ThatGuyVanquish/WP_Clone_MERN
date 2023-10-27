import AuthorLayout from "../../../components/layout/AuthorLayout";
import NewPostComponent from "../../../components/posts/NewPostComponent";

/**
 * Component for creating a new post in the Author view.
 * @returns {JSX.Element} JSX for the AuthorNewPost component.
 */
export default function AuthorNewPost() {
  return (
    <AuthorLayout>
      <NewPostComponent route="author" />
    </AuthorLayout>
  );
}
