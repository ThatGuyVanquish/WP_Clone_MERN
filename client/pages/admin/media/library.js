import { MediaLibrary } from "../../../components/media/MediaLibrary";
import AdminLayout from "../../../components/layout/AdminLayout";
import { Row, Col } from "antd";

/**
 * Media page component displaying the image library.
 * @component
 */
export default function Media() {
  return (
    <AdminLayout>
      <Row>
        <Col span={24}>
          <div style={{ textAlign: "center", padding: 100 }}>
            <h1>IMAGE LIBRARY</h1>
            <h3>Here are all of the images in the database</h3>
            <MediaLibrary />
          </div>
        </Col>
      </Row>
    </AdminLayout>
  );
}
