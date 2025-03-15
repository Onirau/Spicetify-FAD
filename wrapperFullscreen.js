function addScript(src) {
    let script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}

addScript("https://raw.githubusercontent.com/Onirau/Spicetify-FAD/refs/heads/main/dist/test-app.js");