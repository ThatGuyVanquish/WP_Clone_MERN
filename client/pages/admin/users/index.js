import AdminLayout from "../../../components/layout/AdminLayout";
import ShowList from "../../../components/general_use/ShowList";
import UsersList from "../../../components/admin_components/users/UsersList";
import { useAuth } from "../../../context/auth";
import { useState, useEffect } from "react";
import { fetchUserCount } from "../../../functions/users";

/**
 * Admin page for managing users, displaying a list of all users and providing options to create new users.
 * @returns {JSX.Element} JSX for the Users page.
 */
export default function Users() {
  // context
  const [auth] = useAuth();
  // state
  const [userCount, setUserCount] = useState(0);
  // hooks
  useEffect(() => {
    if (auth?.token) {
      fetchUserCount(setUserCount);
    }
  }, [auth]);

  return (
    <AdminLayout>
      <ShowList
        ListComponent={UsersList}
        title="ALL USERS"
        counterDescription="Users"
        maxAmountOfItems={userCount}
        showNewButton={true}
        newButtonURL="/admin/users/new"
      />
    </AdminLayout>
  );
}
