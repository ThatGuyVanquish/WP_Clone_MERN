import { useState, useEffect } from "react";
import { useWindowWidth, useWindowHeight } from "@react-hook/window-size";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

/**
 * Generalized navigation component that displays a collapsible sidebar menu.
 *
 * @component
 */
export default function Navigation({
  MenuItems,
  defaultOpenKeys = [],
  setCurrentPage,
}) {
  // state
  const [collapsed, setCollapsed] = useState(false);

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
        selectedKeys={["active"]}
        mode="inline"
        items={MenuItems}
        defaultOpenKeys={defaultOpenKeys}
      />
    </Sider>
  );
}
