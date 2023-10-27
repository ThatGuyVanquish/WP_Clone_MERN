import { Layout } from "antd";
import AdminNav from "../nav/AdminNav";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import LoadingRedirect from "../LoadingPage";

const { Content } = Layout;

/**
 * A layout component for admin-related pages. It includes an admin navigation menu and
 * handles routing based on the user's authentication status.
 *
 * @component
 * @param {ReactNode} children - The child components or content to be displayed within the layout.
 * @returns {JSX.Element} AdminLayout component.
 */
function AdminLayout({ children }) {
  // context
  const [auth] = useAuth();

  // state
  const [loadingPage, setLoadingPage] = useState(true);

  const router = useRouter();

  const routeIfNotAdmin = async () => {
    try {
      const { data } = await axios.get("/current-admin");
      setLoadingPage(false);
    } catch (err) {
      router.push("/");
    }
  };

  useEffect(() => {
    if (auth?.token) routeIfNotAdmin();
  }, [auth?.token]);

  if (loadingPage) {
    return <LoadingRedirect />;
  }

  return (
    <Layout>
      <AdminNav />
      <Layout>
        <Content style={{ padding: "50px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
