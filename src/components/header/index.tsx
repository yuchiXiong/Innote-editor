"use client"
import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useEffect, useState } from "react";
import { Close, DifferenceSet, FullScreen, Minus } from "@icon-park/react";

const Header = () => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    (window as any).electronAPI.app.isMaximized().then((res: boolean) => {
      setIsMaximized(res);
    })
  }, []);

  return (
    <div
      className={
        cn(
          'flex items-center justify-between',
          'w-full  bg-white shadow-md',
          'select-none'
        )
      }
      style={{
        'WebkitAppRegion': 'drag',
      }
      }
    >
      <Menubar className="border-none w-1/3">
        <MenubarMenu >
          <MenubarTrigger style={{
            'WebkitAppRegion': 'no-drag',
          }}>文件</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>新建窗口</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => (window as any).electronAPI.openDirectory()} >打开目录</MenubarItem>
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
    </div >
  )
}

export default Header;