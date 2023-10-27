import { useState } from "react";

import {
  SettingOutlined,
  PushpinOutlined,
  CommentOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getItem } from "../../functions/navigation";
import Navigation from "./Navigation";

/**
 * Author navigation component that displays a collapsible sidebar menu.
 *
 * @component
 */
export default function AuthorNav() {
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
      <Link className={activeName("/author")} href="/author">
        Dashboard
      </Link>,
      "1",
      <SettingOutlined />
    ),
    // POSTS
    getItem("Posts", "sub1", <PushpinOutlined />, [
      getItem(
        <Link className={activeName("/author/posts")} href="/author/posts">
          All Posts
        </Link>,
        "2"
      ),
      getItem(
        <Link
          className={activeName("/author/posts/new")}
          href="/author/posts/new"
        >
          Add New Post
        </Link>,
        "3"
      ),
    ]),
    // MEDIA
    getItem("Media", "sub2", <CameraOutlined />, [
      getItem(
        <Link
          className={activeName("/author/media/library")}
          href="/author/media/library"
        >
          Library
        </Link>,
        "4"
      ),
      getItem(
        <Link
          className={activeName("/author/media/library/new")}
          href="/author/media/new"
        >
          Add New Image
        </Link>,
        "5"
      ),
    ]),
    getItem(
      <Link className={activeName("/author/comments")} href="/author/comments">
        Comments
      </Link>,
      "6",
      <CommentOutlined />
    ),
  ];
  return (
    <Navigation
      MenuItems={items}
      setCurrentPage={setCurrentPage}
      defaultOpenKeys={["sub1", "sub2"]}
    />
  );
}
