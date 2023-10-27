import AdminLayout from "../../../components/layout/AdminLayout";
import EditProfile from "../../../components/user/EditProfile";

/**
 * Admin page for editing a user's profile with the option to choose a role.
 * @returns {JSX.Element} JSX for the EditUser page.
 */
export default function EditUser() {
  return (
    <AdminLayout>
      <EditProfile chooseRole={true} />
    </AdminLayout>
  );
}
