"use client"

import Header from "@/components/header";
import Editor from "@/components/editor";
import { useCallback, useEffect, useReducer, useState } from "react";
import { CURRENT_OPEN_DIRECTORY_KEY, CURRENT_OPEN_FILE_PATH, FILE_LIST_BEFORE_CLOSE_KEY, OPENED_DIRECTORIES_KEY } from "@/const/storage";
import { IFileTreeItem } from "@/components/file-tree";

export interface IStore {
  currentDirectory: string;
  currentOpenFile: string;
  fileList: IFileTreeItem[];
}

const reducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case 'SET_CURRENT_DIRECTORY':
      return {
        ...state,
        currentDirectory: action.currentDirectory,
      }
    case 'SET_CURRENT_OPEN_FILE':
      return {
        ...state,
        currentOpenFile: action.currentOpenFile,
      }
    case 'SET_FILE_LIST':
      return {
        ...state,
        fileList: action.fileList,
      }
    default:
      return state;

  }
}

export default function Home() {

  const [defaultLayout, setDefaultLayout] = useState<[number, number, number, number]>([10, 37, 37, 16]);
  const [isReady, setIsReady] = useState(false);
  const [store, dispatch] = useReducer(reducer, {
    currentDirectory: '',
    currentOpenFile: '',
    fileList: [],
  } as IStore);

  const setCurrentDirectory = (directory: string) => {
    dispatch({ type: 'SET_CURRENT_DIRECTORY', currentDirectory: directory });
  }

  const setCurrentOpenFile = (file: string) => {
    dispatch({ type: 'SET_CURRENT_OPEN_FILE', currentOpenFile: file });
  }

  const setFileList = (fileList: IFileTreeItem[]) => {
    dispatch({ type: 'SET_FILE_LIST', fileList: fileList });
    saveOpenedDirectoryInfo(fileList);
  }

  const saveOpenedDirectoryInfo = useCallback((fileList: IFileTreeItem[]) => {
    localStorage.setItem(FILE_LIST_BEFORE_CLOSE_KEY, JSON.stringify(fileList));
  }, []);

  useEffect(() => {
    setCurrentDirectory(localStorage.getItem(CURRENT_OPEN_DIRECTORY_KEY) || '');
    setCurrentOpenFile(localStorage.getItem(CURRENT_OPEN_FILE_PATH) || '');
    setFileList(JSON.parse(localStorage.getItem(FILE_LIST_BEFORE_CLOSE_KEY) || '[]'));
    const defaultLayout = JSON.parse(localStorage.getItem('react-resizable-panels:layout') || '[10, 37, 37, 16]');
    setDefaultLayout(defaultLayout);
    setIsReady(true);
  }, []);

  const pageTitle = store.currentDirectory
    ? [
      store.currentOpenFile.split('/').pop(),
      store.currentDirectory
    ].join(' - ')
    : 'InnoTe Editor';

  return (
    isReady ? <main className="flex flex-col h-screen justify-center">
      <Header
        title={pageTitle}
        setCurrentDirectory={setCurrentDirectory}
      />
      <Editor
        defaultLayout={defaultLayout}
        fileList={store.fileList}
        currentOpenFile={store.currentOpenFile}
        currentDirectory={store.currentDirectory}
        setFileList={setFileList}
        setCurrentOpenFile={setCurrentOpenFile}
      />
    </main> : null
  );
}
