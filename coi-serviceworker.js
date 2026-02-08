if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        // Skip cross-origin requests that might fail due to lack of CORP headers on the destination
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        
        e.respondWith(
            fetch(e.request).then((res) => {
                if (res.status === 0) return res;
                const h = new Headers(res.headers);
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                // Allows cross-origin resources to load if they have CORS enabled
                h.set("Cross-Origin-Resource-Policy", "cross-origin"); 
                return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
            }).catch(err => console.error("SW fetch error:", err))
        );
    });
}
