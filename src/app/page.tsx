"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import marked from '@/utils/marked';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Close, DifferenceSet, FullScreen, Minus, OpenDoor, SaveOne } from "@icon-park/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
export default function Home() {

  const [markedResult, setMarkedResult] = useState<string>('');
  const [toc, setTOC] = useState<string>('');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
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
    (window as any).electronAPI.app.isMaximized().then(res => {
      setIsMaximized(res);
    })

    return () => {
      textAreaRef.current?.removeEventListener('scroll', scrollHandler);
    }
  }, []);

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

  const handleHybridTest = async () => {
    console.log('handleHybridTest', (window as any).electronAPI);
    const filePath = await (window as any).electronAPI.openFile();
    console.log(filePath);
  }

  const handleOpenLocalFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.md';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement)?.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
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
    <main className="flex flex-col h-screen flex-row justify-center">


      {/* 暂定：test */}
      <div className={cn(
        'w-12 h-12 rounded-full',
        'fixed bottom-40 right-10 z-50 ',
        'bg-black'
      )}>
        <span onClick={handleHybridTest} className={cn(
          'w-12 h-12 rounded-full',
          'flex items-center justify-center',
          'cursor-pointer'
        )}>
          <OpenDoor theme="outline" size="24" fill="#ffffff" strokeWidth={3} />
        </span>
      </div>

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
          <OpenDoor theme="outline" size="24" fill="#ffffff" strokeWidth={3} />
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


      {/* 标题栏 */}
      <div
        className={cn(
          'flex items-center justify-between',
          'w-full  bg-white shadow-md',
          'select-none'
        )}
        style={{
          'WebkitAppRegion': 'drag',
        }}
      >
        <Menubar className="border-none w-1/3">
          <MenubarMenu >
            <MenubarTrigger style={{
              'WebkitAppRegion': 'no-drag',
            }}>文件</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>新建窗口</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>打开目录</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>退出</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger style={{
              'WebkitAppRegion': 'no-drag',
            }}>编辑</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                撤回 <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                重做 <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>剪切</MenubarItem>
              <MenubarItem>复制</MenubarItem>
              <MenubarItem>粘贴</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger style={{
              'WebkitAppRegion': 'no-drag',
            }}>设置</MenubarTrigger>
            <MenubarContent>
              <MenubarItem inset>首选项</MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>关于 InnoTe</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <span
          className={cn(
            'w-1/3 rounded-full',
            'flex items-center justify-center',
            'cursor-pointer',
          )}
        >
          Innote Editor
        </span>


        <ToggleGroup type="multiple" className="w-1/3 p-1">
          <ToggleGroupItem value="bold" aria-label="Toggle bold" className="ml-auto" style={{
            'WebkitAppRegion': 'no-drag',
          }}
            onClick={() => (window as any).electronAPI.app.minimize()}
          >
            <Minus theme="outline" size="20" fill="#000000" strokeWidth={3} />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic" style={{
            'WebkitAppRegion': 'no-drag',
          }}

            onClick={async () => isMaximized
              ? (window as any).electronAPI.app.unmaximize().then(() => setIsMaximized(false))
              : (window as any).electronAPI.app.maximize().then(() => setIsMaximized(true))
            }

          >
            {
              isMaximized
                ? <DifferenceSet theme="outline" size="20" fill="#000000" strokeWidth={3} />
                : <FullScreen theme="outline" size="20" fill="#000000" strokeWidth={3} />
            }

          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline" style={{
            'WebkitAppRegion': 'no-drag',
          }}
            onClick={() => (window as any).electronAPI.app.close()}

          >
            <Close theme="outline" size="20" fill="#000000" strokeWidth={3} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>


      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={42}>

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
                'px-8 py-4 box-border',
                'text-base text-[#263e7a] font-mono leading-7',
                'border-none shadow-none focus-visible:ring-0 focus-visible:shadow-none',
              )} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={42}>
          {/* 预览区 */}
          <div
            dangerouslySetInnerHTML={{ __html: markedResult }}
            key={markedResult}
            ref={markedResultRef}
            className={cn(
              'markdown-body',
              'flex-1 h-full max-h-full box-border',
              'overflow-auto',
              'px-8 pt-4 pb-24'
            )}>

          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={16}>
          {/* 目录 */}
          <div
            className={cn(
              'marked-toc',
              'pl-4 py-2 pr-16',
              'max-w-max max-h-max',
            )}
            dangerouslySetInnerHTML={{ __html: toc }}
          />

        </ResizablePanel>
      </ResizablePanelGroup>

    </main>
  );
}
