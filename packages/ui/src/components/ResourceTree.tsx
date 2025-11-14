import type { WaSelectionChangeEvent } from "@awesome.me/webawesome";
import type { AppState, ResourceDetails, ResourceItem } from "@repo/api";
import { fromBarn } from "@repo/api";
import clsx from "clsx";
import { For, Show } from "solid-js";
import "../index.css";
import "../webawesome";
import { ResourceTreeItem } from "./ResourceTreeItem";

interface ResourceTreeProps extends AppState {
  title?: string;
  onSelect?: (resource: ResourceItem) => void;
}

export function ResourceTree(props: ResourceTreeProps) {
  const { title } = props;

  const handleSelectionChange = (e: WaSelectionChangeEvent) => {
    if (!props.onSelect) return;

    const selectedItem = e.detail?.selection[0];
    if (selectedItem) {
      const barnElement =
        selectedItem.getElementsByClassName("barn-list-item")[0];
      const barnStr = barnElement?.getAttribute("data-barn");

      if (barnStr) {
        const barn = fromBarn(barnStr);
        const details: ResourceDetails = {};
        props.onSelect({ barn, details });
      }
    }
  };

  return (
    <div class={clsx("resource-tree", "flex", "flex-col", "gap-4", "p-4")}>
      <Show when={title}>
        <div class={clsx("title", "flex", "gap-2", "items-center", "text-4xl")}>
          <wa-icon name="bars-staggered"></wa-icon>
          <div class={clsx("text-4xl", "font-bold")}>{title}</div>
        </div>
      </Show>
      <Show when={props.resources()} fallback={<div>Loading...</div>}>
        <wa-tree
          selection="single"
          onWa-selection-change={handleSelectionChange}
        >
          <For each={props.resources()}>
            {(item, index) => <ResourceTreeItem item={item} index={index()} />}
          </For>
        </wa-tree>
      </Show>
    </div>
  );
}
