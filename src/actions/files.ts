import { IFileTreeItem } from "@/components/file-tree";

export const openDirectory = () => {
  return window.electronAPI.files.openDirectory();
};

export const getFileList = (path: string): Promise<IFileTreeItem[]> => {
  return window.electronAPI.files.getFileList(path).then((result) => {
    return result.map((file) => ({
      id: file.fileName,
      name: file.fileName,
      isSelectable: true,
      isDirectory: file.isDirectory,
      path,
      children: file.children.map((child) => ({
        id: child.fileName,
        name: child.fileName,
        isSelectable: true,
        isDirectory: child.isDirectory,
        path: pathJoin([path, child.fileName]),
        children: [],
      })),
    }));
  });
};

export const getFileContent = (path: string): Promise<string> => {
  return window.electronAPI.files.getFileContent(path);
};

export const saveFileContent = (
  path: string,
  content: string
): Promise<void> => {
  return window.electronAPI.files.saveFileContent(path, content);
};

export const pathJoin = (paths: string[]): string => {
  return window.electronAPI.files.pathJoin(paths);
};
