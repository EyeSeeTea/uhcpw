import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
    new Response(JSON.stringify(__BUILD_INFO__), {
        headers: { "Content-Type": "application/json; charset=utf-8" },
    });
