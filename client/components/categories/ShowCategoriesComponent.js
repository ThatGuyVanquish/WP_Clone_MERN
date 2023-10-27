import Link from "next/link";
import { Divider, Button } from "antd";
import { useCategories } from "../../context/categories";

/**
 * ShowCategories component for displaying a list of categories.
 *
 * @component
 *
 * @param {Object} props - The component's props.
 * @param {string} props.children - The child components to display.
 * @param {string} props.textAlign - The text alignment for the component.
 * @param {string} props.fontSize - The font size for the component.
 *
 * @returns {JSX.Element} The rendered ShowCategories component.
 */
export default function ShowCategories({
  children,
  textAlign = "center",
  fontSize = "50px",
}) {
  // context
  const { categories } = useCategories();

  return (
    <>
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: textAlign,
        }}
      >
        <Divider
          orientation="center"
          style={{ fontSize: fontSize, fontFamily: "monospace" }}
        >
          Categories
        </Divider>
        {children}
        {categories.map((c) => (
          <Link href={`/category/${c.slug}`} key={c._id}>
            <Button style={{ margin: 2 }}>{c.name}</Button>
          </Link>
        ))}
      </div>
    </>
  );
}
