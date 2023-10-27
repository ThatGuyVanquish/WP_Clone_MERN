import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingRedirect from "../../LoadingPage";
import Link from "next/link";

/**
 * Component for handling user login and authentication.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function LoginForm() {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  const [loadingPage, setLoadingPage] = useState(true);

  // hooks
  const router = useRouter();

  const routeIfLoggedIn = async () => {
    try {
      const { data } = await axios.get("/user-role");
      if (data?.role) {
        setLoadingPage(true);
      }
    } catch (err) {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    routeIfLoggedIn();
  }, [auth]);

  let username = "";
  if (process.browser && localStorage.getItem("username")) {
    username = localStorage.getItem("username");
  }

  /**
   * Handles the user login request.
   *
   * @param {object} values - An object containing form values.
   * @property {string} values.username - The user's username.
   * @property {string} values.password - The user's password.
   * @property {boolean} values.remember - Whether to remember the user's login.
   */
  const sendLoginRequest = async (values) => {
    if (values.remember) localStorage.setItem("username", values.username);
    else localStorage.setItem("username", "");
    try {
      setLoading(true);
      const { data } = await axios.post(`/signin`, values);
      if (data?.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        toast.success("Successfully signed in!");
        // save in context
        setAuth(data);
        // save in storage
        localStorage.setItem("auth", JSON.stringify(data));
        setLoading(false);
        // permission based redirection
        if (data?.user?.role === "Admin") {
          setTimeout(() => {
            router.push("/admin");
            return;
          }, 1000);
        } else if (data?.user?.role === "Author") {
          setTimeout(() => {
            router.push("/author");
            return;
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/posts");
            return;
          }, 1000);
        }
      }
    } catch (err) {
      toast.error("Sign-in Failed");
    }
  };

  if (!loadingPage) {
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true, username: username }}
        onFinish={sendLoginRequest}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link className="login-form-forgot" href="/forgot-password">
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Log in
          </Button>
          ⠀Or <Link href="/signup">register now!</Link>
        </Form.Item>
      </Form>
    );
  }
  return <LoadingRedirect />;
}
