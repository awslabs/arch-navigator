import type { WaLazyLoadEvent } from "@awesome.me/webawesome";
import type { ResourceItem } from "@repo/api";
import {
  formatBarnIdentifier,
  formatBarnType,
  fromBarn,
  getRelated,
  toBarn,
} from "@repo/api";
import clsx from "clsx";
import { createSignal, For, Show } from "solid-js";
import "../index.css";
import "../webawesome";
import "./ResourceTreeItem.css";

interface ResourceTreeItemProps {
  item: ResourceItem;
  index: number;
  path?: string[];
}

export function ResourceTreeItem(props: ResourceTreeItemProps) {
  const [children, setChildren] = createSignal<ResourceItem[]>([]);
  const [isLazy, setIsLazy] = createSignal(true);

  const currentPath = () => [...(props.path || []), toBarn(props.item.barn)];

  const handleLazyLoad = async (e: WaLazyLoadEvent) => {
    e.stopPropagation();

    console.log("lazy load", toBarn(props.item.barn), "path:", currentPath());
    const related = await getRelated(props.item.barn);
    console.log("related count:", related.length);

    // Filter out any BARNs already in the path to prevent cycles
    const pathBarns = (props.path || [])
      .map(fromBarn)
      .concat([props.item.barn]);
    const filtered = related.filter(
      (barn) =>
        !pathBarns.some(
          (pathBarn) =>
            pathBarn.type === barn.type &&
            normalizeIdentifier(pathBarn.identifier) ===
              normalizeIdentifier(barn.identifier),
        ),
    );
    console.log("filtered count:", filtered.length);

    setChildren(filtered.map((barn) => ({ barn, details: {} })));
    setIsLazy(false);
  };

  // Normalize CloudFormation stack identifiers to just the stack name
  const normalizeIdentifier = (id: string) => {
    if (id.startsWith("arn:aws:cloudformation:")) {
      const parts = id.split("/");
      return parts[parts.length - 2]; // Stack name is second to last
    }
    return id;
  };

  return (
    <wa-tree-item
      class={clsx("barn-list-tree-item")}
      lazy={isLazy()}
      onWa-lazy-load={handleLazyLoad}
    >
      <div
        class={clsx("barn-list-item", "flex", "flex-col", "py-2")}
        data-barn={toBarn(props.item.barn)}
        data-path={JSON.stringify(currentPath())}
      >
        <div class={clsx("font-bold")}>
          {formatBarnIdentifier(props.item.barn)}
        </div>
        <div class={clsx("text-sm", "text-(--wa-color-text-subtle)")}>
          {formatBarnType(props.item.barn.type)}
        </div>
      </div>
      <Show when={children().length > 0}>
        <For each={children()}>
          {(child, childIndex) => (
            <ResourceTreeItem
              item={child}
              index={childIndex()}
              path={currentPath()}
            />
          )}
        </For>
      </Show>
    </wa-tree-item>
  );
}
