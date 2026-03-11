type Props = {
  /** "color" = כחול+ירוק, "white" = לבן מלא (לרקע כהה) */
  variant?: "color" | "white";
  className?: string;
};

export function TelhaiLogo({ variant = "color", className = "" }: Props) {
  const isWhite = variant === "white";

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* סמל עלה */}
      <div className="relative flex-shrink-0" style={{ width: 28, height: 38 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isWhite ? "rgba(255,255,255,0.9)" : "#8DC63F",
            transform: "rotate(-15deg) scaleX(0.55)",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            background: isWhite ? "rgba(255,255,255,0.6)" : "#a8d861",
            width: "55%",
            height: "55%",
            top: "22%",
            left: "22%",
            transform: "rotate(-15deg) scaleX(0.55)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* טקסט */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: isWhite ? "#ffffff" : "#003D7A",
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
          }}
        >
          תל-חי
        </span>
        <span
          style={{
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 10,
            fontWeight: 400,
            color: isWhite ? "rgba(255,255,255,0.75)" : "#1a5a9e",
            lineHeight: 1.2,
          }}
        >
          המכללה האקדמית
        </span>
      </div>
    </div>
  );
}
