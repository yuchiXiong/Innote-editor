"use client"
import Header from "@/components/header";
import Editor from "@/components/editor";
import { ReducerWithoutAction, useReducer, useState } from "react";

export interface IStore {
  currentDirectory: string;
}

const reducer = (state: IStore, action: any): IStore => {
  console.log(action)
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

const initialState: IStore = {
  currentDirectory: '',
}

export default function Home() {

  const [store, dispatch] = useReducer(reducer, initialState);


  const setCurrentDirectory = (directory: string) => {
    dispatch({ type: 'SET_CURRENT_DIRECTORY', currentDirectory: directory });
  }

  return (
    <main className="flex flex-col h-screen justify-center">
      <Header
        title={[
          store.currentDirectory,
          'InnoTe'
        ].join(' - ')}
        setCurrentDirectory={setCurrentDirectory}
      />
      <Editor currentDirectory={store.currentDirectory} />
    </main>
  );
}
