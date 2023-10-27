import { Input, Button, Form } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
const { TextArea } = Input;

/**
 * Component for a contact form.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function ContactForm() {
  //state
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  const [form] = Form.useForm();

  /**
   * Handles the submission of the contact form.
   *
   * @param {object} values - An object containing form values.
   * @property {string} values.name - The user's name.
   * @property {string} values.email - The user's email.
   * @property {string} values.message - The user's message.
   */
  const sendContactRequest = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/contact", values);
      setLoading(false);
      if (data.ok) {
        toast.success("Message sent!");
        form.resetFields();
      } else {
        toast.error("Failed to send message: ", data.error);
      }
    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <Form form={form} onFinish={sendContactRequest}>
      <Form.Item
        name="name"
        rules={[
          { required: true, message: "Please enter your name", type: "string" },
        ]}
      >
        <Input placeholder="Your name" type="text" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email", type: "email" },
        ]}
      >
        <Input
          placeholder="Your email"
          type="email"
          prefix={<MailOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="message"
        rules={[
          {
            required: true,
            message: "Please enter your message",
            type: "string",
          },
        ]}
      >
        <TextArea
          showCount
          placeholder="Write your message here..."
          rows={4}
          maxLength={400}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
