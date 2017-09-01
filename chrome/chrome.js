MargoJ.setSettings = function (object) {
    console.log(object);
    chrome.storage.local.set(object);
};

MargoJ.getSettings = function (values, callback) {
    chrome.storage.local.get(values, callback);
};

MargoJ.openTab = function (url) {
    chrome.tabs.create({url: url});
};

MargoJ.broadcastUpdate = function () {
    chrome.extension.sendMessage({
        type: "update_data"
    });
};

MargoJ.init();