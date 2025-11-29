import Home from "./inner";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ServerPage() {
  const preloaded = await preloadQuery(api.myFunctions.listNumbers, {
    count: 3,
  });

  const data = preloadedQueryResult(preloaded);

  return (
    <div className="pt-32 pb-20">
      <div className="container-custom max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40 mb-3">Developer preview</p>
          <h1 className="text-4xl font-extrabold text-white">Convex + Next.js</h1>
          <p className="text-white/60 mt-2">
            Example page showing how server components preload Convex data while preserving the landing page aesthetic.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Non-reactive server-loaded data</h2>
          <pre className="bg-black/40 rounded-2xl p-4 text-sm text-[#33b5ff] overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <Home preloaded={preloaded} />
        </div>
      </div>
    </div>
  );
}
