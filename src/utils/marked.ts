import { marked } from "marked";
import axios from "axios";
import * as cheerio from "cheerio";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const cleanUrl = (href: string) => {
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
};

const cache = new Map<
  string,
  {
    title: string;
    description: string;
    siteName: string;
    url: string;
    image: string;
  }
>();

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
        console.log(token);
        // 生成 B 站内嵌视频的标签
        const bid = new URL(cleanHref).pathname
          .split("/")
          .filter(Boolean)
          .pop();
        if (!bid) return Promise.resolve(void 0);

        const videoIframe = `<iframe referrerpolicy="origin" src="//player.bilibili.com/player.html?bvid=${bid}&amp;page=1&amp;high_quality=1&amp;as_wide=1&amp;allowfullscreen=true&amp;autoplay=0" frameborder="no" allowfullscreen="" sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups" class="" style="width: 100%; height: 100%;" data-spm-anchor-id="wolai.workspace.0.i0.4d2b767bSGb7ID" data-spm-act-id="wolai.workspace.0.i0.4d2b767bSGb7ID"></iframe>`
        token.tokens = marked.Lexer.lexInline(videoIframe);
      } else if (
        cleanHref?.includes("music.163.com")
      ) {
        
        const id = new URL(cleanHref).hash.split('?').filter(i => i.startsWith('id='))[0].split('=')[1];
        if (!id) return Promise.resolve(void 0);

        const musicIframe = `<iframe referrerpolicy="origin" src="https://music.163.com/outchain/player?type=2&amp;id=${id}&amp;auto=0&amp;height=66" frameborder="no" allowfullscreen="" sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups" class="" style="width: 100%; height: 100%; pointer-events: auto;"></iframe>`;
        token.tokens = marked.Lexer.lexInline(musicIframe);

      } else if (
        cleanHref?.includes("douban") ||
        cleanHref?.includes("github")
      ) {
        console.log(token);

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
  }
});

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);

export default marked;
