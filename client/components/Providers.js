import { ThemeProvider } from "../context/theme";
import { AuthProvider } from "../context/auth";
import { PostsProvider } from "../context/posts";
import { CategoriesProvider } from "../context/categories";
import { MediaProvider } from "../context/media";
import { StatsProvider } from "../context/stats";
import { HomepageProvider } from "../context/homepage";

/**
 * Component for wrapping the application with multiple context providers.
 * @component
 * @param {ReactNode} children - The child components to be wrapped by the context providers.
 */
export function Providers({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PostsProvider>
          <CategoriesProvider>
            <MediaProvider>
              <HomepageProvider>
                <StatsProvider>{children}</StatsProvider>
              </HomepageProvider>
            </MediaProvider>
          </CategoriesProvider>
        </PostsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
