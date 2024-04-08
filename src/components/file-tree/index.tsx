import { files } from "@/actions";
import {
  Tree,
  TreeViewElement,
  File,
  Folder,
  CollapseButton,
} from "@/components/ui/tree-view-api";
import { MouseEvent } from "react";

export interface IFileTreeProps {
  treeData: (TreeViewElement & {
    isDirectory: boolean;
    path: string;
    children?: IFileTreeProps["treeData"];
  })[];
  afterFileOpen: (filePath: string, content: string) => void;
  reFresh: () => void;
}

export type IFileTreeItem = IFileTreeProps["treeData"][number];

const TreeItem = (props: IFileTreeProps) => {
  const { treeData, reFresh, afterFileOpen } = props;

  const handleDirectoryClick = async (element: IFileTreeItem) => {
    console.log('click dir', element)


    if (!element.isDirectory) return;
    
    const elementPath = files.pathJoin([element.path, element.name])
    console.log(elementPath)

    files.getFileList(elementPath).then(async (files) => {
      console.log(files)
    });

    element.children = (await files.getFileList(elementPath)) || [];
    props.reFresh();


  }
  const handleItemClick = async (event: MouseEvent<HTMLLIElement>, element: IFileTreeItem) => {
    event.stopPropagation();
    event.preventDefault();
    if (element.isDirectory) {
      handleDirectoryClick(element);
    } else {
      handleFileClick(element);
    }
  }


  const handleFileClick = async (element: IFileTreeItem) => {
    console.log('click file')
    const filePath = files.pathJoin([element.path, element.name])
    const content = await files.getFileContent(filePath) || '';
    props.afterFileOpen(filePath, content);
  }

  return (
    <ul className="w-full space-y-1">
      {treeData.map((element) => (
        <li
          key={element.id}
          className="w-full space-y-2"
          onClick={(e) => handleItemClick(e, element)}

        >
          {element.isDirectory ? (
            <Folder
              element={element.name}
              id={element.id}
              isSelectable={element.isSelectable}
              className="px-px pr-1"
            >
              <TreeItem
                key={element.id}
                aria-label={`folder ${element.name}`}
                treeData={element.children || []}
                reFresh={reFresh}
                afterFileOpen={afterFileOpen}
              />
            </Folder>
          ) : (
            <File
              key={element.id}
              id={element.id}
              element={element.name}
              isSelectable={element.isSelectable}
            >
              <span>{element?.name}</span>
            </File>
          )}
        </li>
      ))}
    </ul>
  );
};

const FileTree = (props: IFileTreeProps) => {
  const { treeData, reFresh, afterFileOpen } = props;

  const sortedTreeData = [...treeData].sort((a, b) => {
    return Number(b.isDirectory) - Number(a.isDirectory);
  })

  return (
    <Tree className="w-full bg-background p-2" indicator={true}>
      {sortedTreeData.map((element, _) => (
        <TreeItem
          key={element.id}
          treeData={[element]}
          afterFileOpen={afterFileOpen}
          reFresh={props.reFresh}
        />
      ))}
      <CollapseButton elements={sortedTreeData} expandAll={true} />
    </Tree>
  );
};

export default FileTree;
