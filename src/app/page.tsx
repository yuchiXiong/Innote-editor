"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import marked from '@/utils/marked';
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function Home() {

  const [markedResult, setMarkedResult] = useState<string>('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const markedResultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromLocal = localStorage.getItem('TEST_CONTENT') || '';
    const markedAsync = async () => {
      return await marked(fromLocal);
    };

    markedAsync().then(res => {
      setMarkedResult(res);
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
    console.log(scrollTop, fullHeight);

    if (markedResultRef.current) {
      const markedResultHeight = markedResultRef.current.scrollHeight;
      markedResultRef.current.scrollTop = markedResultHeight * (scrollTop) / fullHeight;
    }
  }

  const handleInput = async (e: React.FormEvent<HTMLTextAreaElement>) => {
    const originContent = e.currentTarget.value;
    const _markedResult = await marked(originContent);
    setMarkedResult(_markedResult);
    localStorage.setItem('TEST_CONTENT', originContent);
  }

  return (
    <main className="flex h-screen flex-row items-center justify-between">
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
    </main>
  );
}
