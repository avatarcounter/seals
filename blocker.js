(function() {
    const banned = ["ethan", "logan", "teilo"];
    const blockedName = localStorage.getItem('isBlockedName');
    
    // Function to kill the page and show the flashing screen
    function renderBlockedPage(name) {
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);
        document.documentElement.innerHTML = `
            <style>
                body { 
                    background-color: black !important; 
                    display: flex !important; 
                    justify-content: center !important; 
                    align-items: center !important; 
                    height: 100vh !important; 
                    margin: 0 !important; 
                    overflow: hidden !important;
                }
                h1 {
                    font-size: 8vw;
                    font-family: 'Impact', sans-serif;
                    text-transform: uppercase;
                    text-align: center;
                    animation: flash 0.1s infinite;
                }
                @keyframes flash {
                    0% { color: red; }
                    50% { color: blue; }
                    100% { color: red; }
                }
            </style>
            <h1>\${displayName} blocked lmao</h1>
        `;
        window.stop();
        throw new Error("Access Denied");
    }

    // 1. If already blocked in this browser, show the screen immediately
    if (blockedName) {
        renderBlockedPage(blockedName);
        return;
    }

    // 2. If name is unknown, ask for it
    if (!localStorage.getItem('userName')) {
        const name = prompt("Please enter your name to access the site:");
        const cleanName = name ? name.toLowerCase().trim() : "";
        
        if (banned.includes(cleanName)) {
            localStorage.setItem('isBlockedName', cleanName);
            renderBlockedPage(cleanName);
        } else if (cleanName !== "") {
            localStorage.setItem('userName', cleanName);
        } else {
            // Keep looping if they try to bypass the prompt
            window.location.reload();
        }
    }
})();
