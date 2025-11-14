import type { AWSCredentials } from "@arch-navigator/api";
import clsx from "clsx";
import { createSignal, onCleanup, onMount, Show } from "solid-js";

interface CredentialsFormProps {
  onLogin: (creds: AWSCredentials) => void;
  loading: boolean;
}

export function CredentialsForm(props: CredentialsFormProps) {
  const [input, setInput] = createSignal("");

  onMount(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        try {
          const text = await navigator.clipboard.readText();
          if (text) handleInput(text);
        } catch {
          // Clipboard access denied
        }
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text");
      if (text) handleInput(text);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    });
  });

  const handleInput = (value: string) => {
    try {
      const json = JSON.parse(value);
      if (
        json.AccessKeyId &&
        json.SecretAccessKey &&
        typeof json.AccessKeyId === "string" &&
        typeof json.SecretAccessKey === "string"
      ) {
        setInput(value);
        props.onLogin({
          accessKeyId: json.AccessKeyId,
          secretAccessKey: json.SecretAccessKey,
          sessionToken: json.SessionToken,
        });
      }
    } catch {
      // Invalid JSON, don't update textarea
    }
  };

  return (
    <Show
      when={!props.loading}
      fallback={
        <div class={clsx("p-4", "w-full", "flex", "justify-center")}>
          <div class={clsx("flex", "flex-col", "gap-2", "w-[400px]")}>
            <div class={clsx("flex", "justify-center")}>
              <em>Loading AWS credentials...</em>
            </div>
            <div>
              <wa-progress-bar indeterminate></wa-progress-bar>
            </div>
          </div>
        </div>
      }
    >
      <div
        class={clsx(
          "p-4",
          "max-w-prose",
          "my-10",
          "mx-auto",
          "flex",
          "flex-col",
          "gap-4",
        )}
      >
        <div>
          <div class={clsx("flex", "flex-row", "justify-between", "gap-2")}>
            <h2>AWS Credentials</h2>
            <small class={clsx("text-(--wa-color-text-quiet)")}>
              Copy credentials JSON to clipboard, then press Enter.
            </small>
          </div>
          <wa-textarea
            value={input()}
            onInput={(e: unknown) => {
              const target = (e as { currentTarget?: { value?: string } })
                .currentTarget;
              if (target?.value) handleInput(target.value);
            }}
            placeholder="...or paste credentials JSON here."
          />
        </div>
        <div
          class={clsx(
            "text-(--wa-color-text-quiet)",
            "hover:text-(--wa-color-text-loud)",
            "opacity-60",
            "hover:opacity-100",
            "transition-all",
          )}
        >
          <h2>Expected format</h2>
          <pre class="p-4">
            {`
{
  "AccessKeyId": "ASIA...",
  "SecretAccessKey": "XYZ...",
  "SessionToken": "123...",
}
`}
          </pre>
        </div>
      </div>
    </Show>
  );
}
