import { CloseCircleOutlined, InboxOutlined } from "@ant-design/icons";
import { Upload, Image, Badge } from "antd";
import { useAuth } from "../../context/auth";
import { useMedia } from "../../context/media";

/**
 * Component for managing media library with multiple files upload and preview functionality.
 * @component
 */
export const MediaLibrary = () => {
  // context
  const [auth] = useAuth();
  const { media, setMedia, deleteMedia, getPropsForUploader } = useMedia();
  // hooks
  const { Dragger } = Upload;

  return (
    <>
      <Dragger {...getPropsForUploader(true)} accept="image/*">
        <div className="ant-upload-drag-icon">
          <InboxOutlined />
        </div>
        <div className="ant-upload-text">
          Click or drag file to this area to upload
        </div>
      </Dragger>
      <div style={{ textAlign: "center" }}>
        {media?.images?.map((image) => (
          <Badge>
            <Image
              preview={false}
              style={{
                paddingTop: 5,
                paddingRight: 10,
                height: "100px",
                width: "100px",
                objectFit: "contain",
                cursor: "pointer",
              }}
              src={image.url}
              onClick={() => {
                setMedia({ ...media, selected: image });
              }}
            />
            <br />
            {auth?.user?.role === "Admin" ||
            image.uploader?._id === auth.user?._id ? (
              <CloseCircleOutlined
                style={{ marginTop: "3px", color: "#F5222D" }}
                onClick={() => deleteMedia(image)}
              />
            ) : (
              <CloseCircleOutlined
                style={{ marginTop: "3px", color: "transparent" }}
              />
            )}
          </Badge>
        ))}
      </div>
    </>
  );
};
