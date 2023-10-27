import { CodeOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import LoadingRedirect from "../../LoadingPage";
import Link from "next/link";

/**
 * Component for handling forgot password and password reset requests.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function ForgotPasswordForm() {
  // context
  const [auth] = useAuth();

  // state
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  /**
   * awaitingCode state discerns whether the user has already been sent a password reset
   * code or not, and if so send the form (which is also rendered based on the awaitingCode state)
   * values to the proper endpoint.
   * @state
   * @type {boolean}
   */
  const [awaitingCode, setAwaitingCode] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true); // Display a loading page for redirect.

  // hooks
  const router = useRouter();

  const routeIfLoggedIn = async () => {
    try {
      const { data } = await axios.get("/user-role");
      router.push("/");
    } catch (err) {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    if (auth?.token) routeIfLoggedIn();
    else setLoadingPage(false);
  }, [auth?.token]);

  /**
   * Handles the forgot password or password reset request based on the current state.
   *
   * @param {object} values - An object containing form values.
   * @property {string} values.username - The user's username.
   * @property {string} values.resetCode - The received password reset code.
   * @property {string} values.password - The new password.
   */
  const forgotPasswordRequest = async (values) => {
    setLoading(true);
    try {
      if (awaitingCode) {
        const { data } = await axios.post(`/forgot-password`, values);
        if (data?.error) {
          setLoading(false);
          toast.error(data.error);
        } else {
          toast.success("Check your email for the code to reset your password");
          setLoading(false);
          setAwaitingCode(false);
        }
      } else {
        const { data } = await axios.post(`/reset-password`, values);
        if (data?.error) {
          setLoading(false);
          toast.error(data.error);
        } else {
          toast.success("Your password has been reset! Continue to login");
          setLoading(false);
          setAwaitingCode(true);
          router.push("/signin");
        }
      }
    } catch (err) {
      toast.error(`Forgot Password Failed: ${err.message}`);
    }
  };

  if (loadingPage) {
    return <LoadingRedirect />;
  }

  return (
    <Form
      name="forgotPassword"
      className="forgot-password-form"
      onFinish={forgotPasswordRequest}
    >
      {/* username */}
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
      {/* reset code and password*/}
      {!awaitingCode && (
        <>
          <Form.Item
            name="resetCode"
            rules={[
              {
                required: true,
                message: "Please input the received password reset code",
              },
            ]}
          >
            <Input
              prefix={<CodeOutlined />}
              className="resetCode"
              placeholder="Reset Code"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input a new password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="New Password"
            />
          </Form.Item>
        </>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={loading}
        >
          Submit
        </Button>
        {" Or"} <Link href="/signin">Login</Link>
      </Form.Item>
    </Form>
  );
}
