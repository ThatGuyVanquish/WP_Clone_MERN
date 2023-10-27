import { Layout } from "antd";
import AuthorNav from "../nav/AuthorNav";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingRedirect from "../LoadingPage";

const { Content } = Layout;

/**
 * A layout component for author-related pages. It includes an author navigation menu and
 * handles routing based on the user's authentication status.
 *
 * @component
 * @param {ReactNode} children - The child components or content to be displayed within the layout.
 * @returns {JSX.Element} AuthorLayout component.
 */
function AuthorLayout({ children }) {
  // context
  const [auth] = useAuth();

  // state
  const [loadingPage, setLoadingPage] = useState(true);

  const routeIfNotAuthor = async () => {
    try {
      const { data } = await axios.get("/current-author");
      setLoadingPage(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (auth?.token) routeIfNotAuthor();
  }, [auth?.token]);

  if (loadingPage) {
    return <LoadingRedirect />;
  }

  return (
    <Layout style={{ height: "100%" }}>
      <AuthorNav />
      <Layout>
        <Content style={{ padding: "50px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AuthorLayout;
