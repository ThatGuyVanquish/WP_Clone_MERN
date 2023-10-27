import { Layout } from "antd";
import SubscriberNav from "../nav/SubscriberNav";
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingRedirect from "../LoadingPage";

const { Content } = Layout;

/**
 * A layout component for subscriber-related pages. It includes an subscriber navigation menu and
 * handles routing based on the user's authentication status.
 *
 * @component
 * @param {ReactNode} children - The child components or content to be displayed within the layout.
 * @returns {JSX.Element} SubscriberLayout component.
 */
export default function SubscriberLayout({ children }) {
  // context
  const [auth] = useAuth();

  // state
  const [loadingPage, setLoadingPage] = useState(true);

  const routeIfNotSubscriber = async () => {
    try {
      const { data } = await axios.get("/current-subscriber");
      setLoadingPage(false);
    } catch (err) {
      setLoadingPage(true);
    }
  };

  useEffect(() => {
    if (auth?.token) routeIfNotSubscriber();
  }, [auth?.token]);

  if (loadingPage) {
    return <LoadingRedirect />;
  }

  return (
    <Layout style={{ height: "100%" }}>
      <SubscriberNav />
      <Layout>
        <Content style={{ padding: "50px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
