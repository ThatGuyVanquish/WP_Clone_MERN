import { useState } from "react";

import {
  CommentOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { getItem } from "../../functions/navigation";
import Navigation from "./Navigation";
import slugify from "slugify";

/**
 * Profile navigation component that displays a collapsible sidebar menu.
 *
 * @component
 */
export default function ProfileNav({ username, role = "Subscriber" }) {
  // state
  const [currentPage, setCurrentPage] = useState("");
  /**
   * Function to determine the active class based on the current page.
   *
   * @param {string} name - The name of the page.
   * @returns {string} - "active" if the page is currently active.
   */
  const activeName = (name) => `${currentPage === name && "active"}`;

  const slug = slugify(username);

  const items = [
    getItem(
      <Link className={activeName("/profile")} href={`/profile/${slug}`}>
        {username || "Profile"}
      </Link>,
      "1",
      <UserOutlined />
    ),
    role === "Subscriber"
      ? null
      : getItem(
          <Link
            className={activeName(`/profile/${slug}/posts`)}
            href={`/profile/${slug}/posts`}
          >
            Posts
          </Link>,
          "2",
          <FileTextOutlined />
        ),
    getItem(
      <Link
        className={activeName(`/profile/${slug}/comments`)}
        href={`/profile/${slug}/comments`}
      >
        Comments
      </Link>,
      "3",
      <CommentOutlined />
    ),
  ];

  return <Navigation MenuItems={items} setCurrentPage={setCurrentPage} />;
}
