import { serveFile } from "https://deno.land/std@0.212.0/http/file_server.ts"
import { openWebsite } from "https://raw.githubusercontent.com/nhrones/Utilities/main/Browser/browser.ts"
const db = await Deno.openKv()

Deno.serve(async (request: Request): Promise<Response> => {
   let { pathname } = new URL(request.url);
   if (request.method === 'POST') {
      const value = await request.json();
      console.info('POST request.body',  value)
      await db.set(["highscore"], value)
      return new Response("ok");
   }
   if (pathname === '/') pathname = '/index.html';
   if (pathname.includes("/highscore")) {   
      const val = await db.get(["highscore"])
      return new Response(JSON.stringify(val));
   }
   console.log('Serving: ', pathname)
   const resp = await serveFile(request, '.' + pathname )
   return resp 
})

// Trigger browser start
await openWebsite(`http://localhost:8000`)
