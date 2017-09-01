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
                list.innerHTML += "<tr id='connect-" + i + "' style='cursor: pointer'><td>" + server.name + "</td></tr>";
            }

            for (let i in response)
            {
                let server = response[i];
                document.getElementById("connect-" + i).onclick = function () {
                    MargoJ.connect(server.name, server.url);
                }
            }
        })

    },

    "updateLastPlayed": function () {
        let last = document.getElementById("last");

        last.innerHTML = "<tr><td>Ładowanie... proszę czekać</td></tr>";

        MargoJ.getSettings(["last_played"], function (result) {
            if (typeof result["last_played"] !== "string" || result["last_played"] === "")
            {
                last.innerHTML = "<tr><td>Brak...</td></tr>";
                return
            }

            last.innerHTML = "";

            let split = result["last_played"].split(";");

            for (let i = 0; i < split.length; i += 2)
            {
                last.innerHTML += "<tr><td id='connect-last-" + i + "' style='cursor: pointer'>" + split[i] + "</td></tr>";
            }

            for (let i = 0; i < split.length; i += 2)
            {
                document.getElementById("connect-last-" + i).onclick = function () {
                    MargoJ.connect(split[i], split[i + 1]);
                }
            }
        })
    },

    "updateRecent": function (name, url) {
        MargoJ.getSettings(["last_played"], function (result) {
            let split = (result["last_played"] || "").split(";");
            if(split.length === 1)
            {
                split = [];
            }

            for(let i = 0 ; i < split.length ; i+=2)
            {
                if(split[i] === name)
                {
                    split.splice(i, 2);
                    break
                }
            }

            split.unshift(name, url);

            if (split.length / 2 > 10)
            {
                split.pop();
                split.pop();
            }

            MargoJ.setSettings({"last_played": split.join(";")});
            MargoJ.updateLastPlayed();
        })
    },

    "connect": function (name, url) {
        MargoJ.setSettings({"connected": true, "current-server-name": name, "current-server-url": url});
        MargoJ.updateRecent(name, url);
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

        let ipElement = document.getElementById("custom_ip");

        document.getElementById("connect_custom").onsubmit = function () {
            let ip = ipElement.value;
            MargoJ.connect(ip, ip);
        };

        MargoJ.updateLastPlayed();
        MargoJ.updatePopup();
    }
};