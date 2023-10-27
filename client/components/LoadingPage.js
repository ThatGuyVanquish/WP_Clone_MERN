import { useEffect, useState } from "react";
import { useRouter } from "next/router";

/**
 * Component for displaying a loading screen with a countdown before redirecting.
 * @component
 * @param {string} path - The path to which the user will be redirected.
 */
export default function LoadingRedirect({ path = "/" }) {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    if (count === 0) {
      clearInterval(interval);
      router.push(path);
    }
  }, [count]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>Redirecting in: {count} seconds</div>
    </div>
  );
}
