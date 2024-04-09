"use client"

import Header from "@/components/header";
import Editor from "@/components/editor";
import { ReducerWithoutAction, useEffect, useReducer, useState } from "react";
import { CURRENT_OPEN_DIRECTORY_KEY } from "@/const/storage";
import { app, versions } from '@/actions';

export interface IStore {
  currentDirectory: string;
  currentOpenFile: string;
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
  } as IStore);

  const setCurrentDirectory = (directory: string) => {
    dispatch({ type: 'SET_CURRENT_DIRECTORY', currentDirectory: directory });
  }

  const setCurrentOpenFile = (file: string) => {
    dispatch({ type: 'SET_CURRENT_OPEN_FILE', currentOpenFile: file });
  }

  useEffect(() => {
    setCurrentDirectory(localStorage.getItem(CURRENT_OPEN_DIRECTORY_KEY) || '');
    const defaultLayout = JSON.parse(localStorage.getItem('react-resizable-panels:layout') || '[10, 37, 37, 16]');
    setDefaultLayout(defaultLayout);
    setIsReady(true);
  }, []);

  const pageTitle = store.currentDirectory
    ? [
      store.currentOpenFile.split('/').pop(),
      store.currentDirectory
    ].join(' - ')
    : 'InnoTe Editor'

  return (
    isReady ? <main className="flex flex-col h-screen justify-center">
      <Header
        title={pageTitle}
        setCurrentDirectory={setCurrentDirectory}
      />
      <Editor
        defaultLayout={defaultLayout}
        currentOpenFile={store.currentOpenFile}
        currentDirectory={store.currentDirectory}
        setCurrentOpenFile={setCurrentOpenFile}
      />
    </main> : null
  );
}
