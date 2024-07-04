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
      }
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => customElements.includes(tag)
        }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy90aGVtZS9zZXJ2ZXJVdGlscy50cyIsICIudml0ZXByZXNzL3RoZW1lL3Jzcy50cyIsICIudml0ZXByZXNzL2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxcc2VydmVyVXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FQUFMvbG91aWVzdW4uZ2l0aHViLmlvLy52aXRlcHJlc3MvdGhlbWUvc2VydmVyVXRpbHMudHNcIjtpbXBvcnQge2dsb2JieX0gZnJvbSAnZ2xvYmJ5JztcclxuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvc3RzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdldFBvc3RNREZpbGVQYXRocygpO1xyXG4gIGxldCBwb3N0cyA9IGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgcGF0aHMubWFwKGFzeW5jIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZShpdGVtLCBcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG1hdHRlcihjb250ZW50KTtcclxuICAgICAgZGF0YS5kYXRlID0gX2NvbnZlcnREYXRlKGRhdGEuZGF0ZSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZnJvbnRNYXR0ZXI6IGRhdGEsXHJcbiAgICAgICAgcmVndWxhclBhdGg6IGAvJHtpdGVtLnJlcGxhY2UoXCIubWRcIiwgXCIuaHRtbFwiKX1gLFxyXG4gICAgICB9O1xyXG4gICAgfSlcclxuICApO1xyXG4gIHBvc3RzLnNvcnQoX2NvbXBhcmVEYXRlKTtcclxuICByZXR1cm4gcG9zdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb252ZXJ0RGF0ZShkYXRlID0gbmV3IERhdGUoKS50b1N0cmluZygpKSB7XHJcbiAgY29uc3QganNvbl9kYXRlID0gbmV3IERhdGUoZGF0ZSkudG9KU09OKCk7XHJcbiAgcmV0dXJuIGpzb25fZGF0ZS5zcGxpdChcIlRcIilbMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb21wYXJlRGF0ZShvYmoxLCBvYmoyKSB7XHJcbiAgcmV0dXJuIG9iajEuZnJvbnRNYXR0ZXIuZGF0ZSA8IG9iajIuZnJvbnRNYXR0ZXIuZGF0ZSA/IDEgOiAtMTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UG9zdE1ERmlsZVBhdGhzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdsb2JieShbXCIqKi5tZFwiXSwge1xyXG4gICAgaWdub3JlOiBbXCJub2RlX21vZHVsZXNcIiwgXCJSRUFETUUubWRcIl0sXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBhdGhzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmNsdWRlcyhcInBvc3RzL1wiKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQb3N0TGVuZ3RoKCkge1xyXG4gIC8vIGdldFBvc3RNREZpbGVQYXRoIHJldHVybiB0eXBlIGlzIG9iamVjdCBub3QgYXJyYXlcclxuICByZXR1cm4gWy4uLihhd2FpdCBnZXRQb3N0TURGaWxlUGF0aHMoKSldLmxlbmd0aDtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxccnNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL3RoZW1lL3Jzcy50c1wiO2ltcG9ydCB7IGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZmcgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IEZlZWRPcHRpb25zLCBJdGVtIH0gZnJvbSBcImZlZWRcIjtcclxuaW1wb3J0IHsgRmVlZCB9IGZyb20gXCJmZWVkXCI7XHJcblxyXG5jb25zdCBET01BSU4gPSBcImh0dHBzOi8vbG91aWVzdW4uZ2l0aHViLmlvXCI7XHJcbmNvbnN0IEFVVEhPUiA9IHtcclxuICBuYW1lOiBcImxvdWllc3VuXCIsXHJcbiAgZW1haWw6IFwibG91aWUucGluZ3VAb3V0bG9vay5jb21cIixcclxuICBsaW5rOiBET01BSU4sXHJcbn07XHJcbmNvbnN0IE9QVElPTlM6IEZlZWRPcHRpb25zID0ge1xyXG4gIHRpdGxlOiBcIkxvdWllc3VuJ3MgQmxvZ1wiLFxyXG4gIGRlc2NyaXB0aW9uOiBcIkJsb2cgcGFnZSBvZiBsb3VpZXN1bi4gXCIsXHJcbiAgaWQ6IGAke0RPTUFJTn0vYCxcclxuICBsaW5rOiBgJHtET01BSU59L2AsXHJcbiAgY29weXJpZ2h0OiBcIkdGREwgTGljZW5zZVwiLFxyXG4gIGZlZWRMaW5rczoge1xyXG4gICAganNvbjogRE9NQUlOICsgXCIvZmVlZC5qc29uXCIsXHJcbiAgICBhdG9tOiBET01BSU4gKyBcIi9mZWVkLmF0b21cIixcclxuICAgIHJzczogRE9NQUlOICsgXCIvZmVlZC54bWxcIixcclxuICB9LFxyXG4gIGF1dGhvcjogQVVUSE9SLFxyXG4gIGltYWdlOiBET01BSU4rXCIvYWxlcnQuc3ZnXCIsXHJcbiAgZmF2aWNvbjogRE9NQUlOK1wiL2FsZXJ0LnN2Z1wiLFxyXG59O1xyXG5cclxuY29uc3QgbWFya2Rvd24gPSBNYXJrZG93bkl0KHtcclxuICBodG1sOiB0cnVlLFxyXG4gIGJyZWFrczogdHJ1ZSxcclxuICBsaW5raWZ5OiB0cnVlLFxyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZEJsb2dSU1MoKSB7XHJcbiAgY29uc3QgcG9zdHMgPSBhd2FpdCBnZW5lcmF0ZVJTUygpO1xyXG4gIHdyaXRlRmVlZChcImZlZWRcIiwgcG9zdHMpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJTUygpIHtcclxuICBjb25zdCBmaWxlcyA9IGF3YWl0IGZnKFwicG9zdHMvKi5tZFwiKTtcclxuXHJcbiAgY29uc3QgcG9zdHM6IGFueVtdID0gKFxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIGZpbGVzXHJcbiAgICAgICAgLmZpbHRlcigoaSkgPT4gIWkuaW5jbHVkZXMoXCJpbmRleFwiKSlcclxuICAgICAgICAubWFwKGFzeW5jIChpKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByYXcgPSBhd2FpdCBmcy5yZWFkRmlsZShpLCBcInV0Zi04XCIpO1xyXG4gICAgICAgICAgY29uc3QgeyBkYXRhLCBjb250ZW50IH0gPSBtYXR0ZXIocmF3KTtcclxuICAgICAgICAgIGNvbnN0IGh0bWwgPSBtYXJrZG93blxyXG4gICAgICAgICAgICAucmVuZGVyKGNvbnRlbnQpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCdzcmM9XCIvJywgYHNyYz1cIiR7RE9NQUlOfS9gKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5kYXRhLFxyXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShkYXRhLmRhdGUpLFxyXG4gICAgICAgICAgICBjb250ZW50OiBodG1sLFxyXG4gICAgICAgICAgICBhdXRob3I6IFtBVVRIT1JdLFxyXG4gICAgICAgICAgICBsaW5rOiBgJHtET01BSU59LyR7aS5yZXBsYWNlKFwiLm1kXCIsIFwiLmh0bWxcIil9YCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgIClcclxuICApLmZpbHRlcihCb29sZWFuKTtcclxuXHJcbiAgcG9zdHMuc29ydCgoYSwgYikgPT4gK25ldyBEYXRlKGIuZGF0ZSkgLSArbmV3IERhdGUoYS5kYXRlKSk7XHJcbiAgcmV0dXJuIHBvc3RzO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB3cml0ZUZlZWQobmFtZTogc3RyaW5nLCBpdGVtczogSXRlbVtdKSB7XHJcbiAgY29uc3QgZmVlZCA9IG5ldyBGZWVkKE9QVElPTlMpO1xyXG4gIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IGZlZWQuYWRkSXRlbShpdGVtKSk7XHJcblxyXG4gIGF3YWl0IGZzLmVuc3VyZURpcihkaXJuYW1lKGAuLy52aXRlcHJlc3MvZGlzdC8ke25hbWV9YCkpO1xyXG4gIGF3YWl0IGZzLndyaXRlRmlsZShgLi8udml0ZXByZXNzL2Rpc3QvJHtuYW1lfS54bWxgLCBmZWVkLnJzczIoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uYXRvbWAsIGZlZWQuYXRvbTEoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uanNvbmAsIGZlZWQuanNvbjEoKSwgXCJ1dGYtOFwiKTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL2NvbmZpZy50c1wiO2ltcG9ydCB7IGdldFBvc3RzLCBnZXRQb3N0TGVuZ3RoIH0gZnJvbSBcIi4vdGhlbWUvc2VydmVyVXRpbHNcIjtcclxuaW1wb3J0IHsgYnVpbGRCbG9nUlNTIH0gZnJvbSBcIi4vdGhlbWUvcnNzXCI7XHJcbmltcG9ydCB7IHRyYW5zZm9ybWVyVHdvc2xhc2ggfSBmcm9tIFwiQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoXCI7XHJcbmltcG9ydCBtYXRoamF4MyBmcm9tIFwibWFya2Rvd24taXQtbWF0aGpheDNcIjtcclxuaW1wb3J0IG11bHRpbWRfdGFibGVfcGx1Z2luIGZyb20gXCJtYXJrZG93bi1pdC1tdWx0aW1kLXRhYmxlXCI7XHJcbmltcG9ydCBBdXRvU2lkZWJhciBmcm9tICd2aXRlLXBsdWdpbi12aXRlcHJlc3MtYXV0by1zaWRlYmFyJztcclxuaW1wb3J0IHsgaW1nU2l6ZSB9IGZyb20gXCJAbWRpdC9wbHVnaW4taW1nLXNpemVcIjtcclxuaW1wb3J0IHsgZm9vdG5vdGV9IGZyb20gXCJAbWRpdC9wbHVnaW4tZm9vdG5vdGVcIjtcclxuaW1wb3J0IHsgdGFza2xpc3QgfSBmcm9tIFwiQG1kaXQvcGx1Z2luLXRhc2tsaXN0XCI7XHJcblxyXG5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbmZpZygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgbGFuZzogXCJ6aC1DTlwiLFxyXG4gICAgdGl0bGU6IFwiTG91aWVzdW4ncyBCbG9nXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJCbG9nIHBhZ2Ugb2YgbG91aWVzdW4uIFwiLFxyXG4gICAgaGVhZDogW1xyXG4gICAgICBbXHJcbiAgICAgICAgXCJsaW5rXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcmVsOiBcImljb25cIixcclxuICAgICAgICAgIHR5cGU6IFwiaW1hZ2Uvc3ZnXCIsXHJcbiAgICAgICAgICBocmVmOiBcIi9hdmF0b3Iuc3ZnXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwibWV0YVwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5hbWU6IFwiYXV0aG9yXCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIkxvdWllc3VuXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgW1xyXG4gICAgICAgIFwibWV0YVwiLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHByb3BlcnR5OiBcIm9nOnRpdGxlXCIsXHJcbiAgICAgICAgICBjb250ZW50OiBcIkhvbWVcIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJtZXRhXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvcGVydHk6IFwib2c6ZGVzY3JpcHRpb25cIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiQmxvZyBvZiBsb3VpZXN1blwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICBdLFxyXG4gICAgLy8gY2xlYW5VcmxzOiBcIndpdGgtc3ViZm9sZGVyc1wiLFxyXG4gICAgbGFzdFVwZGF0ZWQ6IGZhbHNlLFxyXG4gICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgLy8gcmVwbzogXCJjbGFyay1jdWkvaG9tZVNpdGVcIixcclxuICAgICAgbG9nbzogXCIvYXZhdG9yLnN2Z1wiLFxyXG4gICAgICBhdmF0b3I6IFwiL2F2YXRvci5zdmdcIixcclxuICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgcHJvdmlkZXI6IFwibG9jYWxcIixcclxuICAgICAgfSxcclxuICAgICAgZG9jc0RpcjogXCIvXCIsXHJcbiAgICAgIC8vIGRvY3NCcmFuY2g6IFwibWFzdGVyXCIsXHJcbiAgICAgIHBvc3RzOiBhd2FpdCBnZXRQb3N0cygpLFxyXG4gICAgICBwYWdlU2l6ZTogNSxcclxuICAgICAgcG9zdExlbmd0aDogYXdhaXQgZ2V0UG9zdExlbmd0aCgpLFxyXG4gICAgICBuYXY6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1RDgzQ1x1REZFMUJsb2dzXCIsXHJcbiAgICAgICAgICBsaW5rOiBcIi9cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHVEODNEXHVERDE2VGFnc1wiLFxyXG4gICAgICAgICAgbGluazogXCIvdGFnc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdURDQzNBcmNoaXZlc1wiLFxyXG4gICAgICAgICAgbGluazogXCIvYXJjaGl2ZXNcIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHVEODNEXHVERDI1UlNTXCIsXHJcbiAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vbG91aWVzdW4uZ2l0aHViLmlvL2ZlZWQueG1sXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgc29jaWFsTGlua3M6IFtcclxuICAgICAgICB7IGljb246IFwiZ2l0aHViXCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xvdWllc3VuXCIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgIHN2ZzogYDxzdmcgcm9sZT1cImltZ1wiIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIj5cclxuICAgICAgICAgICAgPHBhdGggZD1cIk04NzQuNjY2NjY3IDM3NS4xODkzMzNWNzQ2LjY2NjY2N2E2NCA2NCAwIDAgMS02NCA2NEgyMTMuMzMzMzMzYTY0IDY0IDAgMCAxLTY0LTY0VjM3NS4xODkzMzNsMjY2LjA5MDY2NyAyMjUuNmExNDkuMzMzMzMzIDE0OS4zMzMzMzMgMCAwIDAgMTkzLjE1MiAwTDg3NC42NjY2NjcgMzc1LjE4OTMzM3pNODEwLjY2NjY2NyAyMTMuMzMzMzMzYTY0Ljc4OTMzMyA2NC43ODkzMzMgMCAwIDEgMjIuODI2NjY2IDQuMTgxMzM0IDYzLjYxNiA2My42MTYgMCAwIDEgMjYuNzk0NjY3IDE5LjQxMzMzMyA2NC4zMiA2NC4zMiAwIDAgMSA5LjM0NCAxNS40NjY2NjdjMi43NzMzMzMgNi41NzA2NjcgNC40OCAxMy42OTYgNC45MDY2NjcgMjEuMTg0TDg3NC42NjY2NjcgMjc3LjMzMzMzM3YyMS4zMzMzMzRMNTUzLjUzNiA1NzIuNTg2NjY3YTY0IDY0IDAgMCAxLTc5Ljg5MzMzMyAyLjUzODY2NmwtMy4xNzg2NjctMi41NkwxNDkuMzMzMzMzIDI5OC42NjY2Njd2LTIxLjMzMzMzNGE2My43ODY2NjcgNjMuNzg2NjY3IDAgMCAxIDM1LjEzNi01Ny4xMzA2NjZBNjMuODcyIDYzLjg3MiAwIDAgMSAyMTMuMzMzMzMzIDIxMy4zMzMzMzNoNTk3LjMzMzMzNHpcIiA+PC9wYXRoPlxyXG4gICAgICAgICAgICA8L3N2Zz5gLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGxpbms6IFwibWFpbHRvOmxvdWllLnBpbmd1QG91dGxvb2suY29tXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgLy8gb3V0bGluZTogMiwgLy9cdThCQkVcdTdGNkVcdTUzRjNcdTRGQTdhc2lkZVx1NjYzRVx1NzkzQVx1NUM0Mlx1N0VBN1xyXG4gICAgICBhc2lkZTogZmFsc2UsXHJcbiAgICAgIC8vIGJsb2dzIHBhZ2Ugc2hvdyBmaXJld29rcnMgYW5pbWF0aW9uXHJcbiAgICAgIHNob3dGaXJld29ya3NBbmltYXRpb246IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIGJ1aWxkRW5kOiBidWlsZEJsb2dSU1MsXHJcbiAgICBtYXJrZG93bjoge1xyXG4gICAgICB0aGVtZToge1xyXG4gICAgICAgIGxpZ2h0OiBcInZpdGVzc2UtbGlnaHRcIixcclxuICAgICAgICBkYXJrOiBcInZpdGVzc2UtZGFya1wiLFxyXG4gICAgICB9LFxyXG4gICAgICBjb2RlVHJhbnNmb3JtZXJzOiBbdHJhbnNmb3JtZXJUd29zbGFzaCgpXSxcclxuICAgICAgY29uZmlnOiAobWQpID0+IHtcclxuICAgICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY2RjRcdTU5MUFcdTc2ODQgTWFya2Rvd24taXQgXHU2M0QyXHU0RUY2XHVGRjAxXHJcbiAgICAgICAgbWQudXNlKG11bHRpbWRfdGFibGVfcGx1Z2luLCB7XHJcbiAgICAgICAgICBtdWx0aWxpbmU6IHRydWUsXHJcbiAgICAgICAgICByb3dzcGFuOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1kLnVzZShtYXRoamF4Myk7XHJcbiAgICAgICAgbWQudXNlKGltZ1NpemUpO1xyXG4gICAgICAgIG1kLnVzZShmb290bm90ZSk7XHJcbiAgICAgICAgbWQudXNlKHRhc2tsaXN0KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHZ1ZToge1xyXG4gICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgaXNDdXN0b21FbGVtZW50OiAodGFnKSA9PiBjdXN0b21FbGVtZW50cy5pbmNsdWRlcyh0YWcpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgdml0ZToge1xyXG4gICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgLy8gYWRkIHBsdWdpblxyXG4gICAgICAgIEF1dG9TaWRlYmFyKHtcclxuICAgICAgICAgIHBhdGg6ICcvJyxcclxuICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICB9KVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnKCk7XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZULFNBQVEsY0FBYTtBQUNsVixPQUFPLFlBQVk7QUFDbkIsT0FBTyxRQUFRO0FBR2YsZUFBc0IsV0FBVztBQUMvQixNQUFJLFFBQVEsTUFBTSxtQkFBbUI7QUFDckMsTUFBSSxRQUFRLE1BQU0sUUFBUTtBQUFBLElBQ3hCLE1BQU0sSUFBSSxPQUFPLFNBQVM7QUFDeEIsWUFBTSxVQUFVLE1BQU0sR0FBRyxTQUFTLE1BQU0sT0FBTztBQUMvQyxZQUFNLEVBQUUsS0FBSyxJQUFJLE9BQU8sT0FBTztBQUMvQixXQUFLLE9BQU8sYUFBYSxLQUFLLElBQUk7QUFDbEMsYUFBTztBQUFBLFFBQ0wsYUFBYTtBQUFBLFFBQ2IsYUFBYSxJQUFJLEtBQUssUUFBUSxPQUFPLE9BQU8sQ0FBQztBQUFBLE1BQy9DO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNBLFFBQU0sS0FBSyxZQUFZO0FBQ3ZCLFNBQU87QUFDVDtBQUVBLFNBQVMsYUFBYSxRQUFPLG9CQUFJLEtBQUssR0FBRSxTQUFTLEdBQUc7QUFDbEQsUUFBTSxZQUFZLElBQUksS0FBSyxJQUFJLEVBQUUsT0FBTztBQUN4QyxTQUFPLFVBQVUsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUMvQjtBQUVBLFNBQVMsYUFBYSxNQUFNLE1BQU07QUFDaEMsU0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxJQUFJO0FBQzdEO0FBRUEsZUFBZSxxQkFBcUI7QUFDbEMsTUFBSSxRQUFRLE1BQU0sT0FBTyxDQUFDLE9BQU8sR0FBRztBQUFBLElBQ2xDLFFBQVEsQ0FBQyxnQkFBZ0IsV0FBVztBQUFBLEVBQ3RDLENBQUM7QUFDRCxT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SUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsTUFDSjtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsVUFBVTtBQUFBLFVBQ1YsU0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxVQUFVO0FBQUEsVUFDVixTQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLGFBQWE7QUFBQSxJQUNiLGFBQWE7QUFBQTtBQUFBLE1BRVgsTUFBTTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLFFBQ04sVUFBVTtBQUFBLE1BQ1o7QUFBQSxNQUNBLFNBQVM7QUFBQTtBQUFBLE1BRVQsT0FBTyxNQUFNLFNBQVM7QUFBQSxNQUN0QixVQUFVO0FBQUEsTUFDVixZQUFZLE1BQU0sY0FBYztBQUFBLE1BQ2hDLEtBQUs7QUFBQSxRQUNIO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGFBQWE7QUFBQSxRQUNYLEVBQUUsTUFBTSxVQUFVLE1BQU0sOEJBQThCO0FBQUEsUUFDdEQ7QUFBQSxVQUNFLE1BQU07QUFBQSxZQUNKLEtBQUs7QUFBQTtBQUFBO0FBQUEsVUFHUDtBQUFBLFVBQ0EsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUE7QUFBQSxNQUVBLE9BQU87QUFBQTtBQUFBLE1BRVAsd0JBQXdCO0FBQUEsSUFDMUI7QUFBQSxJQUNBLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxNQUNSLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxNQUNSO0FBQUEsTUFDQSxrQkFBa0IsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ3hDLFFBQVEsQ0FBQyxPQUFPO0FBRWQsV0FBRyxJQUFJLHNCQUFzQjtBQUFBLFVBQzNCLFdBQVc7QUFBQSxVQUNYLFNBQVM7QUFBQSxRQUNYLENBQUM7QUFDRCxXQUFHLElBQUksUUFBUTtBQUNmLFdBQUcsSUFBSSxPQUFPO0FBQ2QsV0FBRyxJQUFJLFFBQVE7QUFDZixXQUFHLElBQUksUUFBUTtBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsVUFBVTtBQUFBLFFBQ1IsaUJBQWlCO0FBQUEsVUFDZixpQkFBaUIsQ0FBQyxRQUFRLGVBQWUsU0FBUyxHQUFHO0FBQUEsUUFDdkQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBO0FBQUEsUUFFUCxZQUFZO0FBQUEsVUFDVixNQUFNO0FBQUEsVUFDTixXQUFXO0FBQUEsUUFDYixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFDQSxJQUFPLGlCQUFRLE9BQU87IiwKICAibmFtZXMiOiBbImZzIiwgIm1hdHRlciIsICJmcyIsICJtYXR0ZXIiXQp9Cg==
