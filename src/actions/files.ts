import { IFileTreeItem } from "@/components/file-tree";

export const openDirectory = () => {
  return window.electronAPI.files.openDirectory();
};

export const getFileList = (path: string): Promise<IFileTreeItem[]> => {
  return window.electronAPI.files.getFileList(path).then((result) => {
    console.log(result);
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
