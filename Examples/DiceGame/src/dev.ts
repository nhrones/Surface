// Run this utility whenever you add or remove Views in the Views folder.
// This utility discovers Views and updates the view_Manifest.json file.
// This manifest exposes the Views and their ctors to allow auto instantiation.
// The use of Views in an app is dictated by the cfg.json. Think html but simple! 

import {
   resolve,
   extname,
   join,
   toFileUrl
} from "https://deno.land/std@0.214.0/path/mod.ts";

interface Manifest { views: string[]; }

export async function collect(directory: string): Promise<Manifest> {

   const ViewsDir = join(directory, "./Views");

   const views = [];
   try {
      const ViewsUrl = toFileUrl(ViewsDir);
      for await (const entry of Deno.readDir(ViewsDir)) {
         if (entry.isDirectory) {
            console.error(
               `Found subdirectory '${entry.name}' in Views/. The Views/ folder must not contain any subdirectories.`,
            );
         }
         if (entry.isFile) {
            const ext = extname(entry.name);
            if (![".ts", ".js"].includes(ext)) continue;
            const path = join(ViewsDir, entry.name);
            const file = toFileUrl(path).href.substring(ViewsUrl.href.length);
            views.push(file);
         }
      }
   } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
         // Do nothing.
      } else {
         throw err;
      }
   }
   views.sort();
   console.info(views)
   return { views, };
}

export async function generate(directory: string, manifest: Manifest) {
   const { views } = manifest;

   const output = `// DO NOT EDIT. This file is generated by Fresh.
   // This file SHOULD be checked into source version control.
   // This file is automatically updated during development when running \`dev.ts\`.

${views.map((file, i) => `import * as $${i} from "./Views${file}";`)
         .join("\n")
      }

const manifest = {
  Views: {
    ${views.map((file, i) => `${JSON.stringify(`./Views${file}`)}: $${i},`)
         .join("\n    ")
      }
  },
  baseUrl: import.meta.url,
};

export default manifest;
`;

   const proc = new Deno.Command(Deno.execPath(), {
      args: ["fmt", "-"],
      stdin: "piped",
      stdout: "piped",
      stderr: "null",
   }).spawn();

   const raw = new ReadableStream({
      start(controller) {
         controller.enqueue(new TextEncoder().encode(output));
         controller.close();
      },
   });
   await raw.pipeTo(proc.stdin);
   const { stdout } = await proc.output();

   const manifestStr = new TextDecoder().decode(stdout);
   const manifestPath = join(directory, './view_manifest.ts');

   await Deno.writeTextFile(manifestPath, manifestStr);
   console.log(
      `%cThe manifest has been generated for ${views.length} views.`,
      "color: blue; font-weight: bold",
   );
}

//const views: Map<string, any> = new Map()

// Get the manifest' base URL.
//const baseUrl = new URL("./", import.meta.url).href //manifest.baseUrl).href;

const unresolvedDirectory = './src';
const resolvedDirectory = resolve(unresolvedDirectory);

const manifest2 = await collect(resolvedDirectory);
await generate(resolvedDirectory, manifest2);
