/**
 * A component that displays an image with a parallax effect, allowing for dynamic backgrounds.
 *
 * @component
 * @param {string} [url="/images/swiss2.jpg"] - The URL of the background image.
 * @param {ReactNode} children - The child components or content to be displayed on top of the image.
 * @param {string} [paddingTop="100px"] - The padding at the top of the parallax section.
 * @param {string} [paddingBottom="75px"] - The padding at the bottom of the parallax section.
 * @param {string} [bgPosition="center top"] - The background image position. Can be specified using CSS shorthand.
 * @returns {JSX.Element} ParallaxImage component.
 */
export default function ParallaxImage({
  url = "/images/swiss2.jpg",
  children,
  paddingTop = "100px",
  paddingBottom = "75px",
  bgPosition = "center top",
}) {
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundPosition: bgPosition,
        backgroundAttachment: "fixed",
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "block",
      }}
    >
      {children}
    </div>
  );
}
