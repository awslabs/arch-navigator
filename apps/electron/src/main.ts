import path from "node:path";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { app, BrowserWindow, ipcMain, session } from "electron";

// Add common binary paths for credential_process (isengardcli, ada, etc.)
const commonPaths = ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"];
if (!process.env.PATH?.includes("/opt/homebrew/bin")) {
  process.env.PATH = [...commonPaths, process.env.PATH || ""].join(":");
}

// Declare Forge environment variables
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

function createWindow() {
  // Set CSP for Electron
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // TODO: Currently allowing remote resources (fonts.bunny.net, ka-f.fontawesome.com) for fonts and icons.
        // Should migrate to local assets by properly configuring Web Awesome base path and bundling fonts locally.
        "Content-Security-Policy": [
          "default-src 'self'; script-src 'self' 'unsafe-inline' blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.bunny.net; img-src 'self' data: https:; connect-src 'self' data: https://*.amazonaws.com https://fonts.bunny.net https://ka-f.fontawesome.com; font-src 'self' https://fonts.bunny.net; object-src 'none'; base-uri 'self'; form-action 'self';",
        ],
      },
    });
  });

  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    show: false,
    backgroundColor: "#0a1127",
    title: "arch-navigator",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Show window when ready to prevent white flash
  win.once("ready-to-show", () => {
    win.show();
  });

  if (
    typeof MAIN_WINDOW_VITE_DEV_SERVER_URL !== "undefined" &&
    MAIN_WINDOW_VITE_DEV_SERVER_URL
  ) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    const htmlPath = path.join(process.resourcesPath, "dist/index.html");
    console.log("Loading from:", htmlPath);
    win.loadFile(htmlPath).catch((err) => {
      console.error("Failed to load file:", err);
    });
  }
}

ipcMain.handle("get-aws-credentials", async (_event, profile?: string) => {
  try {
    const credentialProvider = defaultProvider({
      profile,
    });
    const credentials = await credentialProvider();
    return {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    };
  } catch (error) {
    console.error("Failed to load AWS credentials");
    throw new Error("Failed to load AWS credentials");
  }
});

app.setName("arch-navigator");

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
