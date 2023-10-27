import { Divider, Button } from "antd";
import { useCategories } from "../../context/categories";
import Link from "next/link";
import { useLatestPosts } from "../../context/posts";

/**
 * Sidebar component for displaying categories and recent posts.
 * @component
 */
export default function SidebarComponent() {
  // context
  const { categories } = useCategories();
  const { latestPosts } = useLatestPosts();

  return (
    <div>
      {/* Divider for Categories */}
      <Divider orientation="left">Categories</Divider>
      {categories.map((c) => (
        <Link href={`/category/${c.slug}`} key={c._id}>
          <Button style={{ margin: 2 }}>{c.name}</Button>
        </Link>
      ))}
      {/* Divider for Recent Posts */}
      <Divider orientation="left" style={{ marginTop: "20px" }}>
        Recent Posts
      </Divider>
      {latestPosts.map((p) => (
        <Link href={`/post/${p.slug}`} key={p._id}>
          <Button style={{ margin: 2 }}>
            <div
              style={{
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {p.title}
            </div>
          </Button>
        </Link>
      ))}
    </div>
  );
}
