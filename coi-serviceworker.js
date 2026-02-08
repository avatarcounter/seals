if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (e) => {
        // Don't intercept if it's a browser-internal request
        if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") return;

        e.respondWith(
            fetch(e.request).then((res) => {
                if (res.status === 0) return res;

                const h = new Headers(res.headers);
                h.set("Cross-Origin-Embedder-Policy", "require-corp");
                h.set("Cross-Origin-Opener-Policy", "same-origin");
                // This line is the key: it tells the browser external scripts are safe
                h.set("Cross-Origin-Resource-Policy", "cross-origin");

                return new Response(res.body, { 
                    status: res.status, 
                    statusText: res.statusText, 
                    headers: h 
                });
            }).catch(err => {
                // If fetch fails, try a basic request
                return fetch(e.request);
            })
        );
    });
}
