"use client"
import Header from "@/components/header";
import Editor from "@/components/editor";


export default function Home() {
  return (
    <main className="flex flex-col h-screen justify-center">
      <Header />
      <Editor />
    </main>
  );
}
