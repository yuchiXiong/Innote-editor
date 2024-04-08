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
import { files, app } from "@/actions";
import { CURRENT_OPEN_DIRECTORY_KEY } from "@/const/storage";

export interface IHeaderProps {
  title: string,
  setCurrentDirectory: (directory: string) => void;
}

const Header = (props: IHeaderProps) => {

  const { title } = props;
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    app.isMaximized().then((res: boolean) => {
      setIsMaximized(res);
    })
  }, []);

  useEffect(() => {
    app.onMaximized(() => setIsMaximized(true))
    app.onUnMaximized(() => setIsMaximized(false));
  }, []);

  const handleOpenDirectory = async () => {
    const res = await files.openDirectory();
    props.setCurrentDirectory(res);
    localStorage.setItem(CURRENT_OPEN_DIRECTORY_KEY, res);
  }

  return (
    <div
      className={
        cn(
          'flex items-center justify-between',
          'w-full  bg-white shadow-md',
          'select-none',
          'webkitAppRegionDrag'
        )
      }
      onDoubleClick={isMaximized ? app.unMaximize : app.maximize}
    >
      <Menubar className="border-none w-1/3">
        <MenubarMenu >
          <MenubarTrigger className="webkitAppRegionNoDrag">文件</MenubarTrigger>
          <MenubarContent>
            {/* <MenubarItem>新建窗口</MenubarItem> */}
            {/* <MenubarSeparator /> */}
            <MenubarItem onClick={handleOpenDirectory} >打开目录</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={app.close}>退出</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* <MenubarMenu>
          <MenubarTrigger className="webkitAppRegionNoDrag">编辑</MenubarTrigger>
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
        </MenubarMenu> */}
        {/* <MenubarMenu>
          <MenubarTrigger className="webkitAppRegionNoDrag">设置</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset>首选项</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>关于 InnoTe</MenubarItem>
          </MenubarContent>
        </MenubarMenu> */}
      </Menubar>
      <span
        className={cn(
          'w-1/3 rounded-full',
          'flex items-center justify-center',
          'cursor-pointer',
        )}
      >
        {title}
      </span>


      <ToggleGroup type="multiple" className="w-1/3 p-1">
        <ToggleGroupItem value="bold" aria-label="Toggle bold" className="ml-auto webkitAppRegionNoDrag"
          onClick={app.minimize}
        >
          <Minus theme="outline" size="20" fill="#000000" strokeWidth={3} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic"
          className="webkitAppRegionNoDrag"
          onClick={isMaximized ? app.unMaximize : app.maximize}
        >
          {
            isMaximized
              ? <DifferenceSet theme="outline" size="20" fill="#000000" strokeWidth={3} />
              : <FullScreen theme="outline" size="20" fill="#000000" strokeWidth={3} />
          }

        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline"
          className="webkitAppRegionNoDrag"
          onClick={app.close}

        >
          <Close theme="outline" size="20" fill="#000000" strokeWidth={3} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div >
  )
}

export default Header;