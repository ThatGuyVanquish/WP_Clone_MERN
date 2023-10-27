import { MediaLibrary } from "../../../components/media/MediaLibrary";
import AuthorLayout from "../../../components/layout/AuthorLayout";
import { Row, Col } from "antd";

/**
 * Component for displaying the image library in the Author view.
 * @returns {JSX.Element} JSX for the Media component.
 */
export default function Media() {
  return (
    <AuthorLayout>
      <Row>
        <Col span={24}>
          <div style={{ textAlign: "center", padding: 100 }}>
            <h1>IMAGE LIBRARY</h1>
            <h3>Here are all of the images in the database</h3>
            <MediaLibrary />
          </div>
        </Col>
      </Row>
    </AuthorLayout>
  );
}
