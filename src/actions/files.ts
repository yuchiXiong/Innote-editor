

/** 获取文件内容 */
const getFileContent = (path: string): Promise<string> => {
  return Promise.resolve("# Guide\n\n这是一篇讲解如何正确使用 **Markdown** 的排版示例，学会这个很有必要，能让你的文章有更佳清晰的排版。\n\n> 引用文本：Markdown is a text formatting syntax inspired\n\n## 语法指导\n\n### 普通内容\n\n这段内容展示了在内容里面一些小的格式，比如：\n\n- **加粗** - `**加粗**`\n- _倾斜_ - `*倾斜*`\n- ~~删除线~~ - `~~删除线~~`\n- `Code 标记` - `` `Code 标记` ``\n- [超级链接](http://github.com) - `[超级链接](http://github.com)`\n- [username@gmail.com](mailto:username@gmail.com) - `[username@gmail.com](mailto:username@gmail.com)`\n\n### 提及用户\n\n@foo @bar @someone ... 通过 @ 可以在发帖和回帖里面提及用户，信息提交以后，被提及的用户将会收到系统通知。以便让他来关注这个帖子或回帖。\n\n### 表情符号 Emoji\n\n支持表情符号，你可以用系统默认的 Emoji 符号（无法支持 Windows 用户）。\n也可以用图片的表情，输入 `:` 将会出现智能提示。\n\n#### 一些表情例子\n\n:smile: :laughing: :dizzy_face: :sob: :cold_sweat: :sweat_smile: :cry: :triumph: :heart_eyes: :relaxed: :sunglasses: :weary:\n\n:+1: :-1: :100: :clap: :bell: :gift: :question: :bomb: :heart: :coffee: :cyclone: :bow: :kiss: :pray: :sweat_drops: :hankey: :exclamation: :anger:\n\n### 大标题 - Heading 3\n\n你可以选择使用 H2 至 H6，使用 ##(N) 打头，H1 不能使用，会自动转换成 H2。\n\n> NOTE: 别忘了 # 后面需要有空格！\n\n#### Heading 4\n\n##### Heading 5\n\n###### Heading 6\n\n### 图片\n\n```\n![alt 文本](http://image-path.png)\n![alt 文本](http://image-path.png \"图片 Title 值\")\n![设置图片宽度高度](http://image-path.png =300x200)\n![设置图片宽度](http://image-path.png =300x)\n![设置图片高度](http://image-path.png =x200)\n```\n\n### 代码块\n\n#### 普通\n\n```\n*emphasize*    **strong**\n_emphasize_    __strong__\n@a = 1\n```\n\n#### 语法高亮支持\n\n如果在 \\`\\`\\` 后面更随语言名称，可以有语法高亮的效果哦，比如:\n\n##### 演示 Ruby 代码高亮\n\n```ruby\nclass PostController < ApplicationController\n  def index\n    @posts = Post.last_actived.limit(10)\n  end\nend\n```\n\n##### 演示 Rails View 高亮\n\n```erb\n<%= @posts.each do |post| %>\n<div class=\"post\"></div>\n<% end %>\n```\n\n##### 演示 YAML 文件\n\n```yml\nzh-CN:\n  name: 姓名\n  age: 年龄\n```\n\n> Tip: 语言名称支持下面这些: `ruby`, `python`, `js`, `html`, `erb`, `css`, `coffee`, `bash`, `json`, `yml`, `xml` ...\n\n### 有序、无序列表\n\n#### 无序列表\n\n- Ruby\n  - Rails\n    - ActiveRecord\n- Go\n  - Gofmt\n  - Revel\n- Node.js\n  - Koa\n  - Express\n\n#### 有序列表\n\n1. Node.js\n1. Express\n1. Koa\n1. Sails\n1. Ruby\n1. Rails\n1. Sinatra\n1. Go\n\n### 表格\n\n如果需要展示数据什么的，可以选择使用表格哦\n\n| header 1 | header 3 |\n| -------- | -------- |\n| cell 1   | cell 2   |\n| cell 3   | cell 4   |\n| cell 5   | cell 6   |\n\n### 段落\n\n留空白的换行，将会被自动转换成一个段落，会有一定的段落间距，便于阅读。\n\n请注意后面 Markdown 源代码的换行留空情况。\n\n### 视频插入\n\n目前支持 Youtube 和 Youku 两家的视频插入，你只需要复制视频播放页面，浏览器地址栏的网页 URL 地址，并粘贴到话题／回复文本框，提交以后将自动转换成视频播放器。\n\n#### 例如\n\n**Youtube**\n\nhttps://www.youtube.com/watch?v=52AMJwF7P0w\n\n**Vimeo**\n\nhttps://vimeo.com/460511888\n\n**Youku**\n\nhttps://v.youku.com/v_show/id_XNDU4Mzg4Mjc2OA==.html\n\n**BiliBili**\n\nhttps://www.bilibili.com/video/BV1uv411B7MK\n··· ")
  // return invoke<string>("get_content_by_filepath", { path });
};

export interface IDirectoryContent {
  name: string;
  path: string;
  isDirectory: boolean;
}

type TNativeDirectoryContent = Exclude<IDirectoryContent, "isDirectory"> & {
  is_directory: boolean;
};

const getDirectoryContent = (path: string): Promise<IDirectoryContent[]> => {
  return Promise.resolve(new Array(10).fill('').map((_, i) => ({
    name: 'file_' + i + '.md',
    path: `${path}/file_${i}.md`,
    isDirectory: Math.random() > 0.5,
  })));
  // return invoke<TNativeDirectoryContent[]>(
  //   "get_directory_by_path",
  //   { path }
  // ).then((data) => {
  //   return data.map((item) => {
  //     return {
  //       name: item.name,
  //       path: item.path,
  //       isDirectory: item.is_directory,
  //     };
  //   });
  // });
};

const writeFile = (path: string, content: string): Promise<void> => {
  return Promise.resolve(void 0);
  // return invoke<void>("write_string_to_file", { path, content });
};

const createFile = (path: string): Promise<string> => {
  return Promise.resolve(path);
  // return invoke<string>("create_markdown_file_to_path", { path });
};

const createDirectory = (path: string): Promise<string> => {
  return Promise.resolve(path);
  // return invoke<string>("create_directory_to_path", { path });
};

const renameFile = (oldPath: string, newPath: string): Promise<string> => {
  return Promise.resolve(newPath);

  // return invoke<string>("rename_file_by_path", { oldPath, newPath });
};

const deleteFile = (path: string): Promise<void> => {
  return Promise.resolve(void 0);

  // return invoke<void>("remove_file_by_path", { path });
};

const deleteDirectory = (path: string): Promise<void> => {
  return Promise.resolve(void 0);

  // return invoke<void>("remove_directory_by_path", { path });
};

export {
  getFileContent,
  getDirectoryContent,
  writeFile,
  createFile,
  createDirectory,
  renameFile,
  deleteFile,
  deleteDirectory,
};
