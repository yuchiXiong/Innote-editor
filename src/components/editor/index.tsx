"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea";
import FileTree, { IFileTreeItem } from '@/components/file-tree';
import { useEffect, useRef, useState } from "react";
import marked from '@/utils/marked';
import { cn } from "@/lib/utils";
import { files } from "@/actions";

export interface IEditorProps {
  currentDirectory: string;
}

const Editor = (props: IEditorProps) => {


  const [fileList, setFileList] = useState<IFileTreeItem[]>([]);
  const [markedResult, setMarkedResult] = useState<string>('');
  const [toc, setTOC] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const markedResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    files.getFileList(props.currentDirectory).then(res => {
      setFileList(res);
      console.log(res);
    })
  }, [props.currentDirectory])

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


  const generateToc = async () => {
    const content = textAreaRef.current?.value;
    const toc = content?.split('\n').filter(i => i.startsWith('#')).join('\n') || '';
    const result = await marked(toc);
    const removeThreeLevel = result.split('\n').filter(i => {
      return i.startsWith('<h1') || i.startsWith('<h2') || i.startsWith('<h3');
    }).join('\n');
    setTOC(removeThreeLevel);
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={10}>
        <div className={cn(
          'flex-1 h-full max-h-full',
          'overflow-auto',
          'border-r border-gray-200 border-solid'
        )}>
          <FileTree
            treeData={fileList}
            reFresh={() => {
              setFileList([...fileList]);
            }}
          />

        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={37}>

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
      <ResizablePanel defaultSize={37}>
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
  )
}

export default Editor;