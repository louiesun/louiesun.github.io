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
import AutoSidebar from "file:///D:/APPS/louiesun.github.io/node_modules/.pnpm/vite-plugin-vitepress-auto-sidebar@1.6.5_eslint@8.57.0_typescript@5.4.5_vite@5.2.12_vitepress_lgczdya3k5525sdzq2y7gonmwy/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy90aGVtZS9zZXJ2ZXJVdGlscy50cyIsICIudml0ZXByZXNzL3RoZW1lL3Jzcy50cyIsICIudml0ZXByZXNzL2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxcc2VydmVyVXRpbHMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0FQUFMvbG91aWVzdW4uZ2l0aHViLmlvLy52aXRlcHJlc3MvdGhlbWUvc2VydmVyVXRpbHMudHNcIjtpbXBvcnQge2dsb2JieX0gZnJvbSAnZ2xvYmJ5JztcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UG9zdHMoKSB7XG4gIGxldCBwYXRocyA9IGF3YWl0IGdldFBvc3RNREZpbGVQYXRocygpO1xuICBsZXQgcG9zdHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBwYXRocy5tYXAoYXN5bmMgKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZShpdGVtLCBcInV0Zi04XCIpO1xuICAgICAgY29uc3QgeyBkYXRhIH0gPSBtYXR0ZXIoY29udGVudCk7XG4gICAgICBkYXRhLmRhdGUgPSBfY29udmVydERhdGUoZGF0YS5kYXRlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyb250TWF0dGVyOiBkYXRhLFxuICAgICAgICByZWd1bGFyUGF0aDogYC8ke2l0ZW0ucmVwbGFjZShcIi5tZFwiLCBcIi5odG1sXCIpfWAsXG4gICAgICB9O1xuICAgIH0pXG4gICk7XG4gIHBvc3RzLnNvcnQoX2NvbXBhcmVEYXRlKTtcbiAgcmV0dXJuIHBvc3RzO1xufVxuXG5mdW5jdGlvbiBfY29udmVydERhdGUoZGF0ZSA9IG5ldyBEYXRlKCkudG9TdHJpbmcoKSkge1xuICBjb25zdCBqc29uX2RhdGUgPSBuZXcgRGF0ZShkYXRlKS50b0pTT04oKTtcbiAgcmV0dXJuIGpzb25fZGF0ZS5zcGxpdChcIlRcIilbMF07XG59XG5cbmZ1bmN0aW9uIF9jb21wYXJlRGF0ZShvYmoxLCBvYmoyKSB7XG4gIHJldHVybiBvYmoxLmZyb250TWF0dGVyLmRhdGUgPCBvYmoyLmZyb250TWF0dGVyLmRhdGUgPyAxIDogLTE7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBvc3RNREZpbGVQYXRocygpIHtcbiAgbGV0IHBhdGhzID0gYXdhaXQgZ2xvYmJ5KFtcIioqLm1kXCJdLCB7XG4gICAgaWdub3JlOiBbXCJub2RlX21vZHVsZXNcIiwgXCJSRUFETUUubWRcIl0sXG4gIH0pO1xuICByZXR1cm4gcGF0aHMuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmluY2x1ZGVzKFwicG9zdHMvXCIpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBvc3RMZW5ndGgoKSB7XG4gIC8vIGdldFBvc3RNREZpbGVQYXRoIHJldHVybiB0eXBlIGlzIG9iamVjdCBub3QgYXJyYXlcbiAgcmV0dXJuIFsuLi4oYXdhaXQgZ2V0UG9zdE1ERmlsZVBhdGhzKCkpXS5sZW5ndGg7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEFQUFNcXFxcbG91aWVzdW4uZ2l0aHViLmlvXFxcXC52aXRlcHJlc3NcXFxcdGhlbWVcXFxccnNzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9BUFBTL2xvdWllc3VuLmdpdGh1Yi5pby8udml0ZXByZXNzL3RoZW1lL3Jzcy50c1wiO2ltcG9ydCB7IGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGZnIGZyb20gXCJmYXN0LWdsb2JcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCBtYXR0ZXIgZnJvbSBcImdyYXktbWF0dGVyXCI7XG5pbXBvcnQgTWFya2Rvd25JdCBmcm9tIFwibWFya2Rvd24taXRcIjtcbmltcG9ydCB0eXBlIHsgRmVlZE9wdGlvbnMsIEl0ZW0gfSBmcm9tIFwiZmVlZFwiO1xuaW1wb3J0IHsgRmVlZCB9IGZyb20gXCJmZWVkXCI7XG5cbmNvbnN0IERPTUFJTiA9IFwiaHR0cHM6Ly9sb3VpZXN1bi5naXRodWIuaW9cIjtcbmNvbnN0IEFVVEhPUiA9IHtcbiAgbmFtZTogXCJsb3VpZXN1blwiLFxuICBlbWFpbDogXCJsb3VpZS5waW5ndUBvdXRsb29rLmNvbVwiLFxuICBsaW5rOiBET01BSU4sXG59O1xuY29uc3QgT1BUSU9OUzogRmVlZE9wdGlvbnMgPSB7XG4gIHRpdGxlOiBcIkxvdWllc3VuJ3MgQmxvZ1wiLFxuICBkZXNjcmlwdGlvbjogXCJCbG9nIHBhZ2Ugb2YgbG91aWVzdW4uIFwiLFxuICBpZDogYCR7RE9NQUlOfS9gLFxuICBsaW5rOiBgJHtET01BSU59L2AsXG4gIGNvcHlyaWdodDogXCJHRkRMIExpY2Vuc2VcIixcbiAgZmVlZExpbmtzOiB7XG4gICAganNvbjogRE9NQUlOICsgXCIvZmVlZC5qc29uXCIsXG4gICAgYXRvbTogRE9NQUlOICsgXCIvZmVlZC5hdG9tXCIsXG4gICAgcnNzOiBET01BSU4gKyBcIi9mZWVkLnhtbFwiLFxuICB9LFxuICBhdXRob3I6IEFVVEhPUixcbiAgaW1hZ2U6IERPTUFJTitcIi9hbGVydC5zdmdcIixcbiAgZmF2aWNvbjogRE9NQUlOK1wiL2FsZXJ0LnN2Z1wiLFxufTtcblxuY29uc3QgbWFya2Rvd24gPSBNYXJrZG93bkl0KHtcbiAgaHRtbDogdHJ1ZSxcbiAgYnJlYWtzOiB0cnVlLFxuICBsaW5raWZ5OiB0cnVlLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZEJsb2dSU1MoKSB7XG4gIGNvbnN0IHBvc3RzID0gYXdhaXQgZ2VuZXJhdGVSU1MoKTtcbiAgd3JpdGVGZWVkKFwiZmVlZFwiLCBwb3N0cyk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlUlNTKCkge1xuICBjb25zdCBmaWxlcyA9IGF3YWl0IGZnKFwicG9zdHMvKi5tZFwiKTtcblxuICBjb25zdCBwb3N0czogYW55W10gPSAoXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBmaWxlc1xuICAgICAgICAuZmlsdGVyKChpKSA9PiAhaS5pbmNsdWRlcyhcImluZGV4XCIpKVxuICAgICAgICAubWFwKGFzeW5jIChpKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmF3ID0gYXdhaXQgZnMucmVhZEZpbGUoaSwgXCJ1dGYtOFwiKTtcbiAgICAgICAgICBjb25zdCB7IGRhdGEsIGNvbnRlbnQgfSA9IG1hdHRlcihyYXcpO1xuICAgICAgICAgIGNvbnN0IGh0bWwgPSBtYXJrZG93blxuICAgICAgICAgICAgLnJlbmRlcihjb250ZW50KVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3NyYz1cIi8nLCBgc3JjPVwiJHtET01BSU59L2ApO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZShkYXRhLmRhdGUpLFxuICAgICAgICAgICAgY29udGVudDogaHRtbCxcbiAgICAgICAgICAgIGF1dGhvcjogW0FVVEhPUl0sXG4gICAgICAgICAgICBsaW5rOiBgJHtET01BSU59LyR7aS5yZXBsYWNlKFwiLm1kXCIsIFwiLmh0bWxcIil9YCxcbiAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgIClcbiAgKS5maWx0ZXIoQm9vbGVhbik7XG5cbiAgcG9zdHMuc29ydCgoYSwgYikgPT4gK25ldyBEYXRlKGIuZGF0ZSkgLSArbmV3IERhdGUoYS5kYXRlKSk7XG4gIHJldHVybiBwb3N0cztcbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVGZWVkKG5hbWU6IHN0cmluZywgaXRlbXM6IEl0ZW1bXSkge1xuICBjb25zdCBmZWVkID0gbmV3IEZlZWQoT1BUSU9OUyk7XG4gIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IGZlZWQuYWRkSXRlbShpdGVtKSk7XG5cbiAgYXdhaXQgZnMuZW5zdXJlRGlyKGRpcm5hbWUoYC4vLnZpdGVwcmVzcy9kaXN0LyR7bmFtZX1gKSk7XG4gIGF3YWl0IGZzLndyaXRlRmlsZShgLi8udml0ZXByZXNzL2Rpc3QvJHtuYW1lfS54bWxgLCBmZWVkLnJzczIoKSwgXCJ1dGYtOFwiKTtcbiAgYXdhaXQgZnMud3JpdGVGaWxlKGAuLy52aXRlcHJlc3MvZGlzdC8ke25hbWV9LmF0b21gLCBmZWVkLmF0b20xKCksIFwidXRmLThcIik7XG4gIGF3YWl0IGZzLndyaXRlRmlsZShgLi8udml0ZXByZXNzL2Rpc3QvJHtuYW1lfS5qc29uYCwgZmVlZC5qc29uMSgpLCBcInV0Zi04XCIpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxBUFBTXFxcXGxvdWllc3VuLmdpdGh1Yi5pb1xcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxBUFBTXFxcXGxvdWllc3VuLmdpdGh1Yi5pb1xcXFwudml0ZXByZXNzXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQVBQUy9sb3VpZXN1bi5naXRodWIuaW8vLnZpdGVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBnZXRQb3N0cywgZ2V0UG9zdExlbmd0aCB9IGZyb20gXCIuL3RoZW1lL3NlcnZlclV0aWxzXCI7XG5pbXBvcnQgeyBidWlsZEJsb2dSU1MgfSBmcm9tIFwiLi90aGVtZS9yc3NcIjtcbmltcG9ydCB7IHRyYW5zZm9ybWVyVHdvc2xhc2ggfSBmcm9tIFwiQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoXCI7XG5pbXBvcnQgbWF0aGpheDMgZnJvbSBcIm1hcmtkb3duLWl0LW1hdGhqYXgzXCI7XG5pbXBvcnQgbXVsdGltZF90YWJsZV9wbHVnaW4gZnJvbSBcIm1hcmtkb3duLWl0LW11bHRpbWQtdGFibGVcIjtcbmltcG9ydCBBdXRvU2lkZWJhciBmcm9tICd2aXRlLXBsdWdpbi12aXRlcHJlc3MtYXV0by1zaWRlYmFyJztcblxuXG5jb25zdCBjdXN0b21FbGVtZW50cyA9IFtcbiAgJ21hdGgnLFxuICAnbWFjdGlvbicsXG4gICdtYWxpZ25ncm91cCcsXG4gICdtYWxpZ25tYXJrJyxcbiAgJ21lbmNsb3NlJyxcbiAgJ21lcnJvcicsXG4gICdtZmVuY2VkJyxcbiAgJ21mcmFjJyxcbiAgJ21pJyxcbiAgJ21sb25nZGl2JyxcbiAgJ21tdWx0aXNjcmlwdHMnLFxuICAnbW4nLFxuICAnbW8nLFxuICAnbW92ZXInLFxuICAnbXBhZGRlZCcsXG4gICdtcGhhbnRvbScsXG4gICdtcm9vdCcsXG4gICdtcm93JyxcbiAgJ21zJyxcbiAgJ21zY2FycmllcycsXG4gICdtc2NhcnJ5JyxcbiAgJ21zY2FycmllcycsXG4gICdtc2dyb3VwJyxcbiAgJ21zdGFjaycsXG4gICdtbG9uZ2RpdicsXG4gICdtc2xpbmUnLFxuICAnbXN0YWNrJyxcbiAgJ21zcGFjZScsXG4gICdtc3FydCcsXG4gICdtc3JvdycsXG4gICdtc3RhY2snLFxuICAnbXN0YWNrJyxcbiAgJ21zdHlsZScsXG4gICdtc3ViJyxcbiAgJ21zdXAnLFxuICAnbXN1YnN1cCcsXG4gICdtdGFibGUnLFxuICAnbXRkJyxcbiAgJ210ZXh0JyxcbiAgJ210cicsXG4gICdtdW5kZXInLFxuICAnbXVuZGVyb3ZlcicsXG4gICdzZW1hbnRpY3MnLFxuICAnbWF0aCcsXG4gICdtaScsXG4gICdtbicsXG4gICdtbycsXG4gICdtcycsXG4gICdtc3BhY2UnLFxuICAnbXRleHQnLFxuICAnbWVuY2xvc2UnLFxuICAnbWVycm9yJyxcbiAgJ21mZW5jZWQnLFxuICAnbWZyYWMnLFxuICAnbXBhZGRlZCcsXG4gICdtcGhhbnRvbScsXG4gICdtcm9vdCcsXG4gICdtcm93JyxcbiAgJ21zcXJ0JyxcbiAgJ21zdHlsZScsXG4gICdtbXVsdGlzY3JpcHRzJyxcbiAgJ21vdmVyJyxcbiAgJ21wcmVzY3JpcHRzJyxcbiAgJ21zdWInLFxuICAnbXN1YnN1cCcsXG4gICdtc3VwJyxcbiAgJ211bmRlcicsXG4gICdtdW5kZXJvdmVyJyxcbiAgJ25vbmUnLFxuICAnbWFsaWduZ3JvdXAnLFxuICAnbWFsaWdubWFyaycsXG4gICdtdGFibGUnLFxuICAnbXRkJyxcbiAgJ210cicsXG4gICdtbG9uZ2RpdicsXG4gICdtc2NhcnJpZXMnLFxuICAnbXNjYXJyeScsXG4gICdtc2dyb3VwJyxcbiAgJ21zbGluZScsXG4gICdtc3JvdycsXG4gICdtc3RhY2snLFxuICAnbWFjdGlvbicsXG4gICdzZW1hbnRpY3MnLFxuICAnYW5ub3RhdGlvbicsXG4gICdhbm5vdGF0aW9uLXhtbCdcbl07XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbmZpZygpIHtcbiAgcmV0dXJuIHtcbiAgICBsYW5nOiBcInpoLUNOXCIsXG4gICAgdGl0bGU6IFwiTG91aWVzdW4ncyBCbG9nXCIsXG4gICAgZGVzY3JpcHRpb246IFwiQmxvZyBwYWdlIG9mIGxvdWllc3VuLiBcIixcbiAgICBoZWFkOiBbXG4gICAgICBbXG4gICAgICAgIFwibGlua1wiLFxuICAgICAgICB7XG4gICAgICAgICAgcmVsOiBcImljb25cIixcbiAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIGhyZWY6IFwiL2F2YXRvci5wbmdcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBbXG4gICAgICAgIFwibWV0YVwiLFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJhdXRob3JcIixcbiAgICAgICAgICBjb250ZW50OiBcIkxvdWllc3VuXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBcIm1ldGFcIixcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnR5OiBcIm9nOnRpdGxlXCIsXG4gICAgICAgICAgY29udGVudDogXCJIb21lXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgW1xuICAgICAgICBcIm1ldGFcIixcbiAgICAgICAge1xuICAgICAgICAgIHByb3BlcnR5OiBcIm9nOmRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgY29udGVudDogXCJCbG9nIG9mIGxvdWllc3VuXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIF0sXG4gICAgLy8gY2xlYW5VcmxzOiBcIndpdGgtc3ViZm9sZGVyc1wiLFxuICAgIGxhc3RVcGRhdGVkOiBmYWxzZSxcbiAgICB0aGVtZUNvbmZpZzoge1xuICAgICAgLy8gcmVwbzogXCJjbGFyay1jdWkvaG9tZVNpdGVcIixcbiAgICAgIGxvZ286IFwiL2F2YXRvci5wbmdcIixcbiAgICAgIGF2YXRvcjogXCIvYXZhdG9yLnBuZ1wiLFxuICAgICAgc2VhcmNoOiB7XG4gICAgICAgIHByb3ZpZGVyOiBcImxvY2FsXCIsXG4gICAgICB9LFxuICAgICAgZG9jc0RpcjogXCIvXCIsXG4gICAgICAvLyBkb2NzQnJhbmNoOiBcIm1hc3RlclwiLFxuICAgICAgcG9zdHM6IGF3YWl0IGdldFBvc3RzKCksXG4gICAgICBwYWdlU2l6ZTogNSxcbiAgICAgIHBvc3RMZW5ndGg6IGF3YWl0IGdldFBvc3RMZW5ndGgoKSxcbiAgICAgIG5hdjogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0NcdURGRTFCbG9nc1wiLFxuICAgICAgICAgIGxpbms6IFwiL1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdUREMTZUYWdzXCIsXG4gICAgICAgICAgbGluazogXCIvdGFnc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJcdUQ4M0RcdURDQzNBcmNoaXZlc1wiLFxuICAgICAgICAgIGxpbms6IFwiL2FyY2hpdmVzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIlx1RDgzRFx1REQyNVJTU1wiLFxuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9sb3VpZXN1bi5naXRodWIuaW8vZmVlZC54bWxcIixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBzb2NpYWxMaW5rczogW1xuICAgICAgICB7IGljb246IFwiZ2l0aHViXCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2xvdWllc3VuXCIgfSxcbiAgICAgICAge1xuICAgICAgICAgIGljb246IHtcbiAgICAgICAgICAgIHN2ZzogYDxzdmcgcm9sZT1cImltZ1wiIHZpZXdCb3g9XCIwIDAgMTAyNCAxMDI0XCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMjBcIj5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNODc0LjY2NjY2NyAzNzUuMTg5MzMzVjc0Ni42NjY2NjdhNjQgNjQgMCAwIDEtNjQgNjRIMjEzLjMzMzMzM2E2NCA2NCAwIDAgMS02NC02NFYzNzUuMTg5MzMzbDI2Ni4wOTA2NjcgMjI1LjZhMTQ5LjMzMzMzMyAxNDkuMzMzMzMzIDAgMCAwIDE5My4xNTIgMEw4NzQuNjY2NjY3IDM3NS4xODkzMzN6TTgxMC42NjY2NjcgMjEzLjMzMzMzM2E2NC43ODkzMzMgNjQuNzg5MzMzIDAgMCAxIDIyLjgyNjY2NiA0LjE4MTMzNCA2My42MTYgNjMuNjE2IDAgMCAxIDI2Ljc5NDY2NyAxOS40MTMzMzMgNjQuMzIgNjQuMzIgMCAwIDEgOS4zNDQgMTUuNDY2NjY3YzIuNzczMzMzIDYuNTcwNjY3IDQuNDggMTMuNjk2IDQuOTA2NjY3IDIxLjE4NEw4NzQuNjY2NjY3IDI3Ny4zMzMzMzN2MjEuMzMzMzM0TDU1My41MzYgNTcyLjU4NjY2N2E2NCA2NCAwIDAgMS03OS44OTMzMzMgMi41Mzg2NjZsLTMuMTc4NjY3LTIuNTZMMTQ5LjMzMzMzMyAyOTguNjY2NjY3di0yMS4zMzMzMzRhNjMuNzg2NjY3IDYzLjc4NjY2NyAwIDAgMSAzNS4xMzYtNTcuMTMwNjY2QTYzLjg3MiA2My44NzIgMCAwIDEgMjEzLjMzMzMzMyAyMTMuMzMzMzMzaDU5Ny4zMzMzMzR6XCIgPjwvcGF0aD5cbiAgICAgICAgICAgIDwvc3ZnPmAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBsaW5rOiBcIm1haWx0bzpsb3VpZS5waW5ndUBvdXRsb29rLmNvbVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIC8vIG91dGxpbmU6IDIsIC8vXHU4QkJFXHU3RjZFXHU1M0YzXHU0RkE3YXNpZGVcdTY2M0VcdTc5M0FcdTVDNDJcdTdFQTdcbiAgICAgIGFzaWRlOiBmYWxzZSxcbiAgICAgIC8vIGJsb2dzIHBhZ2Ugc2hvdyBmaXJld29rcnMgYW5pbWF0aW9uXG4gICAgICBzaG93RmlyZXdvcmtzQW5pbWF0aW9uOiBmYWxzZSxcbiAgICB9LFxuICAgIGJ1aWxkRW5kOiBidWlsZEJsb2dSU1MsXG4gICAgbWFya2Rvd246IHtcbiAgICAgIHRoZW1lOiB7XG4gICAgICAgIGxpZ2h0OiBcInZpdGVzc2UtbGlnaHRcIixcbiAgICAgICAgZGFyazogXCJ2aXRlc3NlLWRhcmtcIixcbiAgICAgIH0sXG4gICAgICBjb2RlVHJhbnNmb3JtZXJzOiBbdHJhbnNmb3JtZXJUd29zbGFzaCgpXSxcbiAgICAgIGNvbmZpZzogKG1kKSA9PiB7XG4gICAgICAgIC8vIFx1NEY3Rlx1NzUyOFx1NjZGNFx1NTkxQVx1NzY4NCBNYXJrZG93bi1pdCBcdTYzRDJcdTRFRjZcdUZGMDFcbiAgICAgICAgbWQudXNlKG11bHRpbWRfdGFibGVfcGx1Z2luLCB7XG4gICAgICAgICAgbXVsdGlsaW5lOiB0cnVlLFxuICAgICAgICAgIHJvd3NwYW46IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICBtZC51c2UobWF0aGpheDMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgdnVlOiB7XG4gICAgICB0ZW1wbGF0ZToge1xuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6ICh0YWcpID0+IGN1c3RvbUVsZW1lbnRzLmluY2x1ZGVzKHRhZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdml0ZToge1xuICAgICAgcGx1Z2luczogW1xuICAgICAgICAvLyBhZGQgcGx1Z2luXG4gICAgICAgIEF1dG9TaWRlYmFyKHtcbiAgICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgXVxuICAgIH0sXG4gIH07XG59XG5leHBvcnQgZGVmYXVsdCBjb25maWcoKTtcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VCxTQUFRLGNBQWE7QUFDbFYsT0FBTyxZQUFZO0FBQ25CLE9BQU8sUUFBUTtBQUdmLGVBQXNCLFdBQVc7QUFDL0IsTUFBSSxRQUFRLE1BQU0sbUJBQW1CO0FBQ3JDLE1BQUksUUFBUSxNQUFNLFFBQVE7QUFBQSxJQUN4QixNQUFNLElBQUksT0FBTyxTQUFTO0FBQ3hCLFlBQU0sVUFBVSxNQUFNLEdBQUcsU0FBUyxNQUFNLE9BQU87QUFDL0MsWUFBTSxFQUFFLEtBQUssSUFBSSxPQUFPLE9BQU87QUFDL0IsV0FBSyxPQUFPLGFBQWEsS0FBSyxJQUFJO0FBQ2xDLGFBQU87QUFBQSxRQUNMLGFBQWE7QUFBQSxRQUNiLGFBQWEsSUFBSSxLQUFLLFFB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RUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxlQUFlLFNBQVM7QUFDdEIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLE1BQ0o7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsUUFDWDtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxVQUNFLFVBQVU7QUFBQSxVQUNWLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRjtBQUFBLE1BQ0E7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFVBQ0UsVUFBVTtBQUFBLFVBQ1YsU0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSxhQUFhO0FBQUEsSUFDYixhQUFhO0FBQUE7QUFBQSxNQUVYLE1BQU07QUFBQSxNQUNOLFFBQVE7QUFBQSxNQUNSLFFBQVE7QUFBQSxRQUNOLFVBQVU7QUFBQSxNQUNaO0FBQUEsTUFDQSxTQUFTO0FBQUE7QUFBQSxNQUVULE9BQU8sTUFBTSxTQUFTO0FBQUEsTUFDdEIsVUFBVTtBQUFBLE1BQ1YsWUFBWSxNQUFNLGNBQWM7QUFBQSxNQUNoQyxLQUFLO0FBQUEsUUFDSDtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxVQUNFLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsTUFDQSxhQUFhO0FBQUEsUUFDWCxFQUFFLE1BQU0sVUFBVSxNQUFNLDhCQUE4QjtBQUFBLFFBQ3REO0FBQUEsVUFDRSxNQUFNO0FBQUEsWUFDSixLQUFLO0FBQUE7QUFBQTtBQUFBLFVBR1A7QUFBQSxVQUNBLE1BQU07QUFBQSxRQUNSO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxPQUFPO0FBQUE7QUFBQSxNQUVQLHdCQUF3QjtBQUFBLElBQzFCO0FBQUEsSUFDQSxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsTUFDUixPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDUjtBQUFBLE1BQ0Esa0JBQWtCLENBQUMsb0JBQW9CLENBQUM7QUFBQSxNQUN4QyxRQUFRLENBQUMsT0FBTztBQUVkLFdBQUcsSUFBSSxzQkFBc0I7QUFBQSxVQUMzQixXQUFXO0FBQUEsVUFDWCxTQUFTO0FBQUEsUUFDWCxDQUFDO0FBQ0QsV0FBRyxJQUFJLFFBQVE7QUFBQSxNQUNqQjtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2YsaUJBQWlCLENBQUMsUUFBUSxlQUFlLFNBQVMsR0FBRztBQUFBLFFBQ3ZEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQTtBQUFBLFFBRVAsWUFBWTtBQUFBLFVBQ1YsTUFBTTtBQUFBLFVBQ04sV0FBVztBQUFBLFFBQ2IsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBQ0EsSUFBTyxpQkFBUSxPQUFPOyIsCiAgIm5hbWVzIjogWyJmcyIsICJtYXR0ZXIiLCAiZnMiLCAibWF0dGVyIl0KfQo=
