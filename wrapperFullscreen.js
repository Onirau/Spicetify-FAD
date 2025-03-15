function addScript(src) {
    // Append a timestamp to the URL to avoid caching
    let url = src + "?t=" + new Date().getTime();

    let script = document.createElement("script");
    script.src = url;
    script.defer = true;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}

addScript("https://onirau.github.io/FullscreenDisplay.js");