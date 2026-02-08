// 1. Show security status based on SharedArrayBuffer availability
if (window.crossOriginIsolated) {
    const badge = document.getElementById('iso-badge');
    if (badge) {
        badge.innerText = "Security: ACTIVE (Ready)";
        badge.className = "secure";
    }
}

let ffmpegInstance = null;

function toggleInputs() {
    const mode = document.getElementById('mode').value;
    document.getElementById('wiki-settings').style.display = mode === 'wikimedia' ? 'block' : 'none';
    document.getElementById('local-settings').style.display = mode === 'local' ? 'block' : 'none';
}

async function processVideo() {
    const status = document.getElementById('status');
    const btn = document.getElementById('renderBtn');
    
    // Safety check for Cross-Origin Isolation (SharedArrayBuffer)
    if (!window.crossOriginIsolated) {
        status.innerText = "Error: Security layer not active. Please refresh.";
        return;
    }

    btn.disabled = true;

    try {
        const { createFFmpeg, fetchFile } = FFmpeg;

        if (!ffmpegInstance) {
            status.innerText = "Starting Engine...";
            ffmpegInstance = createFFmpeg({ 
                log: true,
                // Explicit corePath for CDN loading consistency
                corePath: 'https://cdn.jsdelivr.net'
            });
            await ffmpegInstance.load();
        }

        const mode = document.getElementById('mode').value;
        let imageUrls = [];

        if (mode === 'wikimedia') {
            status.innerText = "Scraping Images...";
            imageUrls = await fetchWikiImages(document.getElementById('topic').value, document.getElementById('limit').value);
        } else {
            const files = document.getElementById('localFiles').files;
            for (let f of files) imageUrls.push(URL.createObjectURL(f));
        }

        if (imageUrls.length === 0) throw new Error("No images found.");

        // Write images to the virtual filesystem
        status.innerText = "Preparing Files...";
        for (let i = 0; i < imageUrls.length; i++) {
            const data = await fetchFile(imageUrls[i]);
            ffmpegInstance.FS('writeFile', `img${i}.jpg`, data);
        }

        // Handle Audio
        const musicFiles = document.getElementById('bgMusic').files;
        const hasMusic = musicFiles.length > 0;
        if (hasMusic) {
            ffmpegInstance.FS('writeFile', 'audio.mp3', await fetchFile(musicFiles[0]));
        }

        status.innerText = "Rendering Video (Wait)...";
        // 3 seconds per image (-framerate 1/3)
        await ffmpegInstance.run(
            '-framerate', '1/3', 
            '-i', 'img%d.jpg', 
            '-c:v', 'libx264', 
            '-pix_fmt', 'yuv420p', 
            '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2', 
            'temp.mp4'
        );

        let finalFile = 'temp.mp4';
        if (hasMusic) {
            status.innerText = "Merging Audio...";
            await ffmpegInstance.run(
                '-i', 'temp.mp4', 
                '-i', 'audio.mp3', 
                '-c:v', 'copy', 
                '-c:a', 'aac', 
                '-map', '0:v:0', 
                '-map', '1:a:0', 
                '-shortest', 
                'final.mp4'
            );
            finalFile = 'final.mp4';
        }

        // Trigger Download
        status.innerText = "Exporting...";
        const data = ffmpegInstance.FS('readFile', finalFile);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        a.download = `video_${Date.now()}.mp4`;
        a.click();
        
        status.innerText = "Success! Saved to Downloads.";
    } catch (e) {
        status.innerText = "Error: " + e.message;
        console.error(e);
    } finally {
        btn.disabled = false;
    }
}

async function fetchWikiImages(topic, limit) {
    // Fixed Wikimedia URL with full API path
    const url = `https://commons.wikimedia.org{encodeURIComponent(topic)}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query) return [];
    return Object.values(data.query.pages)
        .filter(p => p.imageinfo && p.imageinfo.length > 0)
        .map(p => p.imageinfo[0].url)
        .filter(u => u.match(/\.(jpg|jpeg|png)$/i));
}
