import { useState, useEffect } from "react";
import { useWindowWidth, useWindowHeight } from "@react-hook/window-size";

import { SettingOutlined, CommentOutlined } from "@ant-design/icons";
import { Menu, Layout } from "antd";
import Link from "next/link";

const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

/**
 * Subscriber navigation component that displays a collapsible sidebar menu.
 *
 * @component
 */
export default function SubscriberNav() {
  // state
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("");

  // hooks
  const windowWidth = useWindowWidth();
  const windowHeight = useWindowHeight() - 90;

  useEffect(() => {
    process.browser && setCurrentPage(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  useEffect(() => {
    if (windowWidth < 800) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [windowWidth < 800]);

  /**
   * Function to determine the active class based on the current page.
   *
   * @param {string} name - The name of the page.
   * @returns {string} - "active" if the page is currently active.
   */
  const activeName = (name) => `${currentPage === name && "active"}`;

  const items = [
    getItem(
      <Link className={activeName("/subscriber")} href="/subscriber">
        Dashboard
      </Link>,
      "1",
      <SettingOutlined />
    ),
    getItem(
      <Link
        className={activeName("/subscriber/comments")}
        href="/subscriber/comments"
      >
        Comments
      </Link>,
      "2",
      <CommentOutlined />
    ),
  ];

  return (
    <Sider
      style={{ width: 256, height: windowHeight }}
      collapsible
      collapsed={collapsed}
      onCollapse={() => {
        setCollapsed(!collapsed);
      }}
    >
      <Menu
        defaultOpenKeys={["sub1", "sub2", "sub3"]}
        selectedKeys={["active"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}
