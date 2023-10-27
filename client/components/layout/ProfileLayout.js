import { Layout } from "antd";
import ProfileNav from "../nav/ProfileNav";
import { getUserRole } from "../../functions/users";

const { Content } = Layout;
/**
 * A layout component for admin-related pages. It includes an admin navigation menu and
 * handles routing based on the user's authentication status.
 *
 * @component
 * @param {ReactNode} children - The child components or content to be displayed within the layout.
 * @returns {JSX.Element} AdminLayout component.
 */
export default function ProfileLayout({ id, username, children }) {
  // hooks
  return (
    <Layout>
      <ProfileNav username={username} role={getUserRole(id)} />
      <Layout>
        <Content style={{ padding: "50px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
