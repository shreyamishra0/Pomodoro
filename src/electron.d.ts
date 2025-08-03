export interface ElectronAPI {
  closeApp: () => void;
   minimizeApp: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}