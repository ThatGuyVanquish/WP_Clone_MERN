import AdminLayout from "../../../components/layout/AdminLayout";
import NewUserForm from "../../../components/admin_components/users/NewUser";

/**
 * Admin page for creating a new user.
 * @returns {JSX.Element} JSX for the page to create a new user.
 */
export default function NewUser() {
  return (
    <AdminLayout>
      <NewUserForm />
    </AdminLayout>
  );
}
