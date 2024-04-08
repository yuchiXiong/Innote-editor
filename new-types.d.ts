export interface IElectronAPI {
  versions: {
    node: () => string;
    chrome: () => string;
    electron: () => string;
  };
  app: {
    close: () => Promise<void>;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    unMaximize: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
    onMaximized: (callback: () => void) => void;
    onUnMaximized: (callback: () => void) => void;
  };
  files: {
    openDirectory: () => Promise<string>;
    getFileList: (path: string) => Promise<
      {
        fileName: string;
        isDirectory: boolean;
        children: { fileName: string; isDirectory: boolean; children: [] }[];
      }[]
    >;
    getFileContent: (path: string) => Promise<string>;
    saveFileContent: (path: string, content: string) => Promise<void>;
    pathJoin: (paths: string[]) => string;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
