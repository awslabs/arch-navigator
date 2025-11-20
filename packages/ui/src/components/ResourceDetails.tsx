import type { ResourceItem } from "@repo/api";
import { formatBarnIdentifier, formatBarnType, getDetails } from "@repo/api";
import clsx from "clsx";
import { createResource, createSignal, For, Show } from "solid-js";
import "../index.css";
import "../webawesome";

interface ResourceDetailsProps {
  resource?: ResourceItem;
}

export function ResourceDetails(props: ResourceDetailsProps) {
  const [filter, setFilter] = createSignal("");

  const [details] = createResource(
    () => {
      console.log("Source tracking:", props.resource?.barn.identifier);
      return props.resource?.barn.identifier;
    },
    async () => {
      const barn = props.resource?.barn;
      console.log("Fetching details for:", barn?.identifier);
      if (!barn) return null;
      try {
        return await getDetails(barn);
      } catch (error) {
        console.error("Failed to fetch details:", error);
        return {
          Error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  );

  const entries = () => {
    const data = details();
    if (!data) return [];
    const filterText = filter().toLowerCase();
    return Object.entries(data)
      .filter(([_, value]) => value !== null && value !== undefined)
      .filter(([key, value]) => {
        if (!filterText) return true;
        const keyMatch = key.toLowerCase().includes(filterText);
        const valueStr =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        const valueMatch = valueStr.toLowerCase().includes(filterText);
        return keyMatch || valueMatch;
      });
  };

  const highlight = (text: string) => {
    const filterText = filter();
    if (!filterText) return text;

    const regex = new RegExp(
      `(${filterText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    const parts = text.split(regex);

    return parts.map((part, _i) =>
      regex.test(part) ? (
        <mark
          class={clsx(
            "bg-(--wa-color-brand-fill-normal)",
            "text-(--wa-color-text-normal)",
            "wa-dark:bg-blue-700",
            "font-bold",
          )}
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div class={clsx("resource-details", "flex", "flex-col", "gap-4", "p-4")}>
      <Show when={props.resource} fallback={<div>Select a resource</div>}>
        <div class={clsx("flex", "flex-col", "gap-2", "border-b", "pb-4")}>
          <div class={clsx("flex", "gap-2", "items-start")}>
            <wa-icon
              class={clsx("text-2xl", "top-1", "relative")}
              name="cube"
            ></wa-icon>
            <div class={clsx("text-2xl", "font-bold")}>
              {formatBarnIdentifier(props.resource!.barn)}
            </div>
          </div>
          <div class={clsx("text-sm", "text-(--wa-color-text-subtle)")}>
            {formatBarnType(props.resource!.barn.type)}
          </div>
          <Show when={props.resource!.barn.arn}>
            <div
              class={clsx(
                "text-xs",
                "text-(--wa-color-text-subtle)",
                "font-mono",
              )}
            >
              {props.resource!.barn.arn}
            </div>
          </Show>
        </div>

        <wa-input
          placeholder="Filter fields..."
          size="small"
          value={filter()}
          onInput={(e: InputEvent) =>
            setFilter((e.target as HTMLInputElement).value)
          }
        />

        <Show when={details.loading}>
          <wa-spinner></wa-spinner>
        </Show>

        <Show when={!details.loading && entries().length > 0}>
          <div class={clsx("columns-1", "lg:columns-2", "gap-4")}>
            <For each={entries()}>
              {([key, value]) => {
                const isObject = typeof value === "object";
                const stringValue = isObject
                  ? JSON.stringify(value, null, 2)
                  : String(value);
                const isLong = stringValue.length > 200;

                return (
                  <div
                    class={clsx(
                      "flex",
                      "flex-col",
                      "rounded",
                      "mb-4",
                      "break-inside-avoid",
                      "max-h-[400px]",
                      "bg-(--wa-color-surface-default)",
                    )}
                  >
                    <div
                      class={clsx(
                        "text-sm",
                        "font-semibold",
                        "text-(--wa-color-text-subtle)",
                        "p-1",
                        // "border-b",
                        "sticky",
                        "top-0",
                        "bg-(--wa-color-surface-default)",
                      )}
                    >
                      {highlight(key)}
                    </div>
                    <div class={clsx("overflow-y-auto")}>
                      <Show
                        when={isLong}
                        fallback={
                          <div
                            class={clsx("text-sm", "font-mono", "break-all")}
                          >
                            {highlight(stringValue)}
                          </div>
                        }
                      >
                        <details
                          class={clsx(
                            "text-sm",
                            "font-mono",
                            "[&[open]>summary]:bg-(--wa-color-neutral-fill-quiet)",
                            "[&[open]>summary]:border-b",
                            "[&[open]>summary]:border-b-(--wa-color-text-quiet)",
                            "[[open]]:bg-(--wa-color-neutral-fill-quiet)",
                          )}
                        >
                          <summary
                            class={clsx(
                              "cursor-pointer",
                              "text-(--wa-color-text-subtle)",
                              "hover:text-(--wa-color-text-normal)",
                              "sticky",
                              "top-0",
                              "p-1",
                            )}
                          >
                            View {isObject ? "JSON" : "content"} (
                            {stringValue.length} characters)
                          </summary>
                          <div
                            class={clsx(
                              "break-all",
                              "whitespace-pre-wrap",
                              "p-2",
                            )}
                          >
                            {highlight(stringValue)}
                          </div>
                        </details>
                      </Show>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
