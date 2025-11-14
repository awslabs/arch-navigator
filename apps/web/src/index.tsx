import Tool from "@repo/tool";
import { render } from "solid-js/web";

const root = document.getElementById("root");
if (root) {
  render(() => <Tool />, root);
}
