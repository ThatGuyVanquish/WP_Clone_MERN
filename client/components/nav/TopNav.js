import {
  MehOutlined,
  SmileOutlined,
  UserAddOutlined,
  HomeOutlined,
  UnlockOutlined,
  LogoutOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  MailOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Menu } from "antd";
import { useState } from "react";
import ToggleTheme from "../ToggleTheme";
import { useAuth } from "../../context/auth";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

/**
 * Top navigation bar component for the application.
 *
 * @component
 */
export default function TopNav() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [current, setCurrent] = useState("mail");
  // hooks
  const router = useRouter();

  /**
   * Signs the user out and performs the necessary actions.
   */
  const signOut = () => {
    // Redirect to main page
    router.push("/");
    toast.success("Signed out successfully");
    // Remove from local storage
    localStorage.removeItem("auth");
    // Remove from context
    setTimeout(() => {
      setAuth({ user: null, token: "" });
    }, 1);
  };

  /**
   * Handles the click event for the navigation items.
   *
   * @param {object} e - The event object.
   */
  const onClick = (e) => {
    setCurrent(e.key);
    if (e.key === "Sign-Out") {
      signOut();
    }
  };

  /**
   * Generates a role-based link for the user's dashboard.
   *
   * @returns {string} - The role-based link.
   */
  const roleBasedLink = () => {
    return `/${auth?.user?.role.toLowerCase()}`;
  };

  // Navigation menu items
  const loggedOutDashboard = {
    label: "Welcome!",
    key: "LoggedOutSubMenu",
    icon: <MehOutlined />,
    style: {
      marginLeft: "auto",
    },
    children: [
      {
        label: <Link href="/signin">Sign In</Link>,
        key: "Sign-In",
        icon: <UnlockOutlined />,
      },
      {
        label: <Link href="/signup">Sign Up</Link>,
        key: "Sign-Up",
        icon: <UserAddOutlined />,
      },
    ],
  };

  const loggedInDashboard = {
    label: `Hello, ${auth?.user?.name.split(" ")[0]}!`,
    key: "LoggedInSubMenu",
    icon: <SmileOutlined />,
    style: {
      marginLeft: "auto",
    },
    children: [
      {
        label: "Sign Out",
        key: "Sign-Out",
        icon: <LogoutOutlined />,
      },
      {
        type: "group",
        label: "Management",
        children: [
          {
            label: <Link href={roleBasedLink()}>Dashboard</Link>,
            key: "Dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: <Link href={`/profile/${auth?.user?.slug}`}>Profile</Link>,
            key: "Profile-Settings",
            icon: <UserOutlined />,
          },
        ],
      },
    ],
  };

  const CMS = {
    label: <Link href="/">CMS</Link>,
    key: "CMS",
    icon: <HomeOutlined />,
  };

  const Contact = {
    label: <Link href="contact">Contact</Link>,
    key: "Contact",
    icon: <MailOutlined />,
  };

  const Posts = {
    label: <Link href="/posts">Posts</Link>,
    key: "Posts",
    icon: <FileTextOutlined />,
  };

  const Categories = {
    label: <Link href="/categories">Categories</Link>,
    key: "Categories",
    icon: <UnorderedListOutlined />,
  };

  const ThemeToggler = {
    label: <ToggleTheme />,
  };

  const itemsToShow = [
    CMS,
    Posts,
    Categories,
    Contact,
    auth?.token ? loggedInDashboard : loggedOutDashboard,
    ThemeToggler,
  ];
  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={itemsToShow}
      theme="dark"
    />
  );
}
