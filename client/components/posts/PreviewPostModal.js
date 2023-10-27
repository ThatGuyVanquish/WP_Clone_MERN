import { Modal, Image } from "antd";
import { useEffect, useState } from "react";
import { useWindowWidth } from "@react-hook/window-size";
import { useTheme } from "../../context/theme";
import { useMedia } from "../../context/media";
import Editor from "rich-markdown-editor";

/**
 * Component for displaying a preview of a post with its title, content, and selected media.
 * @component
 * @param {boolean} visible - Specifies whether the modal is visible.
 * @param {Function} setVisible - A function to set the visibility of the modal.
 * @param {string} title - The title of the post to be previewed.
 * @param {string} content - The content of the post to be previewed.
 */
export default function PreviewPostModal({
  visible,
  setVisible,
  title,
  content,
}) {
  //state
  const [previewSize, setPreviewSize] = useState(720);
  const { theme } = useTheme();
  const { media } = useMedia();
  // hooks
  const windowSize = useWindowWidth();
  useEffect(() => {
    setPreviewSize(0.7 * windowSize);
  }, [windowSize]);

  return (
    <Modal
      className="PreviewPostModal"
      title="Preview"
      open={visible}
      footer={null}
      onCancel={() => setVisible(false)}
      onOk={() => setVisible(false)}
      centered
      width={previewSize}
    >
      <h1>{title}</h1>
      {media?.selected && (
        <div style={{ textAlign: "center" }}>
          <Image src={media?.selected?.url} />
        </div>
      )}
      <div className="editor-scroll">
        <Editor
          dark={theme === "dark" ? true : false}
          value={content}
          readOnly={true}
        />
      </div>
    </Modal>
  );
}
