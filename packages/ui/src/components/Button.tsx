import clsx from "clsx";
import { type JSX, splitProps } from "solid-js";
import "../index.css";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
}

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["children", "class"]);

  return (
    <button
      class={clsx(
        "px-4",
        "py-2",
        "bg-(--wa-color-yellow-80)",
        "text-gray-600",
        "rounded-lg",
        "cursor-pointer",
        "transition-colors",
        `${local.class || ""}`,
      )}
      {...others}
    >
      {local.children}
    </button>
  );
}
