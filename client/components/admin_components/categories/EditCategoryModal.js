import { Form, Modal, Input, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

/**
 * EditCategoryModal component for updating a category name.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.visibility - Controls the visibility of the modal.
 * @param {function} props.setVisibility - Function to set the visibility of the modal.
 * @param {function} props.updateCategory - Function to update the category.
 * @param {Object} props.category - The category to be edited.
 */
export default function EditCategoryModal({
  visibility,
  setVisibility,
  updateCategory,
  category,
}) {
  // state
  const [loading, setLoading] = useState(false); // Loading state for submission button.
  const [categoryName, setCategoryName] = useState(category.name); // State for the value within the Input component.

  /**
   * Updates the category name state when the category prop changes.
   *
   * @param {Object} category - The new category data.
   */
  useEffect(() => {
    setCategoryName(category.name);
  }, [category.name]);

  return (
    <Modal
      title="Update category name:"
      open={visibility}
      footer={null}
      onCancel={() => setVisibility(false)}
    >
      <Form
        name="create-category"
        className="category-creation-form"
        onFinish={({ CategoryName }) => {
          updateCategory(CategoryName, category, setVisibility, setLoading);
        }}
        fields={[{ name: "CategoryName", value: categoryName }]}
      >
        <Form.Item
          name="CategoryName"
          rules={[
            {
              required: true,
              message: "Category must have a name!",
            },
          ]}
        >
          <Input
            prefix={<EditOutlined />}
            style={{ width: "90%" }}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="category-creation-form-button"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
