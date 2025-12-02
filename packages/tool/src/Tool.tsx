import {
  type AppState,
  type AWSCredentials,
  type Barn,
  getDetails,
  getRelated,
  initializeApi,
  isElectron,
  listResources,
  loadElectronCredentials,
} from "@repo/api";
import "@repo/ui";
import { Layout } from "@repo/ui/components/Layout";
import clsx from "clsx";
import { Moon, Sun } from "lucide-solid";
import { createResource, createSignal, onMount, Show, untrack } from "solid-js";
import { CredentialsForm } from "./CredentialsForm";
import "./Tool.css";

const appName = "arch-navigator";

interface ToolProps {
  credentials?: AWSCredentials;
}

export default function Tool(props: ToolProps) {
  const [credentials, setCredentials] = createSignal<
    AWSCredentials | null | undefined
  >(props.credentials || null);
  const [loading, setLoading] = createSignal(isElectron() && !credentials());
  const [showCredentials, setShowCredentials] = createSignal(false);
  const [darkMode, setDarkMode] = createSignal(true);
  const [credInfo, setCredInfo] = createSignal<string>("");

  const handleLogin = (creds: AWSCredentials) => {
    setCredentials(creds);
  };

  onMount(async () => {
    document.documentElement.classList.add(
      "wa-theme-awesome",
      "wa-palette-bright",
      "wa-brand-yellow",
    );

    // Auto-load credentials in Electron
    if (isElectron() && !credentials()) {
      try {
        const creds = await loadElectronCredentials();
        handleLogin(creds);
      } catch (error) {
        console.error("Failed to load Electron credentials:", error);
      } finally {
        setLoading(false);
      }
    }
  });

  const reset = async () => {
    setCredentials(null);

    // Auto-reload credentials in Electron
    if (isElectron()) {
      setLoading(true);
      try {
        const creds = await loadElectronCredentials();
        handleLogin(creds);
      } catch (error) {
        console.error("Failed to reload Electron credentials:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const [resources] = createResource(
    () => credentials(),
    async (creds) => {
      if (!creds) return [];

      // Reload fresh credentials from AWS CLI in Electron
      let activeCreds = creds;
      if (isElectron()) {
        try {
          activeCreds = await loadElectronCredentials();
          setCredInfo(`CLI: ${activeCreds.accessKeyId.slice(0, 12)}...`);
        } catch (error) {
          console.error("Failed to reload credentials:", error);
        }
      }

      initializeApi({ credentials: activeCreds });

      try {
        const barns = await listResources({
          types: ["AWS::CloudFormation::Stack"],
        });
        return Promise.all(
          barns.map(async (barn: Barn) => ({
            barn,
            details: await getDetails(barn),
          })),
        );
      } catch (error) {
        console.error("failed to list resourced", error);
        untrack(() => {
          setCredentials(null);
        });
        return [];
      }
    },
  );

  const state: AppState = {
    resources,
    getRelated,
    loading,
  };

  const shadowSizeMultiplier = 88 / 82;
  const appFontSize = 52;
  const appFontShadowSize = Math.round(appFontSize * shadowSizeMultiplier);

  const header = (
    <div class={clsx("flex", "items-center", "justify-between")}>
      <div
        class={clsx(
          "text-(--wa-color-brand-70)",
          "font-bold",
          "px-4",
          "py-0",
          "flex",
          "items-center",
          "gap-4",
          "select-none",
        )}
        style={{ "font-size": `${appFontSize}px` }}
      >
        <div class={clsx("relative", "whitespace-nowrap")}>
          <code
            class={clsx(
              "bg-transparent",
              "text-(--wa-color-neutral-border-loud)",
            )}
            style={{
              "font-size": `${appFontShadowSize}px`,
              left: "-1px",
              "letter-spacing": "-2.4px",
            }}
          >
            {appName}
            {credentials() && "*"}
          </code>
          <code
            class={clsx(
              "bg-transparent",
              "text-(--wa-color-brand-70)",
              "absolute",
            )}
            style={{
              left: "1px",
              top: "2px",
            }}
          >
            {appName}
            {credentials() && (
              <wa-popup placement="right-start" active={showCredentials()}>
                <span
                  class={clsx("absolute", "cursor-pointer")}
                  slot="anchor"
                  onClick={() => setShowCredentials(!showCredentials())}
                >
                  *
                </span>

                <div
                  class={clsx(
                    "p-4",
                    "bg-(--wa-color-brand-fill-normal)",
                    "text-(--wa-color-text-normal)",
                    "text-sm",
                    "font-mono",
                  )}
                >
                  <div>
                    <Show when={credInfo()}>
                      <p class="text-green-400 mb-2">✓ {credInfo()}</p>
                    </Show>
                    <p>AccessKeyId: {credentials()?.accessKeyId}</p>
                    <p>
                      SecretAccessKey:{" "}
                      {credentials()?.secretAccessKey?.slice(0, 10)}...
                    </p>
                    <p>
                      SessionToken: {credentials()?.accessKeyId?.slice(0, 10)}
                      ...
                    </p>
                  </div>
                </div>
              </wa-popup>
            )}
          </code>
        </div>
      </div>
      <div class={clsx("px-2", "py-2", "flex", "gap-2")}>
        {/* <wa-button */}
        {/*   variant="brand" */}
        {/*   onMouseDown={startAdding} */}
        {/*   onMouseUp={stopAdding} */}
        {/*   onMouseLeave={stopAdding} */}
        {/* > */}
        {/*   Add */}
        {/* </wa-button> */}
        <wa-button appearance="outlined" onClick={reset}>
          Reset
        </wa-button>
        <wa-button
          appearance="outlined"
          onClick={() => setDarkMode(!darkMode())}
        >
          {darkMode() ? <Sun /> : <Moon />}
        </wa-button>
      </div>
    </div>
  );

  return (
    <div
      class={clsx(
        "tool",
        "min-h-screen",
        "bg-(--wa-color-surface-default)",
        "text-(--wa-color-text-normal)",
        darkMode() ? "wa-dark" : "wa-light",
        "wa-theme-awesome",
        "wa-palette-bright",
        "wa-brand-yellow",
      )}
    >
      <div class={clsx("h-full")}>
        <Layout
          header={header}
          interstitial={
            !credentials() && (
              <CredentialsForm onLogin={handleLogin} loading={loading()} />
            )
          }
          {...state}
        />
        {/* TODO: reactivate these */}
        {/* <div class={clsx("app-counter", "text-6xl", "my-12")}> */}
        {/* {count() > 0 && <span> {"🍌".repeat(count())}</span>} */}
        {/* </div> */}
      </div>
    </div>
  );
}
