import { IFileTreeItem } from "@/components/file-tree";

export const openDirectory = () => {
  return window.electronAPI.openDirectory();
};

export const getFileList = (path: string): Promise<IFileTreeItem[]> => {
  return window.electronAPI
    .getFileList(encodeURIComponent(path))
    .then((result) => {
      return result.map((file) => ({
        id: file,
        name: file,
        isSelectable: true,
        isDirectory: !file.endsWith(".md"),
        path,
        children: [],
      }));
    });
};

export const getFileContent = (path: string): Promise<string> => {
  return window.electronAPI.getFileContent(encodeURIComponent(path));
};
