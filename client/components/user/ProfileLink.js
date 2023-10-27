import Link from "next/link";
import slugify from "slugify";

export default function LinkToProfile({ user }) {
  return (
    <Link
      style={{ color: "inherit" }}
      href={`/profile/${slugify(user?.username)}`}
    >
      {user?.username}
    </Link>
  );
}
