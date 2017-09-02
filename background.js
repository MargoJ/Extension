(function () {
    let redirects = [
        "/global_addon.js", "/logout", "/login", "/register", "/engine", "/obrazki/miasta/", "/obrazki/itemy", "/obrazki/npc"
    ];

    let data = {
        connected: false,
        lastRequestId: -1
    };

    function __reloadData()
    {
        chrome.storage.local.get(["connected", "current-server-url"], function (response) {
            data.connected = response["connected"];
            data.url = response["current-server-url"];
        });
    }

    __reloadData();

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (typeof request.type !== "string")
        {
            return
        }

        switch (request.type)
        {
            case "update_data":
            {
                __reloadData();
                break
            }
        }
    });

    chrome.webRequest.onBeforeRequest.addListener(function (request) {
        if (!data.connected)
        {
            return;
        }
        if (data.lastRequestId === request.requestId)
        {
            return;
        }

        for(let i in redirects)
        {
            let redirect = redirects[i];

            if(request.url.startsWith("http://game1.margonem.pl" + redirect))
            {
                data.lastRequestId = request.requestId;
                return {"redirectUrl": request.url.replace("http://game1.margonem.pl" + redirect, data.url + redirect)}
            }
        }
    }, {
        urls: ["http://game1.margonem.pl/*"]
    }, ["blocking"]);
})();