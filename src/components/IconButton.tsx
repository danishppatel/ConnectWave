import React from "react";

interface IconButtonProps {
  icon: string;
  onClick: () => void;
  ariaLabel: string;
  style?: React.CSSProperties;
  size?: number;
  color?: string;
}
const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  ariaLabel,
  style = {},
  size = 24,
  color,
}) => {
  return (
    <div
      style={{
        background: `${color}`,
        borderRadius: "3px",
        boxShadow: "initial",
        height: "32px",
        width: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        style={{
          background: "none",
          border: "none",
          padding: "5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          ...style,
        }}
      >
        <img src={icon} alt={ariaLabel} style={{ width: size, height: size }} />
      </button>
    </div>
  );
};

export default IconButton;
