import { NextRequest } from "next/server"
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query = sp.get('url');

  if (!query) {
    return new Response('Missing url parameter', { status: 400 });
  }

  console.log(query);

  const response = await fetch(query);

  const html = await response.text();
 
  const $ = cheerio.load(html);

  const obj: {
    title: string;
    description: string;
    siteName: string;
    url: string;
    image: string;
  } = {
    title: "",
    description: "",
    siteName: "",
    url: "",
    image: "",
  };

  $("meta")
    .toArray()
    .forEach((item: cheerio.Element) => {
      switch ($(item).attr("property")) {
        case "og:description":
          obj.description = $(item).attr("content") as string;
          break;
        case "og:site_name":
          obj.siteName = $(item).attr("content") as string;
          break;
        case "og:title":
          obj.title = $(item).attr("content") as string;
          break;
        case "og:url":
          obj.url = $(item).attr("content") as string;
          break;
        case "og:image":
          obj.image = $(item).attr("content") as string;
          break;
      }
    });


  return Response.json({ 
    status: 'ok',
    result: obj,
   })
}