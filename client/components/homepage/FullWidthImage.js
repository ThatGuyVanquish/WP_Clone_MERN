import { Button } from "antd";
import Link from "next/link";
import { useHomepage } from "../../context/homepage";

/**
 * A component that displays a full-width image along with a title, subtitle, and an "Explore" button.
 *
 * @component
 * @returns {JSX.Element} FullWidthImage component.
 */
export default function FullWidthImage() {
  const { homepage } = useHomepage();
  return (
    <div style={{ outline: "none" }}>
      <img
        src={homepage?.titleImage?.url || "/images/no_image.jpg"}
        alt=""
        style={{
          width: "100%",
          height: "500px",
          overflow: "hidden",
          objectFit: "cover",
          outline: "none",
        }}
        select="true"
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "-420px",
          fontSize: "75px",
          textShadow: "2px 2px 4px black",
        }}
      >
        <h1> {homepage.title} </h1>
        <div style={{ fontSize: "18px", marginTop: "-100px", color: "white" }}>
          {homepage.subtitle}
        </div>
        <Link href="/posts">
          <Button type="primary">Explore</Button>
        </Link>
      </div>
    </div>
  );
}
