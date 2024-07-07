// .vitepress/theme/serverUtils.ts
import { globby } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/globby@14.0.0/node_modules/globby/index.js";
import matter from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/gray-matter@4.0.3/node_modules/gray-matter/index.js";
import fs from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
async function getPosts() {
  let paths = await getPostMDFilePaths();
  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      const { data } = matter(content);
      data.date = _convertDate(data.date);
      return {
        frontMatter: data,
        regularPath: `/${item.replace(".md", ".html")}`
      };
    })
  );
  posts.sort(_compareDate);
  return posts;
}
function _convertDate(date = (/* @__PURE__ */ new Date()).toString()) {
  const json_date = new Date(date).toJSON();
  return json_date.split("T")[0];
}
function _compareDate(obj1, obj2) {
  return obj1.frontMatter.date < obj2.frontMatter.date ? 1 : -1;
}
async function getPostMDFilePaths() {
  let paths = await globby(["**.md"], {
    ignore: ["node_modules", "README.md"]
  });
  return paths.filter((item) => item.includes("posts/"));
}
async function getPostLength() {
  return [...await getPostMDFilePaths()].length;
}

// .vitepress/theme/rss.ts
import { dirname } from "path";
import fg from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/fast-glob@3.3.2/node_modules/fast-glob/out/index.js";
import fs2 from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";
import matter2 from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/gray-matter@4.0.3/node_modules/gray-matter/index.js";
import MarkdownIt from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/markdown-it@14.1.0/node_modules/markdown-it/index.mjs";
import { Feed } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/feed@4.2.2/node_modules/feed/lib/feed.js";
var DOMAIN = "https://louiesun.github.io";
var AUTHOR = {
  name: "louiesun",
  email: "louie.pingu@outlook.com",
  link: DOMAIN
};
var OPTIONS = {
  title: "Louiesun's Blog",
  description: "Blog page of louiesun. ",
  id: `${DOMAIN}/`,
  link: `${DOMAIN}/`,
  copyright: "GFDL License",
  feedLinks: {
    json: DOMAIN + "/feed.json",
    atom: DOMAIN + "/feed.atom",
    rss: DOMAIN + "/feed.xml"
  },
  author: AUTHOR,
  image: DOMAIN + "/alert.svg",
  favicon: DOMAIN + "/alert.svg"
};
var markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
});
async function buildBlogRSS() {
  const posts = await generateRSS();
  writeFeed("feed", posts);
}
async function generateRSS() {
  const files = await fg("posts/*.md");
  const posts = (await Promise.all(
    files.filter((i) => !i.includes("index")).map(async (i) => {
      const raw = await fs2.readFile(i, "utf-8");
      const { data, content } = matter2(raw);
      const html = markdown.render(content).replace('src="/', `src="${DOMAIN}/`);
      return {
        ...data,
        date: new Date(data.date),
        content: html,
        author: [AUTHOR],
        link: `${DOMAIN}/${i.replace(".md", ".html")}`
      };
    })
  )).filter(Boolean);
  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return posts;
}
async function writeFeed(name, items) {
  const feed = new Feed(OPTIONS);
  items.forEach((item) => feed.addItem(item));
  await fs2.ensureDir(dirname(`./.vitepress/dist/${name}`));
  await fs2.writeFile(`./.vitepress/dist/${name}.xml`, feed.rss2(), "utf-8");
  await fs2.writeFile(`./.vitepress/dist/${name}.atom`, feed.atom1(), "utf-8");
  await fs2.writeFile(`./.vitepress/dist/${name}.json`, feed.json1(), "utf-8");
}

// .vitepress/config.ts
import { transformerTwoslash } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@shikijs+vitepress-twoslash@1.6.1_typescript@5.4.5/node_modules/@shikijs/vitepress-twoslash/dist/index.mjs";
import mathjax3 from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/markdown-it-mathjax3@4.3.2/node_modules/markdown-it-mathjax3/index.js";
import multimd_table_plugin from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/markdown-it-multimd-table@4.2.3/node_modules/markdown-it-multimd-table/index.js";
import AutoSidebar from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/vite-plugin-vitepress-auto-sidebar@1.6.5_eslint@8.57.0_typescript@5.4.5_vite@5.2.12_@types+no_rivskz5eqtslq2g7e6zmf4tm2u/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
import { imgSize } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-img-size@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-img-size/lib/index.js";
import { footnote } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-footnote@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-footnote/lib/index.js";
import { tasklist } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-tasklist@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-tasklist/lib/index.js";
import { ins } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-ins@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-ins/lib/index.js";
import { mark } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-mark@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-mark/lib/index.js";
async function config() {
  return {
    lang: "zh-CN",
    title: "Louiesun's Blog",
    description: "Blog page of louiesun. ",
    head: [
      [
        "link",
        {
          rel: "icon",
          type: "image/svg",
          href: "/avator.svg"
        }
      ],
      [
        "meta",
        {
          name: "author",
          content: "Louiesun"
        }
      ],
      [
        "meta",
        {
          property: "og:title",
          content: "Home"
        }
      ],
      [
        "meta",
        {
          property: "og:description",
          content: "Blog of louiesun"
        }
      ]
    ],
    sitemap: {
      hostname: "https://louiesun.github.io"
    },
    // cleanUrls: "with-subfolders",
    lastUpdated: false,
    themeConfig: {
      // repo: "clark-cui/homeSite",
      logo: "/avator.svg",
      avator: "/avator.svg",
      search: {
        provider: "local"
      },
      docsDir: "/",
      // docsBranch: "master",
      posts: await getPosts(),
      pageSize: 5,
      postLength: await getPostLength(),
      nav: [
        {
          text: "\u{1F3E1}Blogs",
          link: "/"
        },
        {
          text: "\u{1F516}Tags",
          link: "/tags"
        },
        {
          text: "\u{1F4C3}Archives",
          link: "/archives"
        },
        {
          text: "\u{1F525}RSS",
          link: "https://louiesun.github.io/feed.xml"
        }
      ],
      socialLinks: [
        { icon: "github", link: "https://github.com/louiesun" },
        {
          icon: {
            svg: `<svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20">
            <path d="M874.666667 375.189333V746.666667a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V375.189333l266.090667 225.6a149.333333 149.333333 0 0 0 193.152 0L874.666667 375.189333zM810.666667 213.333333a64.789333 64.789333 0 0 1 22.826666 4.181334 63.616 63.616 0 0 1 26.794667 19.413333 64.32 64.32 0 0 1 9.344 15.466667c2.773333 6.570667 4.48 13.696 4.906667 21.184L874.666667 277.333333v21.333334L553.536 572.586667a64 64 0 0 1-79.893333 2.538666l-3.178667-2.56L149.333333 298.666667v-21.333334a63.786667 63.786667 0 0 1 35.136-57.130666A63.872 63.872 0 0 1 213.333333 213.333333h597.333334z" ></path>
            </svg>`
          },
          link: "mailto:louie.pingu@outlook.com"
        }
      ],
      // outline: 2, //设置右侧aside显示层级
      aside: false,
      // blogs page show firewokrs animation
      showFireworksAnimation: false
    },
    buildEnd: buildBlogRSS,
    markdown: {
      theme: {
        light: "vitesse-light",
        dark: "vitesse-dark"
      },
      codeTransformers: [transformerTwoslash()],
      config: (md) => {
        md.use(multimd_table_plugin, {
          multiline: true,
          rowspan: true
        });
        md.use(mathjax3);
        md.use(imgSize);
        md.use(footnote);
        md.use(tasklist);
        md.use(ins);
        md.use(mark);
      }
    },
    vue: {
      template: {
        compilerOptions: {}
      }
    },
    vite: {
      plugins: [
        // add plugin
        AutoSidebar({
          path: "/",
          collapsed: true
        })
      ]
    }
  };
}
var config_default = config();
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy90aGVtZS9zZXJ2ZXJVdGlscy50cyIsICIudml0ZXByZXNzL3RoZW1lL3Jzcy50cyIsICIudml0ZXByZXNzL2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxcc2VydmVyVXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FQUFMvbG91aWVzdW4uZ2l0aHViLmlvLy52aXRlcHJlc3MvdGhlbWUvc2VydmVyVXRpbHMudHNcIjtpbXBvcnQge2dsb2JieX0gZnJvbSAnZ2xvYmJ5JztcclxuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvc3RzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdldFBvc3RNREZpbGVQYXRocygpO1xyXG4gIGxldCBwb3N0cyA9IGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgcGF0aHMubWFwKGFzeW5jIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZShpdGVtLCBcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG1hdHRlcihjb250ZW50KTtcclxuICAgICAgZGF0YS5kYXRlID0gX2NvbnZlcnREYXRlKGRhdGEuZGF0ZSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZnJvbnRNYXR0ZXI6IGRhdGEsXHJcbiAgICAgICAgcmVndWxhclBhdGg6IGAvJHtpdGVtLnJlcGxhY2UoXCIubWRcIiwgXCIuaHRtbFwiKX1gLFxyXG4gICAgICB9O1xyXG4gICAgfSlcclxuICApO1xyXG4gIHBvc3RzLnNvcnQoX2NvbXBhcmVEYXRlKTtcclxuICByZXR1cm4gcG9zdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb252ZXJ0RGF0ZShkYXRlID0gbmV3IERhdGUoKS50b1N0cmluZygpKSB7XHJcbiAgY29uc3QganNvbl9kYXRlID0gbmV3IERhdGUoZGF0ZSkudG9KU09OKCk7XHJcbiAgcmV0dXJuIGpzb25fZGF0ZS5zcGxpdChcIlRcIilbMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb21wYXJlRGF0ZShvYmoxLCBvYmoyKSB7XHJcbiAgcmV0dXJuIG9iajEuZnJvbnRNYXR0ZXIuZGF0ZSA8IG9iajIuZnJvbnRNYXR0ZXIuZGF0ZSA/IDEgOiAtMTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UG9zdE1ERmlsZVBhdGhzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdsb2JieShbXCIqKi5tZFwiXSwge1xyXG4gICAgaWdub3JlOiBbXCJub2RlX21vZHVsZXNcIiwgXCJSRUFETUUubWRcIl0sXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBhdGhzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmNsdWRlcyhcInBvc3RzL1wiKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQb3N0TGVuZ3RoKCkge1xyXG4gIC8vIGdldFBvc3RNREZpbGVQYXRoIHJldHVybiB0eXBlIGlzIG9iamVjdCBub3QgYXJyYXlcclxuICByZXR1cm4gWy4uLihhd2FpdCBnZXRQb3N0TURGaWxlUGF0aHMoKSldLmxlbmd0aDtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxccnNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL3RoZW1lL3Jzcy50c1wiO2ltcG9ydCB7IGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZmcgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IEZlZWRPcHRpb25zLCBJdGVtIH0gZnJvbSBcImZlZWRcIjtcclxuaW1wb3J0IHsgRmVlZCB9IGZyb20gXCJmZWVkXCI7XHJcblxyXG5jb25zdCBET01BSU4gPSBcImh0dHBzOi8vbG91aWVzdW4uZ2l0aHViLmlvXCI7XHJcbmNvbnN0IEFVVEhPUiA9IHtcclxuICBuYW1lOiBcImxvdWllc3VuXCIsXHJcbiAgZW1haWw6IFwibG91aWUucGluZ3VAb3V0bG9vay5jb21cIixcclxuICBsaW5rOiBET01BSU4sXHJcbn07XHJcbmNvbnN0IE9QVElPTlM6IEZlZWRPcHRpb25zID0ge1xyXG4gIHRpdGxlOiBcIkxvdWllc3VuJ3MgQmxvZ1wiLFxyXG4gIGRlc2NyaXB0aW9uOiBcIkJsb2cgcGFnZSBvZiBsb3VpZXN1bi4gXCIsXHJcbiAgaWQ6IGAke0RPTUFJTn0vYCxcclxuICBsaW5rOiBgJHtET01BSU59L2AsXHJcbiAgY29weXJpZ2h0OiBcIkdGREwgTGljZW5zZVwiLFxyXG4gIGZlZWRMaW5rczoge1xyXG4gICAganNvbjogRE9NQUlOICsgXCIvZmVlZC5qc29uXCIsXHJcbiAgICBhdG9tOiBET01BSU4gKyBcIi9mZWVkLmF0b21cIixcclxuICAgIHJzczogRE9NQUlOICsgXCIvZmVlZC54bWxcIixcclxuICB9LFxyXG4gIGF1dGhvcjogQVVUSE9SLFxyXG4gIGltYWdlOiBET01BSU4rXCIvYWxlcnQuc3ZnXCIsXHJcbiAgZmF2aWNvbjogRE9NQUlOK1wiL2FsZXJ0LnN2Z1wiLFxyXG59O1xyXG5cclxuY29uc3QgbWFya2Rvd24gPSBNYXJrZG93bkl0KHtcclxuICBodG1sOiB0cnVlLFxyXG4gIGJyZWFrczogdHJ1ZSxcclxuICBsaW5raWZ5OiB0cnVlLFxyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZEJsb2dSU1MoKSB7XHJcbiAgY29uc3QgcG9zdHMgPSBhd2FpdCBnZW5lcmF0ZVJTUygpO1xyXG4gIHdyaXRlRmVlZChcImZlZWRcIiwgcG9zdHMpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJTUygpIHtcclxuICBjb25zdCBmaWxlcyA9IGF3YWl0IGZnKFwicG9zdHMvKi5tZFwiKTtcclxuXHJcbiAgY29uc3QgcG9zdHM6IGFueVtdID0gKFxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIGZpbGVzXHJcbiAgICAgICAgLmZpbHRlcigoaSkgPT4gIWkuaW5jbHVkZXMoXCJpbmRleFwiKSlcclxuICAgICAgICAubWFwKGFzeW5jIChpKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByYXcgPSBhd2FpdCBmcy5yZWFkRmlsZShpLCBcInV0Zi04XCIpO1xyXG4gICAgICAgICAgY29uc3QgeyBkYXRhLCBjb250ZW50IH0gPSBtYXR0ZXIocmF3KTtcclxuICAgICAgICAgIGNvbnN0IGh0bWwgPSBtYXJrZG93blxyXG4gICAgICAgICAgICAucmVuZGVyKGNvbnRlbnQpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCdzcmM9XCIvJywgYHNyYz1cIiR7RE9NQUlOfS9gKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5kYXRhLFxyXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShkYXRhLmRhdGUpLFxyXG4gICAgICAgICAgICBjb250ZW50OiBodG1sLFxyXG4gICAgICAgICAgICBhdXRob3I6IFtBVVRIT1JdLFxyXG4gICAgICAgICAgICBsaW5rOiBgJHtET01BSU59LyR7aS5yZXBsYWNlKFwiLm1kXCIsIFwiLmh0bWxcIil9YCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgIClcclxuICApLmZpbHRlcihCb29sZWFuKTtcclxuXHJcbiAgcG9zdHMuc29ydCgoYSwgYikgPT4gK25ldyBEYXRlKGIuZGF0ZSkgLSArbmV3IERhdGUoYS5kYXRlKSk7XHJcbiAgcmV0dXJuIHBvc3RzO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB3cml0ZUZlZWQobmFtZTogc3RyaW5nLCBpdGVtczogSXRlbVtdKSB7XHJcbiAgY29uc3QgZmVlZCA9IG5ldyBGZWVkKE9QVElPTlMpO1xyXG4gIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IGZlZWQuYWRkSXRlbShpdGVtKSk7XHJcblxyXG4gIGF3YWl0IGZzLmVuc3VyZURpcihkaXJuYW1lKGAuLy52aXRlcHJlc3MvZGlzdC8ke25hbWV9YCkpO1xyXG4gIGF3YWl0IGZzLndyaXRlRmlsZShgLi8udml0ZXByZXNzL2Rpc3QvJHtuYW1lfS54bWxgLCBmZWVkLnJzczIoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uYXRvbWAsIGZlZWQuYXRvbTEoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uanNvbmAsIGZlZWQuanNvbjEoKSwgXCJ1dGYtOFwiKTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL2NvbmZpZy50c1wiO2ltcG9ydCB7IGdldFBvc3RzLCBnZXRQb3N0TGVuZ3RoIH0gZnJvbSBcIi4vdGhlbWUvc2VydmVyVXRpbHNcIjtcclxuaW1wb3J0IHsgYnVpbGRCbG9nUlNTIH0gZnJvbSBcIi4vdGhlbWUvcnNzXCI7XHJcbmltcG9ydCB7IHRyYW5zZm9ybWVyVHdvc2xhc2ggfSBmcm9tIFwiQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoXCI7XHJcbmltcG9ydCBtYXRoamF4MyBmcm9tIFwibWFya2Rvd24taXQtbWF0aGpheDNcIjtcclxuaW1wb3J0IG11bHRpbWRfdGFibGVfcGx1Z2luIGZyb20gXCJtYXJrZG93bi1pdC1tdWx0aW1kLXRhYmxlXCI7XHJcbmltcG9ydCBBdXRvU2lkZWJhciBmcm9tICd2aXRlLXBsdWdpbi12aXRlcHJlc3MtYXV0by1zaWRlYmFyJztcclxuaW1wb3J0IHsgaW1nU2l6ZSB9IGZyb20gXCJAbWRpdC9wbHVnaW4taW1nLXNpemVcIjtcclxuaW1wb3J0IHsgZm9vdG5vdGUgfSBmcm9tIFwiQG1kaXQvcGx1Z2luLWZvb3Rub3RlXCI7XHJcbmltcG9ydCB7IHRhc2tsaXN0IH0gZnJvbSBcIkBtZGl0L3BsdWdpbi10YXNrbGlzdFwiO1xyXG5pbXBvcnQgeyBpbnMgfSBmcm9tICdAbWRpdC9wbHVnaW4taW5zJ1xyXG5pbXBvcnQgeyBtYXJrIH0gZnJvbSAnQG1kaXQvcGx1Z2luLW1hcmsnXHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb25maWcoKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIGxhbmc6IFwiemgtQ05cIixcclxuICAgIHRpdGxlOiBcIkxvdWllc3VuJ3MgQmxvZ1wiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiQmxvZyBwYWdlIG9mIGxvdWllc3VuLiBcIixcclxuICAgIGhlYWQ6IFtcclxuICAgICAgW1xyXG4gICAgICAgIFwibGlua1wiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHJlbDogXCJpY29uXCIsXHJcbiAgICAgICAgICB0eXBlOiBcImltYWdlL3N2Z1wiLFxyXG4gICAgICAgICAgaHJlZjogXCIvYXZhdG9yLnN2Z1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICBcIm1ldGFcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiBcImF1dGhvclwiLFxyXG4gICAgICAgICAgY29udGVudDogXCJMb3VpZXN1blwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICBcIm1ldGFcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm9wZXJ0eTogXCJvZzp0aXRsZVwiLFxyXG4gICAgICAgICAgY29udGVudDogXCJIb21lXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwibWV0YVwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3BlcnR5OiBcIm9nOmRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIkJsb2cgb2YgbG91aWVzdW5cIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgXSxcclxuICAgIHNpdGVtYXA6IHtcclxuICAgICAgaG9zdG5hbWU6ICdodHRwczovL2xvdWllc3VuLmdpdGh1Yi5pbycsXHJcbiAgICB9LFxyXG4gICAgLy8gY2xlYW5VcmxzOiBcIndpdGgtc3ViZm9sZGVyc1wiLFxyXG4gICAgbGFzdFVwZGF0ZWQ6IGZhbHNlLFxyXG4gICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgLy8gcmVwbzogXCJjbGFyay1jdWkvaG9tZVNpdGVcIixcclxuICAgICAgbG9nbzogXCIvYXZhdG9yLnN2Z1wiLFxyXG4gICAgICBhdmF0b3I6IFwiL2F2YXRvci5zdmdcIixcclxuICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgcHJvdmlkZXI6IFwibG9jYWxcIixcclxuICAgICAgfSxcclxuICAgICAgZG9jc0RpcjogXCIvXCIsXHJcbiAgICAgIC8vIGRvY3NCcmFuY2g6IFwibWFzdGVyXCIsXHJcbiAgICAgIHBvc3RzOiBhd2FpdCBnZXRQb3N0cygpLFxyXG4gICAgICBwYWdlU2l6ZTogNSxcclxuICAgICAgcG9zdExlbmd0aDogYXdhaXQgZ2V0UG9zdExlbmd0aCgpLFxyXG4gICAgICBuYXY6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1RDgzQ1x1REZFMUJsb2dzXCIsXHJcbiAgICAgICAgICBsaW5rOiBcIi9cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHVEODNEXHVERDE2VGFnc1wiLFxyXG4gICAgICAgICAgbGluazogXCIvdGFnc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdURDQzNBcmNoaXZlc1wiLFxyXG4gICAgICAgICAgbGluazogXCIvYXJjaGl2ZXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHVEODNEXHVERDI1UlNTXCIsXHJcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vbG91aWVzdW4uZ2l0aHViLmlvL2ZlZWQueG1sXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgc29jaWFsTGlua3M6IFtcclxuICAgICAgICB7IGljb246IFwiZ2l0aHViXCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xvdWllc3VuXCIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgIHN2ZzogYDxzdmcgcm9sZT1cImltZ1wiIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIj5cclxuICAgICAgICAgICAgPHBhdGggZD1cIk04NzQuNjY2NjY3IDM3NS4xODkzMzNWNzQ2LjY2NjY2N2E2NCA2NCAwIDAgMS02NCA2NEgyMTMuMzMzMzMzYTY0IDY0IDAgMCAxLTY0LTY0VjM3NS4xODkzMzNsMjY2LjA5MDY2NyAyMjUuNmExNDkuMzMzMzMzIDE0OS4zMzMzMzMgMCAwIDAgMTkzLjE1MiAwTDg3NC42NjY2NjcgMzc1LjE4OTMzM3pNODEwLjY2NjY2NyAyMTMuMzMzMzMzYTY0Ljc4OTMzMyA2NC43ODkzMzMgMCAwIDEgMjIuODI2NjY2IDQuMTgxMzM0IDYzLjYxNiA2My42MTYgMCAwIDEgMjYuNzk0NjY3IDE5LjQxMzMzMyA2NC4zMiA2NC4zMiAwIDAgMSA5LjM0NCAxNS40NjY2NjdjMi43NzMzMzMgNi41NzA2NjcgNC40OCAxMy42OTYgNC45MDY2NjcgMjEuMTg0TDg3NC42NjY2NjcgMjc3LjMzMzMzM3YyMS4zMzMzMzRMNTUzLjUzNiA1NzIuNTg2NjY3YTY0IDY0IDAgMCAxLTc5Ljg5MzMzMyAyLjUzODY2NmwtMy4xNzg2NjctMi41NkwxNDkuMzMzMzMzIDI5OC42NjY2Njd2LTIxLjMzMzMzNGE2My43ODY2NjcgNjMuNzg2NjY3IDAgMCAxIDM1LjEzNi01Ny4xMzA2NjZBNjMuODcyIDYzLjg3MiAwIDAgMSAyMTMuMzMzMzMzIDIxMy4zMzMzMzNoNTk3LjMzMzMzNHpcIiA+PC9wYXRoPlxyXG4gICAgICAgICAgICA8L3N2Zz5gLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxpbms6IFwibWFpbHRvOmxvdWllLnBpbmd1QG91dGxvb2suY29tXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgLy8gb3V0bGluZTogMiwgLy9cdThCQkVcdTdGNkVcdTUzRjNcdTRGQTdhc2lkZVx1NjYzRVx1NzkzQVx1NUM0Mlx1N0VBN1xyXG4gICAgICBhc2lkZTogZmFsc2UsXHJcbiAgICAgIC8vIGJsb2dzIHBhZ2Ugc2hvdyBmaXJld29rcnMgYW5pbWF0aW9uXHJcbiAgICAgIHNob3dGaXJld29ya3NBbmltYXRpb246IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkRW5kOiBidWlsZEJsb2dSU1MsXHJcbiAgICBtYXJrZG93bjoge1xyXG4gICAgICB0aGVtZToge1xyXG4gICAgICAgIGxpZ2h0OiBcInZpdGVzc2UtbGlnaHRcIixcclxuICAgICAgICBkYXJrOiBcInZpdGVzc2UtZGFya1wiLFxyXG4gICAgICB9LFxyXG4gICAgICBjb2RlVHJhbnNmb3JtZXJzOiBbdHJhbnNmb3JtZXJUd29zbGFzaCgpXSxcclxuICAgICAgY29uZmlnOiAobWQpID0+IHtcclxuICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY2RjRcdTU5MUFcdTc2ODQgTWFya2Rvd24taXQgXHU2M0QyXHU0RUY2XHVGRjAxXHJcbiAgICAgICAgbWQudXNlKG11bHRpbWRfdGFibGVfcGx1Z2luLCB7XHJcbiAgICAgICAgICBtdWx0aWxpbmU6IHRydWUsXHJcbiAgICAgICAgICByb3dzcGFuOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1kLnVzZShtYXRoamF4Myk7XHJcbiAgICAgICAgbWQudXNlKGltZ1NpemUpO1xyXG4gICAgICAgIG1kLnVzZShmb290bm90ZSk7XHJcbiAgICAgICAgbWQudXNlKHRhc2tsaXN0KTtcclxuICAgICAgICBtZC51c2UoaW5zKTtcclxuICAgICAgICBtZC51c2UobWFyayk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2dWU6IHtcclxuICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2aXRlOiB7XHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAvLyBhZGQgcGx1Z2luXHJcbiAgICAgICAgQXV0b1NpZGViYXIoe1xyXG4gICAgICAgICAgcGF0aDogJy8nLFxyXG4gICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgfTtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBjb25maWcoKTtcclxuXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlQsU0FBUSxjQUFhO0FBQ2xWLE9BQU8sWUFBWTtBQUNuQixPQUFPLFFBQVE7QUFHZixlQUFzQixXQUFXO0FBQy9CLE1BQUksUUFBUSxNQUFNLG1CQUFtQjtBQUNyQyxNQUFJLFFBQVEsTUFBTSxRQUFRO0FBQUEsSUFDeEIsTUFBTSxJQUFJLE9BQU8sU0FBUztBQUN4QixZQUFNLFVBQVUsTUFBTSxHQUFHLFNBQVMsTUFBTSxPQUFPO0FBQy9DLFlBQU0sRUFBRSxLQUFLLElBQUksT0FBTyxPQUFPO0FBQy9CLFdBQUssT0FBTyxhQUFhLEtBQUssSUFBSTtBQUNsQyxhQUFPO0FBQUEsUUFDTCxhQUFhO0FBQUEsUUFDYixhQUFhLElBQUksS0FBSyxRQUFRLE9BQU8sT0FBTyxDQUFDO0FBQUEsTUFDL0M7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQ0EsUUFBTSxLQUFLLFlBQVk7QUFDdkIsU0FBTztBQUNUO0FBRUEsU0FBUyxhQUFhLFFBQU8sb0JBQUksS0FBSyxHQUFFLFNBQVMsR0FBRztBQUNsRCxRQUFNLFlBQVksSUFBSSxLQUFLLElBQUksRUFBRSxPQUFPO0FBQ3hDLFNBQU8sVUFBVSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQy9CO0FBRUEsU0FBUyxhQUFhLE1BQU0sTUFBTTtBQUNoQyxTQUFPLEtBQUssWUFBWSxPQUFPLEtB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
