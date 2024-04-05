export const openDirectory = () => {
  return window.electronAPI.openDirectory();
}

export const getFileList = (path: string): Promise<string[]> => {
  return window.electronAPI.getFileList(path);
}

export const getFileContent = (path: string): Promise<string> => {
  return window.electronAPI.getFileContent(path);
}

