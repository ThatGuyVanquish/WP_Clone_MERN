import { useTheme } from "../context/theme";
import Head from "next/head";

/**
 * Component for toggling between light and dark themes.
 * @component
 */
export default function ToggleTheme() {
  // hooks
  const { theme, setTheme } = useTheme();
  return (
    <>
      <Head>
        <link rel="stylesheet" href={`/css/${theme}.css`}></link>
      </Head>
      {theme === "light" ? (
        <span
          onClick={() => {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
          }}
          style={{ fontSize: "25px" }}
        >
          🌓
        </span>
      ) : (
        <span
          onClick={() => {
            setTheme("light");
            localStorage.setItem("theme", "light");
          }}
          style={{ fontSize: "25px" }}
        >
          🌞
        </span>
      )}
    </>
  );
}
