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
import AutoSidebar from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/vite-plugin-vitepress-auto-sidebar@1.6.5_eslint@8.57.0_typescript@5.4.5_vite@5.2.12_vitepress_ojmld5eog22li3az34kaeiqtuq/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
import { imgSize } from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/@mdit+plugin-img-size@0.12.0_markdown-it@14.1.0/node_modules/@mdit/plugin-img-size/lib/index.js";
var customElements = [
  "math",
  "maction",
  "maligngroup",
  "malignmark",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mi",
  "mlongdiv",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mscarries",
  "mscarry",
  "mscarries",
  "msgroup",
  "mstack",
  "mlongdiv",
  "msline",
  "mstack",
  "mspace",
  "msqrt",
  "msrow",
  "mstack",
  "mstack",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "semantics",
  "math",
  "mi",
  "mn",
  "mo",
  "ms",
  "mspace",
  "mtext",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "msqrt",
  "mstyle",
  "mmultiscripts",
  "mover",
  "mprescripts",
  "msub",
  "msubsup",
  "msup",
  "munder",
  "munderover",
  "none",
  "maligngroup",
  "malignmark",
  "mtable",
  "mtd",
  "mtr",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "msline",
  "msrow",
  "mstack",
  "maction",
  "semantics",
  "annotation",
  "annotation-xml"
];
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
          type: "image/png",
          href: "/avator.png"
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
      logo: "/avator.png",
      avator: "/avator.png",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy90aGVtZS9zZXJ2ZXJVdGlscy50cyIsICIudml0ZXByZXNzL3RoZW1lL3Jzcy50cyIsICIudml0ZXByZXNzL2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxcc2VydmVyVXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FQUFMvbG91aWVzdW4uZ2l0aHViLmlvLy52aXRlcHJlc3MvdGhlbWUvc2VydmVyVXRpbHMudHNcIjtpbXBvcnQge2dsb2JieX0gZnJvbSAnZ2xvYmJ5JztcclxuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmcy1leHRyYVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvc3RzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdldFBvc3RNREZpbGVQYXRocygpO1xyXG4gIGxldCBwb3N0cyA9IGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgcGF0aHMubWFwKGFzeW5jIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZShpdGVtLCBcInV0Zi04XCIpO1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG1hdHRlcihjb250ZW50KTtcclxuICAgICAgZGF0YS5kYXRlID0gX2NvbnZlcnREYXRlKGRhdGEuZGF0ZSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgZnJvbnRNYXR0ZXI6IGRhdGEsXHJcbiAgICAgICAgcmVndWxhclBhdGg6IGAvJHtpdGVtLnJlcGxhY2UoXCIubWRcIiwgXCIuaHRtbFwiKX1gLFxyXG4gICAgICB9O1xyXG4gICAgfSlcclxuICApO1xyXG4gIHBvc3RzLnNvcnQoX2NvbXBhcmVEYXRlKTtcclxuICByZXR1cm4gcG9zdHM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb252ZXJ0RGF0ZShkYXRlID0gbmV3IERhdGUoKS50b1N0cmluZygpKSB7XHJcbiAgY29uc3QganNvbl9kYXRlID0gbmV3IERhdGUoZGF0ZSkudG9KU09OKCk7XHJcbiAgcmV0dXJuIGpzb25fZGF0ZS5zcGxpdChcIlRcIilbMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9jb21wYXJlRGF0ZShvYmoxLCBvYmoyKSB7XHJcbiAgcmV0dXJuIG9iajEuZnJvbnRNYXR0ZXIuZGF0ZSA8IG9iajIuZnJvbnRNYXR0ZXIuZGF0ZSA/IDEgOiAtMTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gZ2V0UG9zdE1ERmlsZVBhdGhzKCkge1xyXG4gIGxldCBwYXRocyA9IGF3YWl0IGdsb2JieShbXCIqKi5tZFwiXSwge1xyXG4gICAgaWdub3JlOiBbXCJub2RlX21vZHVsZXNcIiwgXCJSRUFETUUubWRcIl0sXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHBhdGhzLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmNsdWRlcyhcInBvc3RzL1wiKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQb3N0TGVuZ3RoKCkge1xyXG4gIC8vIGdldFBvc3RNREZpbGVQYXRoIHJldHVybiB0eXBlIGlzIG9iamVjdCBub3QgYXJyYXlcclxuICByZXR1cm4gWy4uLihhd2FpdCBnZXRQb3N0TURGaWxlUGF0aHMoKSldLmxlbmd0aDtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxccnNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL3RoZW1lL3Jzcy50c1wiO2ltcG9ydCB7IGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgZmcgZnJvbSBcImZhc3QtZ2xvYlwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XHJcbmltcG9ydCBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IEZlZWRPcHRpb25zLCBJdGVtIH0gZnJvbSBcImZlZWRcIjtcclxuaW1wb3J0IHsgRmVlZCB9IGZyb20gXCJmZWVkXCI7XHJcblxyXG5jb25zdCBET01BSU4gPSBcImh0dHBzOi8vbG91aWVzdW4uZ2l0aHViLmlvXCI7XHJcbmNvbnN0IEFVVEhPUiA9IHtcclxuICBuYW1lOiBcImxvdWllc3VuXCIsXHJcbiAgZW1haWw6IFwibG91aWUucGluZ3VAb3V0bG9vay5jb21cIixcclxuICBsaW5rOiBET01BSU4sXHJcbn07XHJcbmNvbnN0IE9QVElPTlM6IEZlZWRPcHRpb25zID0ge1xyXG4gIHRpdGxlOiBcIkxvdWllc3VuJ3MgQmxvZ1wiLFxyXG4gIGRlc2NyaXB0aW9uOiBcIkJsb2cgcGFnZSBvZiBsb3VpZXN1bi4gXCIsXHJcbiAgaWQ6IGAke0RPTUFJTn0vYCxcclxuICBsaW5rOiBgJHtET01BSU59L2AsXHJcbiAgY29weXJpZ2h0OiBcIkdGREwgTGljZW5zZVwiLFxyXG4gIGZlZWRMaW5rczoge1xyXG4gICAganNvbjogRE9NQUlOICsgXCIvZmVlZC5qc29uXCIsXHJcbiAgICBhdG9tOiBET01BSU4gKyBcIi9mZWVkLmF0b21cIixcclxuICAgIHJzczogRE9NQUlOICsgXCIvZmVlZC54bWxcIixcclxuICB9LFxyXG4gIGF1dGhvcjogQVVUSE9SLFxyXG4gIGltYWdlOiBET01BSU4rXCIvYWxlcnQuc3ZnXCIsXHJcbiAgZmF2aWNvbjogRE9NQUlOK1wiL2FsZXJ0LnN2Z1wiLFxyXG59O1xyXG5cclxuY29uc3QgbWFya2Rvd24gPSBNYXJrZG93bkl0KHtcclxuICBodG1sOiB0cnVlLFxyXG4gIGJyZWFrczogdHJ1ZSxcclxuICBsaW5raWZ5OiB0cnVlLFxyXG59KTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZEJsb2dSU1MoKSB7XHJcbiAgY29uc3QgcG9zdHMgPSBhd2FpdCBnZW5lcmF0ZVJTUygpO1xyXG4gIHdyaXRlRmVlZChcImZlZWRcIiwgcG9zdHMpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJTUygpIHtcclxuICBjb25zdCBmaWxlcyA9IGF3YWl0IGZnKFwicG9zdHMvKi5tZFwiKTtcclxuXHJcbiAgY29uc3QgcG9zdHM6IGFueVtdID0gKFxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIGZpbGVzXHJcbiAgICAgICAgLmZpbHRlcigoaSkgPT4gIWkuaW5jbHVkZXMoXCJpbmRleFwiKSlcclxuICAgICAgICAubWFwKGFzeW5jIChpKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByYXcgPSBhd2FpdCBmcy5yZWFkRmlsZShpLCBcInV0Zi04XCIpO1xyXG4gICAgICAgICAgY29uc3QgeyBkYXRhLCBjb250ZW50IH0gPSBtYXR0ZXIocmF3KTtcclxuICAgICAgICAgIGNvbnN0IGh0bWwgPSBtYXJrZG93blxyXG4gICAgICAgICAgICAucmVuZGVyKGNvbnRlbnQpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKCdzcmM9XCIvJywgYHNyYz1cIiR7RE9NQUlOfS9gKTtcclxuXHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAuLi5kYXRhLFxyXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShkYXRhLmRhdGUpLFxyXG4gICAgICAgICAgICBjb250ZW50OiBodG1sLFxyXG4gICAgICAgICAgICBhdXRob3I6IFtBVVRIT1JdLFxyXG4gICAgICAgICAgICBsaW5rOiBgJHtET01BSU59LyR7aS5yZXBsYWNlKFwiLm1kXCIsIFwiLmh0bWxcIil9YCxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgIClcclxuICApLmZpbHRlcihCb29sZWFuKTtcclxuXHJcbiAgcG9zdHMuc29ydCgoYSwgYikgPT4gK25ldyBEYXRlKGIuZGF0ZSkgLSArbmV3IERhdGUoYS5kYXRlKSk7XHJcbiAgcmV0dXJuIHBvc3RzO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiB3cml0ZUZlZWQobmFtZTogc3RyaW5nLCBpdGVtczogSXRlbVtdKSB7XHJcbiAgY29uc3QgZmVlZCA9IG5ldyBGZWVkKE9QVElPTlMpO1xyXG4gIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IGZlZWQuYWRkSXRlbShpdGVtKSk7XHJcblxyXG4gIGF3YWl0IGZzLmVuc3VyZURpcihkaXJuYW1lKGAuLy52aXRlcHJlc3MvZGlzdC8ke25hbWV9YCkpO1xyXG4gIGF3YWl0IGZzLndyaXRlRmlsZShgLi8udml0ZXByZXNzL2Rpc3QvJHtuYW1lfS54bWxgLCBmZWVkLnJzczIoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uYXRvbWAsIGZlZWQuYXRvbTEoKSwgXCJ1dGYtOFwiKTtcclxuICBhd2FpdCBmcy53cml0ZUZpbGUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX0uanNvbmAsIGZlZWQuanNvbjEoKSwgXCJ1dGYtOFwiKTtcclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL2NvbmZpZy50c1wiO2ltcG9ydCB7IGdldFBvc3RzLCBnZXRQb3N0TGVuZ3RoIH0gZnJvbSBcIi4vdGhlbWUvc2VydmVyVXRpbHNcIjtcclxuaW1wb3J0IHsgYnVpbGRCbG9nUlNTIH0gZnJvbSBcIi4vdGhlbWUvcnNzXCI7XHJcbmltcG9ydCB7IHRyYW5zZm9ybWVyVHdvc2xhc2ggfSBmcm9tIFwiQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoXCI7XHJcbmltcG9ydCBtYXRoamF4MyBmcm9tIFwibWFya2Rvd24taXQtbWF0aGpheDNcIjtcclxuaW1wb3J0IG11bHRpbWRfdGFibGVfcGx1Z2luIGZyb20gXCJtYXJrZG93bi1pdC1tdWx0aW1kLXRhYmxlXCI7XHJcbmltcG9ydCBBdXRvU2lkZWJhciBmcm9tICd2aXRlLXBsdWdpbi12aXRlcHJlc3MtYXV0by1zaWRlYmFyJztcclxuaW1wb3J0IHsgaW1nU2l6ZSB9IGZyb20gXCJAbWRpdC9wbHVnaW4taW1nLXNpemVcIjtcclxuXHJcblxyXG5jb25zdCBjdXN0b21FbGVtZW50cyA9IFtcclxuICAnbWF0aCcsXHJcbiAgJ21hY3Rpb24nLFxyXG4gICdtYWxpZ25ncm91cCcsXHJcbiAgJ21hbGlnbm1hcmsnLFxyXG4gICdtZW5jbG9zZScsXHJcbiAgJ21lcnJvcicsXHJcbiAgJ21mZW5jZWQnLFxyXG4gICdtZnJhYycsXHJcbiAgJ21pJyxcclxuICAnbWxvbmdkaXYnLFxyXG4gICdtbXVsdGlzY3JpcHRzJyxcclxuICAnbW4nLFxyXG4gICdtbycsXHJcbiAgJ21vdmVyJyxcclxuICAnbXBhZGRlZCcsXHJcbiAgJ21waGFudG9tJyxcclxuICAnbXJvb3QnLFxyXG4gICdtcm93JyxcclxuICAnbXMnLFxyXG4gICdtc2NhcnJpZXMnLFxyXG4gICdtc2NhcnJ5JyxcclxuICAnbXNjYXJyaWVzJyxcclxuICAnbXNncm91cCcsXHJcbiAgJ21zdGFjaycsXHJcbiAgJ21sb25nZGl2JyxcclxuICAnbXNsaW5lJyxcclxuICAnbXN0YWNrJyxcclxuICAnbXNwYWNlJyxcclxuICAnbXNxcnQnLFxyXG4gICdtc3JvdycsXHJcbiAgJ21zdGFjaycsXHJcbiAgJ21zdGFjaycsXHJcbiAgJ21zdHlsZScsXHJcbiAgJ21zdWInLFxyXG4gICdtc3VwJyxcclxuICAnbXN1YnN1cCcsXHJcbiAgJ210YWJsZScsXHJcbiAgJ210ZCcsXHJcbiAgJ210ZXh0JyxcclxuICAnbXRyJyxcclxuICAnbXVuZGVyJyxcclxuICAnbXVuZGVyb3ZlcicsXHJcbiAgJ3NlbWFudGljcycsXHJcbiAgJ21hdGgnLFxyXG4gICdtaScsXHJcbiAgJ21uJyxcclxuICAnbW8nLFxyXG4gICdtcycsXHJcbiAgJ21zcGFjZScsXHJcbiAgJ210ZXh0JyxcclxuICAnbWVuY2xvc2UnLFxyXG4gICdtZXJyb3InLFxyXG4gICdtZmVuY2VkJyxcclxuICAnbWZyYWMnLFxyXG4gICdtcGFkZGVkJyxcclxuICAnbXBoYW50b20nLFxyXG4gICdtcm9vdCcsXHJcbiAgJ21yb3cnLFxyXG4gICdtc3FydCcsXHJcbiAgJ21zdHlsZScsXHJcbiAgJ21tdWx0aXNjcmlwdHMnLFxyXG4gICdtb3ZlcicsXHJcbiAgJ21wcmVzY3JpcHRzJyxcclxuICAnbXN1YicsXHJcbiAgJ21zdWJzdXAnLFxyXG4gICdtc3VwJyxcclxuICAnbXVuZGVyJyxcclxuICAnbXVuZGVyb3ZlcicsXHJcbiAgJ25vbmUnLFxyXG4gICdtYWxpZ25ncm91cCcsXHJcbiAgJ21hbGlnbm1hcmsnLFxyXG4gICdtdGFibGUnLFxyXG4gICdtdGQnLFxyXG4gICdtdHInLFxyXG4gICdtbG9uZ2RpdicsXHJcbiAgJ21zY2FycmllcycsXHJcbiAgJ21zY2FycnknLFxyXG4gICdtc2dyb3VwJyxcclxuICAnbXNsaW5lJyxcclxuICAnbXNyb3cnLFxyXG4gICdtc3RhY2snLFxyXG4gICdtYWN0aW9uJyxcclxuICAnc2VtYW50aWNzJyxcclxuICAnYW5ub3RhdGlvbicsXHJcbiAgJ2Fubm90YXRpb24teG1sJ1xyXG5dO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29uZmlnKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICBsYW5nOiBcInpoLUNOXCIsXHJcbiAgICB0aXRsZTogXCJMb3VpZXN1bidzIEJsb2dcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIkJsb2cgcGFnZSBvZiBsb3VpZXN1bi4gXCIsXHJcbiAgICBoZWFkOiBbXHJcbiAgICAgIFtcclxuICAgICAgICBcImxpbmtcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICByZWw6IFwiaWNvblwiLFxyXG4gICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIGhyZWY6IFwiL2F2YXRvci5wbmdcIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJtZXRhXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJhdXRob3JcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiTG91aWVzdW5cIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBbXHJcbiAgICAgICAgXCJtZXRhXCIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgcHJvcGVydHk6IFwib2c6dGl0bGVcIixcclxuICAgICAgICAgIGNvbnRlbnQ6IFwiSG9tZVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF0sXHJcbiAgICAgIFtcclxuICAgICAgICBcIm1ldGFcIixcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm9wZXJ0eTogXCJvZzpkZXNjcmlwdGlvblwiLFxyXG4gICAgICAgICAgY29udGVudDogXCJCbG9nIG9mIGxvdWllc3VuXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIF0sXHJcbiAgICAvLyBjbGVhblVybHM6IFwid2l0aC1zdWJmb2xkZXJzXCIsXHJcbiAgICBsYXN0VXBkYXRlZDogZmFsc2UsXHJcbiAgICB0aGVtZUNvbmZpZzoge1xyXG4gICAgICAvLyByZXBvOiBcImNsYXJrLWN1aS9ob21lU2l0ZVwiLFxyXG4gICAgICBsb2dvOiBcIi9hdmF0b3IucG5nXCIsXHJcbiAgICAgIGF2YXRvcjogXCIvYXZhdG9yLnBuZ1wiLFxyXG4gICAgICBzZWFyY2g6IHtcclxuICAgICAgICBwcm92aWRlcjogXCJsb2NhbFwiLFxyXG4gICAgICB9LFxyXG4gICAgICBkb2NzRGlyOiBcIi9cIixcclxuICAgICAgLy8gZG9jc0JyYW5jaDogXCJtYXN0ZXJcIixcclxuICAgICAgcG9zdHM6IGF3YWl0IGdldFBvc3RzKCksXHJcbiAgICAgIHBhZ2VTaXplOiA1LFxyXG4gICAgICBwb3N0TGVuZ3RoOiBhd2FpdCBnZXRQb3N0TGVuZ3RoKCksXHJcbiAgICAgIG5hdjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6IFwiXHVEODNDXHVERkUxQmxvZ3NcIixcclxuICAgICAgICAgIGxpbms6IFwiL1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdUREMTZUYWdzXCIsXHJcbiAgICAgICAgICBsaW5rOiBcIi90YWdzXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiBcIlx1RDgzRFx1RENDM0FyY2hpdmVzXCIsXHJcbiAgICAgICAgICBsaW5rOiBcIi9hcmNoaXZlc1wiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdUREMjVSU1NcIixcclxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9sb3VpZXN1bi5naXRodWIuaW8vZmVlZC54bWxcIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBzb2NpYWxMaW5rczogW1xyXG4gICAgICAgIHsgaWNvbjogXCJnaXRodWJcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbG91aWVzdW5cIiB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGljb246IHtcclxuICAgICAgICAgICAgc3ZnOiBgPHN2ZyByb2xlPVwiaW1nXCIgdmlld0JveD1cIjAgMCAxMDI0IDEwMjRcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMFwiPlxyXG4gICAgICAgICAgICA8cGF0aCBkPVwiTTg3NC42NjY2NjcgMzc1LjE4OTMzM1Y3NDYuNjY2NjY3YTY0IDY0IDAgMCAxLTY0IDY0SDIxMy4zMzMzMzNhNjQgNjQgMCAwIDEtNjQtNjRWMzc1LjE4OTMzM2wyNjYuMDkwNjY3IDIyNS42YTE0OS4zMzMzMzMgMTQ5LjMzMzMzMyAwIDAgMCAxOTMuMTUyIDBMODc0LjY2NjY2NyAzNzUuMTg5MzMzek04MTAuNjY2NjY3IDIxMy4zMzMzMzNhNjQuNzg5MzMzIDY0Ljc4OTMzMyAwIDAgMSAyMi44MjY2NjYgNC4xODEzMzQgNjMuNjE2IDYzLjYxNiAwIDAgMSAyNi43OTQ2NjcgMTkuNDEzMzMzIDY0LjMyIDY0LjMyIDAgMCAxIDkuMzQ0IDE1LjQ2NjY2N2MyLjc3MzMzMyA2LjU3MDY2NyA0LjQ4IDEzLjY5NiA0LjkwNjY2NyAyMS4xODRMODc0LjY2NjY2NyAyNzcuMzMzMzMzdjIxLjMzMzMzNEw1NTMuNTM2IDU3Mi41ODY2NjdhNjQgNjQgMCAwIDEtNzkuODkzMzMzIDIuNTM4NjY2bC0zLjE3ODY2Ny0yLjU2TDE0OS4zMzMzMzMgMjk4LjY2NjY2N3YtMjEuMzMzMzM0YTYzLjc4NjY2NyA2My43ODY2NjcgMCAwIDEgMzUuMTM2LTU3LjEzMDY2NkE2My44NzIgNjMuODcyIDAgMCAxIDIxMy4zMzMzMzMgMjEzLjMzMzMzM2g1OTcuMzMzMzM0elwiID48L3BhdGg+XHJcbiAgICAgICAgICAgIDwvc3ZnPmAsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbGluazogXCJtYWlsdG86bG91aWUucGluZ3VAb3V0bG9vay5jb21cIixcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICAvLyBvdXRsaW5lOiAyLCAvL1x1OEJCRVx1N0Y2RVx1NTNGM1x1NEZBN2FzaWRlXHU2NjNFXHU3OTNBXHU1QzQyXHU3RUE3XHJcbiAgICAgIGFzaWRlOiBmYWxzZSxcclxuICAgICAgLy8gYmxvZ3MgcGFnZSBzaG93IGZpcmV3b2tycyBhbmltYXRpb25cclxuICAgICAgc2hvd0ZpcmV3b3Jrc0FuaW1hdGlvbjogZmFsc2UsXHJcbiAgICB9LFxyXG4gICAgYnVpbGRFbmQ6IGJ1aWxkQmxvZ1JTUyxcclxuICAgIG1hcmtkb3duOiB7XHJcbiAgICAgIHRoZW1lOiB7XHJcbiAgICAgICAgbGlnaHQ6IFwidml0ZXNzZS1saWdodFwiLFxyXG4gICAgICAgIGRhcms6IFwidml0ZXNzZS1kYXJrXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNvZGVUcmFuc2Zvcm1lcnM6IFt0cmFuc2Zvcm1lclR3b3NsYXNoKCldLFxyXG4gICAgICBjb25maWc6IChtZCkgPT4ge1xyXG4gICAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjZGNFx1NTkxQVx1NzY4NCBNYXJrZG93bi1pdCBcdTYzRDJcdTRFRjZcdUZGMDFcclxuICAgICAgICBtZC51c2UobXVsdGltZF90YWJsZV9wbHVnaW4sIHtcclxuICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcclxuICAgICAgICAgIHJvd3NwYW46IHRydWUsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWQudXNlKG1hdGhqYXgzKTtcclxuICAgICAgICBtZC51c2UoaW1nU2l6ZSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2dWU6IHtcclxuICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcclxuICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogKHRhZykgPT4gY3VzdG9tRWxlbWVudHMuaW5jbHVkZXModGFnKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHZpdGU6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIC8vIGFkZCBwbHVnaW5cclxuICAgICAgICBBdXRvU2lkZWJhcih7XHJcbiAgICAgICAgICBwYXRoOiAnLycsXHJcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgfSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICB9O1xyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZygpO1xyXG5cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VCxTQUFRLGNBQWE7QUFDbFYsT0FBTyxZQUFZO0FBQ25CLE9BQU8sUUFBUTtBQUdmLGVBQXNCLFdBQVc7QUFDL0IsTUFBSSxRQUFRLE1BQU0sbUJBQW1CO0FBQ3JDLE1BQUksUUFBUSxNQUFNLFFBQVE7QUFBQSxJQUN4QixNQUFNLElBQUksT0FBTyxTQUFTO0FBQ3hCLFlBQU0sVUFBVSxNQUFNLEdBQUcsU0FBUyxNQUFNLE9BQU87QUFDL0MsWUFBTSxFQUFFLEtBQUssSUFBSSxPQUFPLE9BQU87QUFDL0IsV0FBSyxPQUFPLGFBQWEsS0FBSyxJQUFJO0FBQ2xDLGFBQU87QUFBQSxRQUNMLGFBQWE7QUFBQSxRQUNiLGFBQWEsSUFBSSxLQUFLLFFBQVEsT0FBTyxPQUFPLENBQUM7QUFBQSxNQUMvQztBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFDQSxRQUFNLEtBQUssWUFBWTtBQUN2QixTQUFPO0FBQ1Q7QUFFQSxTQUFTLGFBQWEsUUFBTyxvQkFBSSxLQUFLLEdBQUUsU0FBUyxHQUFHO0FBQ2xELFFB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
