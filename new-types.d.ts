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
  };
  files: {
    openDirectory: () => Promise<string>;
    getFileList: (path: string) => Promise<string[]>;
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
