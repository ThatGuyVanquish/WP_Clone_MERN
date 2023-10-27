import AdminLayout from "../../../components/layout/AdminLayout";
import EditPostComponent from "../../../components/posts/EditPostComponent";

/**
 * AdminEditPost page component for editing a post in the admin panel.
 * @returns {JSX.Element} JSX for the AdminEditPost page.
 */
export default function AdminEditPost() {
  return (
    <AdminLayout>
      <EditPostComponent />
    </AdminLayout>
  );
}
