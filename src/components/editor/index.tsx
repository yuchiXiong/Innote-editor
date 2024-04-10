"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Textarea } from "@/components/ui/textarea";
import FileTree, { IFileTreeItem } from '@/components/file-tree';
import { useCallback, useEffect, useRef, useState } from "react";
import marked from '@/utils/marked';
import { cn } from "@/lib/utils";
import { files } from "@/actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useDebounce } from 'react-use';
import { CURRENT_OPEN_FILE_PATH } from "@/const/storage";
import { toast } from "sonner";
import md5 from "md5";

export interface IEditorProps {
  currentOpenFile: string;
  currentDirectory: string;
  defaultLayout: [number, number, number, number];
  setCurrentOpenFile: (filePath: string) => void;
}

const Editor = (props: IEditorProps) => {

  const {
    defaultLayout,
    currentOpenFile,
    setCurrentOpenFile
  } = props;

  const [fileList, setFileList] = useState<IFileTreeItem[]>([]);
  const [markedResult, setMarkedResult] = useState<string>('');
  const [toc, setTOC] = useState<string>('');
  const [debounceFnFlag, setDebounceFnFlag] = useState<number>(0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const markedResultRef = useRef<HTMLDivElement>(null);

  useDebounce(() => {
    if (debounceFnFlag === 0) return;
    const content = textAreaRef.current?.value || '';
    files.saveFileContent(currentOpenFile, content);
  }, 200, [debounceFnFlag]);

  const debounceSaveFileContent = useCallback(() => {
    setDebounceFnFlag(debounceFnFlag => debounceFnFlag + 1);
  }, []);

  useEffect(() => {
    files.getFileList(props.currentDirectory).then(res => {
      setFileList(res);
    })
  }, [props.currentDirectory])

  const updateEditor = useCallback((filePath: string, fileContent: string) => {
    const markedAsync = async () => {
      return await marked(fileContent);
    };

    markedAsync().then(res => {
      setMarkedResult(res);
      generateToc();
    });
    setCurrentOpenFile(filePath);
    if (textAreaRef.current) {
      textAreaRef.current.value = fileContent;
      textAreaRef.current.scrollTop = 0;
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [debounceSaveFileContent])

  useEffect(() => {
    if (currentOpenFile) {
      files.getFileContent(currentOpenFile).then(res => {
        updateEditor(currentOpenFile, res);
      })
    }
  }, [currentOpenFile, updateEditor]);


  useEffect(() => {
    setCurrentOpenFile(localStorage.getItem(CURRENT_OPEN_FILE_PATH) || '');
    window.addEventListener("keydown", handleSaveTips);

    return () => {
      window.removeEventListener("keydown", handleSaveTips);
    }
  }, []);

  const handleSaveTips = (e: KeyboardEvent) => {
    const isWindows = navigator.platform.startsWith('Win');
    const isMac = navigator.platform.startsWith('Mac');

    const isSave = (isWindows && e.key === 's' && e.ctrlKey) || (isMac && e.key === 's' && e.metaKey);

    if (isSave) {
      e.preventDefault();
      debounceSaveFileContent();
      toast("别担心！", {
        description: "InnoTe 会自动保存你的文件哦！",
      })
    }
  }

  const handleInput = async (e: React.FormEvent<HTMLTextAreaElement>) => {
    const originContent = e.currentTarget.value;
    debounceSaveFileContent();
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
    const _markedResult = await marked(originContent);
    setMarkedResult(_markedResult);
    generateToc();
    // localStorage.setItem('TEST_CONTENT', originContent);
  }

  const generateToc = async (): Promise<void> => {
    const content = textAreaRef.current?.value || '';
    const result = await marked(content);
    const removeThreeLevel = result.split('\n').filter(i => {
      return i.startsWith('<h1') || i.startsWith('<h2') || i.startsWith('<h3')
    }).map(heading => {
      if (heading.startsWith('<h1') || heading.startsWith('<h2')) return heading;

      const defaultStyle = 'pl-2 border-l-4 border-white border-solid';
      const hoverStyle = 'hover:bg-[#5a67d820] hover:border-[#5a67d8]';
      const style = `${defaultStyle} ${hoverStyle}`;

      const headingWithHover = heading.replace('<h3 ', `<h3 class="${style}" `)
      return headingWithHover;
    }).join('\n');
    setTOC(removeThreeLevel);
  }

  const handleTocClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const previewTarget = document.querySelector(`#${target.id}`);

    previewTarget?.classList.add('bg-[#5a67d880]');
    previewTarget?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      previewTarget?.classList.remove('bg-[#5a67d880]');
    }, 500);
  }

  const onLayout = (sizes: number[]) => {
    if (!currentOpenFile.endsWith('.md')) return;

    const key = 'react-resizable-panels:layout';
    const value = JSON.stringify(sizes);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
    localStorage.setItem(key, value);
  };

  return (
    <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
      <ResizablePanel defaultSize={defaultLayout[0]}>
        <div className={cn(
          'flex-1 h-full max-h-full',
          'overflow-auto',
        )}>
          <FileTree
            treeData={fileList}
            reFresh={() => {
              setFileList([...fileList]);
            }}
            afterFileOpen={updateEditor}
          />

        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      {
        currentOpenFile.endsWith('.md') ? (
          <>
            <ResizablePanel defaultSize={defaultLayout[1]}>
              {/* 编辑区 */}
              <ScrollArea className="w-full h-full">
                <Textarea
                  ref={textAreaRef}
                  onInput={handleInput}
                  spellCheck={false}
                  key={currentOpenFile}
                  className={cn(
                    'w-full min-h-screen',
                    'px-8 py-4 box-border',
                    'text-base text-[#263e7a] font-mono leading-7',
                    'border-none shadow-none focus-visible:ring-0 focus-visible:shadow-none',
                    "resize-none",
                    "input-textarea",
                  )}
                />
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[2]}>
              {/* 预览区 */}
              <ScrollArea
                className={cn(
                  "w-full h-full",
                  "preview-area-container"
                )}>
                <div
                  dangerouslySetInnerHTML={{ __html: markedResult }}
                  key={markedResult}
                  ref={markedResultRef}
                  className={cn(
                    'markdown-body',
                    'w-full h-full box-border',
                    'px-8 pt-4 pb-24'
                  )} />
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[3]}>
              {/* 目录 */}
              <div
                className={cn(
                  'marked-toc',
                  'py-2 px-4',
                  'max-w-max max-h-max',
                )}
                dangerouslySetInnerHTML={{ __html: toc }}
                onClick={handleTocClick}
              />

            </ResizablePanel>
          </>
        ) : (
          <ResizablePanel>
            <section className="text-gray-600 body-font">
              <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
                <img className="mb-10 object-cover object-center rounded" alt="Logo" src="https://dummyimage.com/368x307" />
                <div className="text-center lg:w-2/3 w-full">
                  <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">InnoTe Editor</h1>
                  {
                    currentOpenFile === ''
                      ? (<p className="my-4 leading-relaxed">点击「文件 - 打开目录」立即开始编写你的 Markdown 文件</p>)
                      : (<p className="my-4 leading-relaxed">暂不支持该文件类型哦~</p>)
                  }
                  {/* <div className="flex justify-center">
                    <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
                    <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
                  </div> */}
                </div>
              </div>
            </section>
          </ResizablePanel>
        )
      }
    </ResizablePanelGroup>
  )
}

export default Editor;