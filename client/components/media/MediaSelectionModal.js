import { Modal } from "antd";
import { useMedia } from "../../context/media";
import MediaTabs from "./MediaTabs";

/**
 * Component for displaying a media selection modal.
 * @param {Object} props - Component props.
 * @param {Function} props.onOk - Function to handle the "OK" button click.
 * @param {Function} props.onCancel - Function to handle the "Cancel" button click.
 * @component
 *
 * @returns {JSX.Element} MediaSelection component.
 */
export default function MediaSelection({ onOk, onCancel }) {
  // context
  const { media } = useMedia();
  return (
    <Modal
      open={media.showMediaModal}
      centered
      title="Media"
      onOk={onOk}
      onCancel={onCancel}
      width={720}
      footer={null}
    >
      <MediaTabs />
    </Modal>
  );
}
