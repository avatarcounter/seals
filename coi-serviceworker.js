if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
    self.addEventListener("fetch", (e) => {
        // Skip cross-origin requests that don't need CORP (prevents loading errors)
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;
        
        e.respondWith(
            fetch(e.request).then((res) => {
                if (res.status === 0) return res;
                const h = new Headers(res.headers);
                // These three headers unlock the video engine
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                h.set("Cross-Origin-Resource-Policy", "cross-origin"); 
                return new Response(res.body, { 
                    status: res.status, 
                    statusText: res.statusText, 
                    headers: h 
                });
            }).catch(err => console.error("Service Worker Fetch Error:", err))
        );
    });
}
