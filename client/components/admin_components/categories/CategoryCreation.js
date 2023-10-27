import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useCategories } from "../../../context/categories";

/**
 * CategoryCreationForm component for creating new categories.
 *
 * @component
 */
export default function CategoryCreationForm() {
  // state
  const [loading, setLoading] = useState(false); // Loading state for submission button.

  // context
  const { sendCategoryCreationRequest } = useCategories();

  // hooks
  const [form] = Form.useForm();

  /**
   * Handles form submission and sends a category creation request.
   *
   * @param {object} values - An object containing the form values.
   * @property {string} name - The name of the category.
   */
  const handleFormSubmit = (values) => {
    sendCategoryCreationRequest(values, form, setLoading);
  };

  return (
    <Form
      name="create-category"
      className="category-creation-form"
      onFinish={handleFormSubmit}
      form={form}
    >
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "Category must have a name!",
          },
        ]}
      >
        <Input
          prefix={<EditOutlined />}
          placeholder="Category"
          style={{ width: "90%" }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="category-creation-form-button"
          loading={loading}
        >
          Create
        </Button>
      </Form.Item>
    </Form>
  );
}
