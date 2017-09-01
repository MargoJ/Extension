let MargoJ = {
    "_masterServer": "https://margoj.pl/masterserver",

    "loadOfficialServers": function (callback) {
        let serverIndex = MargoJ._masterServer + "/index?" + new Date().getTime();

        let xhr = new XMLHttpRequest();
        xhr.open("GET", serverIndex, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4)
            {
                console.log(xhr.responseText);
                callback(JSON.parse(xhr.responseText))
            }
        };

        xhr.send();
    },

    "setOfficalServers": function (list) {
        MargoJ.loadOfficialServers(function (response) {
            list.innerHTML = "";

            for (let i in response)
            {
                let server = response[i];
                list.innerHTML += "<li><a href='#' id='connect-" + i + "'>" + server.name + "</a></li>";
            }

            for(let i in response)
            {
                let server = response[i];
                document.getElementById("connect-" + i).onclick = function () {
                    MargoJ.connect(server.name, server.url);
                }
            }
        })

    },

    "connect": function (name, url) {
        MargoJ.setSettings({"connected": true, "current-server-name": name, "current-server-url": url});
        MargoJ.broadcastUpdate();
        MargoJ.updatePopup()
    },

    "disconnect": function () {
        MargoJ.setSettings({"connected": false});
        MargoJ.broadcastUpdate();
        MargoJ.updatePopup();
    },

    "updatePopup": function () {
        MargoJ.getSettings(["connected", "current-server-name"], function (response) {
            if (response["connected"] === true)
            {
                document.getElementById("connected").style.display = "block";
                document.getElementById("list").style.display = "none";
                document.getElementById("current_server_id").innerHTML = response["current-server-name"];
            }
            else
            {
                MargoJ.setOfficalServers(document.getElementById("official"));
                document.getElementById("list").style.display = "block";
                document.getElementById("connected").style.display = "none";
            }

            document.getElementById("loading").style.display = "none";
        });
    },

    "init": function () {
        document.getElementById("start_game").onclick = function () {
            MargoJ.openTab("http://game1.margonem.pl/")
        };

        document.getElementById("disconnect").onclick = function () {
            MargoJ.disconnect();
        };

        MargoJ.updatePopup();
    }
};