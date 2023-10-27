import { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Link from "next/link";
import { useAuth } from "../../../context/auth";
import {
  fetchUsersByPage,
  sendUserDeletionRequest,
} from "../../../functions/users";
import LinkToProfile from "../../user/ProfileLink";
/**
 * UsersList component for displaying a list of users.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {string} props.keyword - The search keyword.
 * @param {function} props.setCounter - A function to set the counter.
 * @param {function} props.setAmountOfDisplayedItems - A function to set the number of displayed items.
 *
 * @returns {JSX.Element} The rendered UsersList component.
 */
export default function UsersList({
  page,
  keyword,
  setLoading,
  setCounter,
  setAmountOfDisplayedItems,
}) {
  // context
  const [auth] = useAuth();

  // state
  const [users, setUsers] = useState([]);

  // useEffect hook to fetch posts when needed
  useEffect(() => {
    if (page > 1) {
      fetchUsersByPage(users, setUsers, setCounter, setLoading, page);
    }
  }, [page]);

  useEffect(() => {
    if (auth?.token && page === 1) {
      fetchUsersByPage(users, setUsers, setCounter, setLoading, page);
    }
  }, [auth]);

  useEffect(() => {
    if (!keyword) setAmountOfDisplayedItems(users.length);
    else
      setAmountOfDisplayedItems(
        users.filter((user) => user.email.toLowerCase().includes(keyword))
          .length
      );
  }, [keyword, users]);

  return (
    <>
      <Row>
        <Col span={24}>
          <List
            itemLayout="horizontal"
            dataSource={users.filter((user) =>
              user.email.toLowerCase().includes(keyword)
            )}
            renderItem={(user) => (
              <List.Item
                key={user.username}
                actions={[
                  <Link
                    href={
                      user?._id === auth?.user?._id || user?.role === "Admin"
                        ? ""
                        : `/admin/users/${user._id}`
                    }
                    disabled={
                      user?._id === auth?.user?._id || user?.role === "Admin"
                    }
                    onClick={() => {
                      if (user?._id === auth?.user?._id)
                        alert(
                          "Edit your own profile through the user profile page."
                        );
                    }}
                  >
                    edit
                  </Link>,
                  <a
                    disabled={
                      user?._id === auth?.user?._id || user?.role === "Admin"
                    }
                    onClick={() =>
                      sendUserDeletionRequest({
                        user,
                        myID: auth?.user?._id,
                        users,
                        setUsers,
                      })
                    }
                  >
                    delete
                  </a>,
                ]}
              >
                <Avatar src={user?.image?.url} shape="circle">
                  {user?.username ? user.username[0] : "E"}
                </Avatar>
                <List.Item.Meta
                  key="username"
                  title={<LinkToProfile user={user} />}
                  style={{ marginLeft: 10 }}
                />
                <List.Item.Meta
                  key="email"
                  description={user.email}
                  style={{ marginLeft: 10 }}
                />
                <List.Item.Meta
                  key="role"
                  description={user.role}
                  style={{ marginLeft: 10 }}
                />
                <List.Item.Meta
                  key="posts"
                  description={
                    user?.role === "Subscriber"
                      ? ""
                      : `${user?.posts?.length || 0} Posts`
                  }
                  style={{ marginLeft: 10 }}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </>
  );
}
