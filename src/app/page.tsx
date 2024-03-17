"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import marked from '@/utils/marked';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OpenDoor, SaveOne } from "@icon-park/react";

export default function Home() {

  const [markedResult, setMarkedResult] = useState<string>('');
  const [toc, setTOC] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const markedResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromLocal = localStorage.getItem('TEST_CONTENT') || '';
    const markedAsync = async () => {
      return await marked(fromLocal);
    };

    markedAsync().then(res => {
      setMarkedResult(res);
      generateToc();
    });

    if (textAreaRef.current) {
      textAreaRef.current.value = fromLocal;
    }
  }, []);

  useEffect(() => {
    textAreaRef.current?.addEventListener('scroll', scrollHandler);

    return () => {
      textAreaRef.current?.removeEventListener('scroll', scrollHandler);
    }
  })

  const scrollHandler = (e: Event) => {
    const scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
    const fullHeight = (e.target as HTMLTextAreaElement).scrollHeight;

    if (markedResultRef.current) {
      const markedResultHeight = markedResultRef.current.scrollHeight;
      markedResultRef.current.scrollTop = markedResultHeight * (scrollTop) / fullHeight;
    }
  }

  const handleInput = async (e: React.FormEvent<HTMLTextAreaElement>) => {
    const originContent = e.currentTarget.value;
    const _markedResult = await marked(originContent);
    setMarkedResult(_markedResult);
    generateToc();
    localStorage.setItem('TEST_CONTENT', originContent);
  }

  // 保存文件到本地
  const handleExportClick = () => {
    const fileName = 'test.md';
    const fileContent = textAreaRef.current?.value;
    const blob = new Blob([fileContent as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  const generateToc = async () => {
    const content = textAreaRef.current?.value;
    const toc = content?.split('\n').filter(i => i.startsWith('#')).join('\n') || '';
    const result = await marked(toc);
    const removeThreeLevel = result.split('\n').filter(i => {
      return i.startsWith('<h1') || i.startsWith('<h2') || i.startsWith('<h3');
    }).join('\n');
    setTOC(removeThreeLevel);
  }

  const handleOpenLocalFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target.result as string;
        textAreaRef.current!.value = content;
        const result = await marked(content)
        setMarkedResult(result);
        generateToc();
      }
      reader.readAsText(file);
      fileInput.remove();
    }
    fileInput.click();
  }

  return (
    <main className="flex h-screen flex-row justify-center">

      {/* 暂定：工具栏 */}
      <div className={cn(
        'w-12 h-12 rounded-full',
        'fixed bottom-24 right-10 z-50 ',
        'bg-black'
      )}>
        <span onClick={handleOpenLocalFile} className={cn(
          'w-12 h-12 rounded-full',
          'flex items-center justify-center',
          'cursor-pointer'
        )}>
          <OpenDoor theme="outline" size="24" fill="#ffffff" strokeWidth={3}/>
        </span>
      </div>

      {/* 暂定：工具栏 */}
      <div className={cn(
        'w-12 h-12 rounded-full',
        'fixed bottom-10 right-10 z-50 ',
        'bg-black'
      )}>
        {/* <DropdownMenu > */}
        {/* <DropdownMenuTrigger> */}
        <span onClick={handleExportClick} className={cn(
          'w-12 h-12 rounded-full',
          'flex items-center justify-center',
          'cursor-pointer'
        )}>
          <SaveOne theme="outline" size="24" fill="#ffffff" strokeWidth={3} />
        </span>
        {/* </DropdownMenuTrigger> */}
        {/* <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent> */}
        {/* </DropdownMenu> */}
      </div>
      {/* 编辑区 */}
      <div className={cn(
        'flex-1 h-full max-h-full',
        'overflow-auto',
        'border-r border-gray-200 border-solid'
      )}>
        <Textarea
          ref={textAreaRef}
          onInput={handleInput}
          className={cn(
            'w-full h-full',
            'border-none shadow-none focus-visible:ring-0 focus-visible:shadow-none',
          )} />
      </div>
      {/* 预览区 */}
      <div
        dangerouslySetInnerHTML={{ __html: markedResult }}
        ref={markedResultRef}
        className={cn(
          'marked',
          'flex-1 h-full max-h-full',
          'overflow-auto',
          'px-8 py-4'
        )}>

      </div>
      {/* 目录 */}
      <div
        className={cn(
          'marked-toc',
          'pl-4 py-2 pr-16',
          'max-w-max max-h-max',
        )}
        dangerouslySetInnerHTML={{ __html: toc }}
      />
    </main>
  );
}
