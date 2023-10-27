import { useState } from "react";
import { Row, Col, Button, Input, Checkbox, Select } from "antd";
import { useRouter } from "next/router";
import generator from "generate-password";
import {
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { sendUserCreationRequest } from "../../../functions/users";

/**
 * NewUserForm component form to create a new user.
 *
 * @component
 */
export default function NewUserForm() {
  //state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(generator.generate({ length: 6 }));
  const [role, setRole] = useState("Subscriber");
  /**
   * notify state whether to notify the newly created user of their details via email.
   * @state
   * @type {boolean}
   */
  const [notify, setNotify] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for submission button.

  // hooks
  const router = useRouter();
  const { Option } = Select;

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: "-10px" }}>Create new user:</h1>
            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="username"
              value={username}
              prefix={<UserOutlined />}
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
              onChange={(e) => setName(e.target.value)}
              rules={[
                {
                  required: true,
                  message: "Please input a name!",
                },
              ]}
            />
            <Input
              style={{ margin: "20px 0px 10px 0px" }}
              size="large"
              placeholder="phone"
              value={phone}
              prefix={<PhoneOutlined />}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div style={{ display: "flex", textAlign: "center" }}>
              <Button
                style={{ margin: "20px 0px 10px 0px", borderRadius: "0px" }}
                size="large"
                onClick={() => setPassword(generator.generate({ length: 6 }))}
              >
                Generate
              </Button>
              <Input.Password
                style={{ margin: "20px 0px 10px 0px" }}
                size="large"
                placeholder="password"
                value={password}
                prefix={<LockOutlined />}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
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
              value={role}
            >
              <Option key={"Subscriber"}>Subscriber</Option>
              <Option key={"Author"}>Author</Option>
              <Option key={"Admin"}>Admin</Option>
            </Select>
            <h3>
              <Checkbox
                checked={notify}
                style={{ marginTop: "20px" }}
                onChange={(e) => setNotify(e.target.checked)}
              >
                Notify user of their login details?
              </Checkbox>
            </h3>
            <Button
              type="primary"
              style={{ width: "18%", marginTop: "40px" }}
              onClick={() =>
                sendUserCreationRequest(
                  username,
                  email,
                  name,
                  phone,
                  password,
                  role,
                  notify,
                  setLoading,
                  router
                )
              }
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
