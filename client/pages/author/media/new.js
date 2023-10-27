import AuthorLayout from "../../../components/layout/AuthorLayout";
import UploadFile from "../../../components/media/UploadFile";
import { Row, Col } from "antd";

/**
 * Component for uploading a new image in the Author view.
 * @returns {JSX.Element} JSX for the NewMedia component.
 */
export default function NewMedia() {
  return (
    <AuthorLayout>
      <Row>
        <Col span={24}>
          <div style={{ padding: 100, textAlign: "center" }}>
            <h1>Upload a new image</h1>
            <UploadFile redirectToLibrary={true} />
          </div>
        </Col>
      </Row>
    </AuthorLayout>
  );
}
