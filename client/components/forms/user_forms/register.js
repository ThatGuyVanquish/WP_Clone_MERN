import { Button, Checkbox, Form, Input } from "antd";
import { useEffect, useState } from "react";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/auth";
import { useRouter } from "next/router";
import LoadingRedirect from "../../LoadingPage";
import Link from "next/link";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
/**
 * Component for user registration and signup.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function RegistrationForm() {
  // context
  const [auth, setAuth] = useAuth();

  // state
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  const [loadingPage, setLoadingPage] = useState(true);

  // hooks
  const [form] = Form.useForm();
  const router = useRouter();

  const routeIfLoggedIn = async () => {
    try {
      const { data } = await axios.get("/user-role");
      if (data?.role) setLoadingPage(true);
    } catch (err) {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    routeIfLoggedIn();
  }, [auth]);

  /**
   * Handles the user registration request.
   *
   * @param {object} values - An object containing form values.
   * @property {string} values.username - The user's username.
   * @property {string} values.email - The user's email.
   * @property {string} values.name - The user's name.
   * @property {string} values.password - The user's password.
   * @property {string} values.confirm - The password confirmation.
   * @property {string} values.phone - The user's phone number.
   * @property {boolean} values.agreement - Whether the user accepts the agreement.
   */
  const sendRegistrationRequest = async ({
    username,
    email,
    name,
    password,
    confirm,
    phone,
    agreement,
  }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/signup`, {
        username,
        email: email.toLowerCase(),
        name,
        password,
        confirm,
        phone,
        agreement,
      });
      if (data?.error) {
        setLoading(false);
        toast.error(data.error);
      } else {
        toast.success("Successfully signed up!");
        // save in context
        setAuth(data);
        // save in storage
        localStorage.setItem("auth", JSON.stringify(data));
        setLoading(false);
        // route to main index
        setTimeout(() => {
          router.push("/");
          return;
        }, 300);
      }
    } catch (err) {
      // gets here if server is offline or unresponsive
      setLoading(false);
      toast.error("Signup Failed: ", err.error);
    }
  };
  if (loadingPage) {
    return <LoadingRedirect />;
  }
  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={sendRegistrationRequest}
        scrollToFirstError
      >
        <Form.Item>
          <h1 style={{ textAlign: "center" }}> SIGN UP</h1>
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
          />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your Name!",
            },
          ]}
        >
          <Input
            prefix={<SmileOutlined className="site-form-item-icon" />}
            placeholder="Name"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone number!",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
            }}
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            placeholder="Phone Number"
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
        >
          <Checkbox>
            I have read the <Link href="">agreement</Link>
          </Checkbox>
        </Form.Item>
        <Form.Item style={{ justifyContent: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              alignContent: "center",
            }}
          >
            Register
          </Button>
          ⠀Or <Link href="/signin">login now</Link> if you're already
          registered!
        </Form.Item>
      </Form>
    </div>
  );
}
