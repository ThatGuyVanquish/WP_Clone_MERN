import CategoryCreationForm from "../../components/admin_components/categories/CategoryCreation";
import CategoryDisplay from "../../components/admin_components/categories/CategoryDisplay";
import AdminLayout from "../../components/layout/AdminLayout";
import { Col, Row } from "antd";

/**
 * Admin page for managing categories.
 * @returns {JSX.Element} JSX for the admin page to manage categories.
 */
export default function Categories() {
  return (
    <AdminLayout>
      <Row>
        <Col span={12} style={{ paddingTop: "10px" }}>
          <h1>CATEGORIES</h1>
          <h4>Add a new category:</h4>
          <CategoryCreationForm />
        </Col>
        <Col xs={22} sm={22} lg={8} offset={1}>
          <CategoryDisplay />
        </Col>
      </Row>
    </AdminLayout>
  );
}
