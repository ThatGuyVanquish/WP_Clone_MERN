export function ThumbsUpButton({ onClick, style }) {
  return (
    <button
      className="thumbs_up"
      style={{ border: "none", backgroundColor: "transparent", ...style }}
      onClick={onClick}
    />
  );
}

export default function Improve() {
  const showThanks = () => {
    document.querySelector(".thanks-for-help").style.display = "block";
    document.querySelector(".improve-us").style.display = "none";
  };

  return (
    <div
      className="lg: text-[11px] xl:text-[13px] font-[500]"
      style={{ marginLeft: 50, marginTop: 50 }}
    >
      <div className="improve-us" style={{ display: "flex" }}>
        <span>Help us improve:</span>
        <ThumbsUpButton onClick={showThanks} />
        <ThumbsUpButton
          onClick={showThanks}
          style={{ transform: "rotate(180deg)" }}
        />
      </div>
      <div className="thanks-for-help" style={{ display: "none" }}>
        Great, thanks!
      </div>
    </div>
  );
}
