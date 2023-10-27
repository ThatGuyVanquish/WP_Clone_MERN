import { useState } from "react";

import {
  SettingOutlined,
  PushpinOutlined,
  CommentOutlined,
  CameraOutlined,
  UserSwitchOutlined,
  FormatPainterOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getItem } from "../../functions/navigation";
import Navigation from "./Navigation";

/**
 * Admin navigation component that displays a collapsible sidebar menu.
 *
 * @component
 */
export default function AdminNav() {
  // state
  const [currentPage, setCurrentPage] = useState("");

  /**
   * Function to determine the active class based on the current page.
   *
   * @param {string} name - The name of the page.
   * @returns {string} - "active" if the page is currently active.
   */
  const activeName = (name) => `${currentPage === name && "active"}`;

  const items = [
    getItem(
      <Link className={activeName("/admin")} href="/admin">
        Dashboard
      </Link>,
      "1",
      <SettingOutlined />
    ),
    // POSTS
    getItem("Posts", "sub1", <PushpinOutlined />, [
      getItem(
        <Link className={activeName("/admin/posts")} href="/admin/posts">
          All Posts
        </Link>,
        "2"
      ),
      getItem(
        <Link
          className={activeName("/admin/posts/new")}
          href="/admin/posts/new"
        >
          Add New Post
        </Link>,
        "3"
      ),
      getItem(
        <Link
          className={activeName("/admin/categories")}
          href="/admin/categories"
        >
          Categories
        </Link>,
        "4"
      ),
    ]),
    // MEDIA
    getItem("Media", "sub2", <CameraOutlined />, [
      getItem(
        <Link
          className={activeName("/admin/media/library")}
          href="/admin/media/library"
        >
          Library
        </Link>,
        "5"
      ),
      getItem(
        <Link
          className={activeName("/admin/media/library/new")}
          href="/admin/media/new"
        >
          Add New Image
        </Link>,
        "6"
      ),
    ]),
    getItem(
      <Link className={activeName("/admin/comments")} href="/admin/comments">
        Comments
      </Link>,
      "7",
      <CommentOutlined />
    ),
    getItem("Users", "sub3", <UserSwitchOutlined />, [
      getItem(
        <Link className={activeName("/admin/users")} href="/admin/users">
          All Users
        </Link>,
        "8"
      ),
      getItem(
        <Link
          className={activeName("/admin/users/new")}
          href="/admin/users/new"
        >
          Add New User
        </Link>,
        "9"
      ),
    ]),
    getItem(
      <Link className={activeName("/admin/customize")} href="/admin/customize">
        Customize
      </Link>,
      "10",
      <FormatPainterOutlined />
    ),
  ];

  return (
    <Navigation
      MenuItems={items}
      setCurrentPage={setCurrentPage}
      defaultOpenKeys={["sub1", "sub2", "sub3"]}
    />
  );
}
