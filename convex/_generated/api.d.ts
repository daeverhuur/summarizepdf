/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai_chat from "../ai/chat.js";
import type * as ai_extract from "../ai/extract.js";
import type * as ai_models from "../ai/models.js";
import type * as ai_summarize from "../ai/summarize.js";
import type * as chat from "../chat.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as share from "../share.js";
import type * as subscriptions from "../subscriptions.js";
import type * as summaries from "../summaries.js";
import type * as teams from "../teams.js";
import type * as uploads from "../uploads.js";
import type * as usage from "../usage.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "ai/chat": typeof ai_chat;
  "ai/extract": typeof ai_extract;
  "ai/models": typeof ai_models;
  "ai/summarize": typeof ai_summarize;
  chat: typeof chat;
  documents: typeof documents;
  http: typeof http;
  share: typeof share;
  subscriptions: typeof subscriptions;
  summaries: typeof summaries;
  teams: typeof teams;
  uploads: typeof uploads;
  usage: typeof usage;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
