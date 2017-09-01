(function () {
    let s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.innerText = "(function () {\n" +
        "    let oldSend = XMLHttpRequest.prototype.send;\n" +
        "    XMLHttpRequest.prototype.send = function () {\n" +
        "        this.withCredentials = true;\n" +
        "        oldSend.apply(this, arguments);\n" +
        "    };\n" +
        "})();";
    document.getElementsByTagName("body")[0].appendChild(s);
})();