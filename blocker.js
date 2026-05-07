(function() {
    const blockedName = localStorage.getItem('isBlockedName');
    
    function renderBlockedPage(name) {
        // Default settings
        let text = `${name} blocked lmao`;
        let color1 = "red";
        let color2 = "blue";

        // Customise based on the name
        switch(name.toLowerCase().trim()) {
            case "logan":
                text = "logan blocked lmao";
                color1 = "green";
                color2 = "red";
                break;
            case "ethan":
                text = "ethan forbidden lmao";
                color1 = "pink";
                color2 = "yellow";
                break;
            case "teilo":
                text = "teilo blocked, how is the car?";
                color1 = "red";
                color2 = "blue";
                break;
        }

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
                    font-size: 6vw;
                    font-family: 'Impact', sans-serif;
                    text-transform: uppercase;
                    text-align: center;
                    animation: flash 0.15s infinite;
                }
                @keyframes flash {
                    0% { color: ${color1}; }
                    50% { color: ${color2}; }
                    100% { color: ${color1}; }
                }
            </style>
            <h1>${text}</h1>
        `;
        window.stop();
        throw new Error("Access Denied");
    }

    if (blockedName) {
        renderBlockedPage(blockedName);
        return;
    }

    if (!localStorage.getItem('userName')) {
        const name = prompt("Please enter your name to access the site:");
        const cleanName = name ? name.toLowerCase().trim() : "";
        const banned = ["ethan", "logan", "teilo"];
        
        if (banned.includes(cleanName)) {
            localStorage.setItem('isBlockedName', cleanName);
            renderBlockedPage(cleanName);
        } else if (cleanName !== "") {
            localStorage.setItem('userName', cleanName);
        } else {
            window.location.reload();
        }
    }
})();
