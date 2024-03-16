import { marked } from "marked";
import axios from "axios";
import * as cheerio from "cheerio";

const cleanUrl = (href: string) => {
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
};

const cache = new Map<string, {
  title: string;
  description: string;
  siteName: string;
  url: string;
  image: string;
}>();

const fetchLinkOpenGraph = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }
  let response = null;
  try {
    response = await axios(`/api/open-graph?url=${url}`);
  } catch (error) {
    // do nothing;
  } 

  // todo 默认视图
  if (!response) return;


  const obj = response.data.result;
  console.log(obj);
  
  cache.set(url, obj);

  return obj;
};

marked.use({
  async: true,
  async walkTokens(token) {
    if (token.type === "link") {
      const cleanHref = cleanUrl(token.href);
      if (cleanHref?.includes("bilibili")) {
        // 生成 B 站内嵌视频的标签
        const bid = new URL(cleanHref).pathname
          .split("/")
          .filter(Boolean)
          .pop();
        if (!bid) false;

        const vidoeIframe = `<iframe src="//player.bilibili.com/player.html?bvid=${bid}&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
        token.tokens = marked.Lexer.lexInline(vidoeIframe);
      } else if (
        cleanHref?.includes("douban") ||
        cleanHref?.includes("github")
      ) {
        // 生成缩略板块
        const desc = await fetchLinkOpenGraph(cleanHref);

        const card = `<a href="${desc?.url}">
            <div class="marked-link-og">
              <div class="og-info">
                <p class="og-title">${desc?.title}</p>
                <p class="og-description">${desc?.description}</p>
                <p class="og-site">${desc?.siteName}</p>
              </div>
              <div class="og-image">
                <img src="${desc?.image}" referrerPolicy="no-referrer" alt="${desc?.title}" />
              </div>
            </div>
          </a>`;
        token.tokens = marked.Lexer.lexInline(card);
      }
    }
  },
});

export default marked;
