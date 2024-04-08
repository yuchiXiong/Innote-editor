"use client"

import Header from "@/components/header";
import Editor from "@/components/editor";
import { ReducerWithoutAction, useEffect, useReducer, useState } from "react";
import { CURRENT_OPEN_DIRECTORY_KEY } from "@/const/storage";

export interface IStore {
  currentDirectory: string;
}

const reducer = (state: IStore, action: any): IStore => {
  switch (action.type) {
    case 'SET_CURRENT_DIRECTORY':
      return {
        ...state,
        currentDirectory: action.currentDirectory,
      }
    default:
      return state;

  }
}

export default function Home() {

  const [defaultLayout, setDefaultLayout] = useState<[number, number, number, number]>([10, 37, 37, 16]);
  const [isReady, setIsReady] = useState(false);
  const [store, dispatch] = useReducer(reducer, {
    currentDirectory: ''
  } as IStore);


  const setCurrentDirectory = (directory: string) => {
    dispatch({ type: 'SET_CURRENT_DIRECTORY', currentDirectory: directory });
  }

  useEffect(() => {
    setCurrentDirectory(localStorage.getItem(CURRENT_OPEN_DIRECTORY_KEY) || '');
    const defaultLayout = JSON.parse(localStorage.getItem('react-resizable-panels:layout') || '[10, 37, 37, 16]');
    setDefaultLayout(defaultLayout);
    setIsReady(true);
  }, []);

  return (
    isReady ? <main className="flex flex-col h-screen justify-center">
      <Header
        title={[
          store.currentDirectory,
          'InnoTe'
        ].join(' - ')}
        setCurrentDirectory={setCurrentDirectory}
      />
      <Editor
        defaultLayout={defaultLayout}
        currentDirectory={store.currentDirectory}
      />
    </main> : null
  );
}
