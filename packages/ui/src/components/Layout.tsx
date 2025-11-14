import type { AppState, ResourceItem } from "@repo/api";
import clsx from "clsx";
import { createSignal, type JSX, Show } from "solid-js";
import "./Layout.css";
import { ResourceDetails } from "./ResourceDetails";
import { ResourceTree } from "./ResourceTree";

interface LayoutProps extends AppState {
  header?: JSX.Element;
  interstitial?: JSX.Element;
}

export function Layout(props: LayoutProps) {
  const [selectedResource, setSelectedResource] = createSignal<ResourceItem>();
  const OUTLINE_MIN_WIDTH = "240px";
  return (
    <div class={clsx("layout", "h-full")}>
      <div class={clsx("layout-header", "px-2", "py-1")}>{props.header}</div>
      <div class={clsx("layout-content")}>
        <Show when={!props.interstitial} fallback={props.interstitial}>
          <wa-split-panel
            class={clsx("p-2", "h-full")}
            position-in-pixels={400}
            style={{ "--min": OUTLINE_MIN_WIDTH }}
          >
            {/*TODO: iron out scrolling in these panels */}
            <div slot="start" class={clsx("overflow-scroll")}>
              <ResourceTree onSelect={setSelectedResource} {...props} />
            </div>
            <div slot="end" class={clsx("overflow-scroll")}>
              <ResourceDetails resource={selectedResource()} />
            </div>
          </wa-split-panel>
        </Show>
      </div>
    </div>
  );
}
