import { CornerUpRight } from "lucide-solid";
import type { JSX } from "solid-js";

export const SymlinkIcon = (props: { primaryIcon: JSX.Element }) => {
  const { primaryIcon } = props;

  return (
    <div style={{ position: "relative" }}>
      <div class={"primary-icon"}>{primaryIcon}</div>
      <div
        class={"symlink-annotation"}
        style={{
          position: "absolute",
          "background-color": "hsla(var(--background))",
          bottom: "-2px",
          left: "-4px",
          padding: "1px",
          "border-radius": "4px",
        }}
      >
        <CornerUpRight {...{ size: "10px", strokeWidth: "4px" }} />
      </div>
    </div>
  );
};
