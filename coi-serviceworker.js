if (typeof window === "undefined") {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        // Only intercept requests that we need to protect
        if (event.request.method !== "GET") return;

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) return response; // Handled by browser

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((err) => {
                    // Fallback for failed network requests (like the jsdelivr block)
                    return fetch(event.request, { mode: 'no-cors' });
                })
        );
    });
}
