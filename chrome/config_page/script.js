
function createConfigs(digi_settings, element, saveSettings) {
    for (var setting of Object.keys(digi_settings)) {
        var box = new Box({
            title: digi_settings[setting].title,
            description: digi_settings[setting].description,
            id: setting,
            hover: "",
            enabled: digi_settings[setting].value,
            onchange: saveSettings
        });
        if (digi_settings[setting].inputs) {
            for (var inputInfo of Object.keys(digi_settings[setting].inputs)) {
                box.addItem(digi_settings[setting].inputs[inputInfo]);
            }
        }
        element.appendChild(box.getBox());
    }
}


chrome.storage.local.get(function (item) {
    createConfigs(item.digi_settings, document.body, function saveSettings() {
        var paths = [];
        var values = [];
        for (let element of document.getElementsByClassName("box-checkbox")) {
            var name = element.id.split("-")[0];
            var value = element.checked;
            paths.push(["digi_settings", name, "value"]);
            values.push(value);
        }
        for (let inputElement of document.getElementsByClassName("box-item-input")) {
            var fieldName = inputElement.id;
            var fieldValue;
            if (inputElement.type === "checkbox") {
                fieldValue = inputElement.checked;
            } else {
                fieldValue = inputElement.value;
            }
            paths.push(["digi_settings", inputElement.name, "inputs", fieldName, "input", "value"]);
            values.push(fieldValue);
        }
        chrome.runtime.sendMessage({"setSettingsByPath": {"paths": paths, "values": values}}, function(response) {});
    });
});