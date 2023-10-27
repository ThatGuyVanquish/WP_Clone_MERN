import AdminLayout from "../../../components/layout/AdminLayout";
import UploadFile from "../../../components/media/UploadFile";
import { Row, Col } from "antd";

/**
 * NewMedia page component for uploading a new image.
 * @returns {JSX.Element} JSX for the NewMedia page.
 */
export default function NewMedia() {
  return (
    <AdminLayout>
      <Row>
        <Col span={24}>
          <div style={{ padding: 100, textAlign: "center" }}>
            <h1>Upload a new image</h1>
            {/* Component for uploading a file with redirection to the media library */}
            <UploadFile redirectToLibrary={true} />
          </div>
        </Col>
      </Row>
    </AdminLayout>
  );
}
