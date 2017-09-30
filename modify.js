(function () {
    if (location.href.startsWith("http://game1.margonem.pl") || location.href.startsWith("https://game1.margonem.pl"))
    {
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
    }

    let connectTo = document.getElementsByClassName("__mj_connect_to");

    for (let id in connectTo)
    {
        let element = connectTo[id];

        if(typeof element.getAttribute !== "function")
        {
            return
        }

        let name = element.getAttribute("data-name");
        let connect = element.getAttribute("data-connect");

        if (typeof name !== "string" || typeof connect !== "string")
        {
            continue
        }

        chrome.runtime.sendMessage({type: "connect", "server-name": name, "server-url": connect});

        break;
    }
})();