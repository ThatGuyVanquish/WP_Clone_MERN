import { useState, useEffect } from "react";
import { Row, Col, Button, Input, Avatar, Select, Modal } from "antd";
import { useRouter } from "next/router";
import UploadFile from "../media/UploadFile";
import { MediaLibrary } from "../media/MediaLibrary";
import {
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  FileImageOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/auth";
import { useWindowHeight } from "@react-hook/window-size";
import { useMedia } from "../../context/media";
import { sendUserUpdateRequest, fetchUser } from "../../functions/users";

/**
 * Component for editing user profile.
 * @component
 * @param {boolean} chooseRole - Determines whether the user can choose a
 *                                role for the user profile (I.E. admin permissions)
 */
export default function EditProfile({ chooseRole = false }) {
  //context
  const [auth, setAuth] = useAuth();
  const { media, setMedia } = useMedia();
  //state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Subscriber");
  const [loading, setLoading] = useState(false);

  //hooks
  const { Option } = Select;
  const router = useRouter();

  const { slug } = router.query;
  const topAvatarMargin = useWindowHeight() * 0.05;

  useEffect(() => {
    if (auth?.token) {
      fetchUser(
        slug,
        setUsername,
        setEmail,
        setName,
        setPhone,
        setRole,
        media,
        setMedia,
        router
      );
      if (router.query.slug === auth?.user?.slug)
        fetchUser(
          slug,
          setUsername,
          setEmail,
          setName,
          setPhone,
          setRole,
          media,
          setMedia,
          router
        );
    }
    return () => {
      setMedia({ ...media, selected: null });
    };
  }, [auth, router]);

  return (
    <>
      <Row>
        <Col md={24} xl={3} offset={1}>
          <div
            style={{ marginTop: `${topAvatarMargin}px`, textAlign: "center" }}
          >
            <Avatar
              src={media.selected?.url}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                fontSize: "150px",
                paddingTop: media.selected ? "0px" : "65px",
                marginBottom: "20px",
              }}
            >
              {username[0] || "E"}
            </Avatar>
            {(auth?.user?.slug === slug || chooseRole) && (
              <>
                <UploadFile />
                <div style={{ margin: "10px 0px 10px 0px" }}>
                  or select from database:
                </div>
                <Button
                  icon={<FileImageOutlined />}
                  onClick={() => setMedia({ ...media, showMediaModal: true })}
                >
                  Select
                </Button>
              </>
            )}
          </div>
        </Col>
        <Col sm={24} lg={12} offset={2}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: "-10px" }}>
              {auth?.user?.slug === slug
                ? `Edit user profile:`
                : `USER PROFILE`}
            </h1>

            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="username"
              value={username}
              prefix={<UserOutlined />}
              disabled={!chooseRole}
              onChange={(e) => setUsername(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Please input a valid Username!",
                },
              ]}
            />
            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="email"
              value={email}
              prefix={<MailOutlined />}
              disabled={!chooseRole}
              onChange={(e) => setEmail(e.target.value)}
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input a valid E-mail!",
                },
              ]}
            />
            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="name"
              value={name}
              prefix={<SmileOutlined />}
              disabled={auth?.user?.slug != slug && !chooseRole}
              onChange={(e) => setName(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            />
            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="phone"
              value={phone}
              disabled={auth?.user?.slug != slug && !chooseRole}
              prefix={<PhoneOutlined />}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div style={{ textAlign: "center" }}>
              {auth?.user?.slug === slug && (
                <Input.Password
                  style={{ margin: "20px 0px 10px 0px", width: "100%" }}
                  size="large"
                  placeholder="password"
                  value={password}
                  prefix={<LockOutlined />}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              )}
            </div>
            {chooseRole && (
              <Select
                placeholder="User role"
                onChange={(value) => setRole(value)}
                style={{ margin: "20px 0px 10px 0px", width: "30%" }}
                size="large"
                rules={[
                  {
                    required: true,
                    message: "Must set user role",
                  },
                ]}
                value={role} // Make sure 'role' is correctly initialized
              >
                <Option key={"Subscriber"}>Subscriber</Option>
                <Option key={"Author"}>Author</Option>
                <Option key={"Admin"}>Admin</Option>
              </Select>
            )}

            <br />
            {(auth?.user?.slug === slug || chooseRole) && (
              <Button
                type="primary"
                style={{ width: "18%", marginTop: "20px" }}
                onClick={() =>
                  sendUserUpdateRequest(
                    slug,
                    email,
                    phone,
                    password,
                    role,
                    media,
                    setMedia,
                    auth,
                    setAuth,
                    setPassword,
                    setLoading,
                    chooseRole,
                    router
                  )
                }
                htmlType="submit"
                loading={loading}
              >
                Submit
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Modal
        open={media.showMediaModal}
        centered
        title="Media"
        onOk={() =>
          setMedia({
            ...media,
            showMediaModal: false,
          })
        }
        onCancel={() =>
          setMedia({
            ...media,
            showMediaModal: false,
          })
        }
        width={720}
        footer={null}
      >
        <MediaLibrary />
      </Modal>
    </>
  );
}
