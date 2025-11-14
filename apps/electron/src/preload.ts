import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getAwsCredentials: (profile?: string) =>
    ipcRenderer.invoke("get-aws-credentials", profile),
});
