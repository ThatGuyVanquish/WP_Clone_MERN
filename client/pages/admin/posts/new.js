import AdminLayout from "../../../components/layout/AdminLayout";
import NewPostComponent from "../../../components/posts/NewPostComponent";

/**
 * Admin page for creating a new post in the admin panel.
 * @returns {JSX.Element} JSX for the AdminNewPost page.
 */
const AdminNewPost = () => (
  <AdminLayout>
    <NewPostComponent />
  </AdminLayout>
);

export default AdminNewPost;
