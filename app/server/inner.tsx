"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
}) {
  const data = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);
  return (
    <div className="space-y-6">
      <div className="bg-black/30 border border-white/5 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white mb-3">Reactive client-loaded data</h2>
        <pre className="text-sm text-[#33b5ff] overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <button
        className="w-full sm:w-auto bg-[#009de0] text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-[0_15px_40px_rgba(0,157,224,0.3)] transition-shadow"
        onClick={() => {
          void addNumber({ value: Math.floor(Math.random() * 10) });
        }}
      >
        Add a random number
      </button>
    </div>
  );
}
