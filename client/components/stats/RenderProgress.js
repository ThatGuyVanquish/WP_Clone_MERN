import { Progress } from "antd";
import CountTo from "react-count-to";
import Link from "next/link";
import { useTheme } from "../../context/theme";

/**
 * Component to render a progress indicator with a count animation and a link.
 * @component
 * @param {number} number - The number to be counted to in the progress indicator.
 * @param {string} name - The name or label associated with the progress indicator.
 * @param {string} link - The URL link to navigate to when clicking the progress indicator (default: "#").
 */
export default function RenderProgress({ number, name, link = "#" }) {
  const { theme } = useTheme();
  return (
    <Link href={link}>
      <Progress
        type="circle"
        strokeColor={{ "0%": "#108ee9", "50%": "white", "100%": "black" }}
        percent={100}
        format={() => <CountTo to={number || 0} speed={number * 100} />}
      />
      <pre
        style={{ marginTop: 18, color: theme === "dark" ? "white" : "black" }}
      >
        {name.toUpperCase()}
      </pre>
    </Link>
  );
}
