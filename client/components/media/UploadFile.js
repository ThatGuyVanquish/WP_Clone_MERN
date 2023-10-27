import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { useMedia } from "../../context/media";

/**
 * Component for uploading files with an option to redirect to the media library.
 *
 * @param {object} props - The component's props.
 * @param {boolean} [props.redirectToLibrary=false] - If true, redirects to the media library after uploading.
 * @returns {JSX.Element} The rendered component.
 */
export default function UploadFile({ redirectToLibrary = false }) {
  // context
  const { getPropsForUploader } = useMedia();

  return (
    <div style={{ textAlign: "center" }}>
      <Upload {...getPropsForUploader(false, redirectToLibrary)} maxCount={1}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </div>
  );
}
