import { Providers } from "../components/Providers";
import TopNav from "../components/nav/TopNav";
import "../public/css/styles.css";
import { Toaster } from "react-hot-toast";

export default function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <TopNav />
      <Toaster />
      <Component {...pageProps} />
    </Providers>
  );
}
