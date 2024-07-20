"use strict";
function GetDefaultPopupData() {
    return {
        "ShowAnswers": true,
        "SaveBookworkChecks": true,
        "AddCalculator": true,
        "GauthMathButton": true,
        "sparx-CleanMenu": true,
        "sparx-FakeCrash": true,
        "AddQuestionChecking": true,
        "DevData": false,
        "knowitallninja-FakeCrash": true,
        "AutoToggleBoxes": true,
        "FillInputBoxes": true,
        "AddDictionary": false,
        "QuickPointsDisplay": true,
        "AddMorphology": false,
        "Keybinds": true,
    };
}
async function isPopupDataValueActive() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["PopupData"], (result) => {
            try {
                let PopupData = JSON.parse(result["PopupData"]);
                resolve(PopupData);
            }
            catch {
                resolve(undefined);
            }
        });
    });
}
(async function () {
    let result = await isPopupDataValueActive();
    if (result == null || result == undefined) {
        result = GetDefaultPopupData();
        chrome.storage.local.set({ PopupData: JSON.stringify(result) });
    }
    else {
        if (Object.keys(result).length != Object.keys(GetDefaultPopupData()).length) {
            let ResultKeys = Object.keys(result);
            let NewData = GetDefaultPopupData();
            for (let i = 0; i < ResultKeys.length; i++) {
                if (Object.keys(GetDefaultPopupData()).includes(ResultKeys[i])) {
                    NewData[ResultKeys[i]] = result[ResultKeys[i]];
                }
            }
            chrome.storage.local.set({ PopupData: JSON.stringify(NewData) });
            result = NewData;
        }
    }
    console.log(result);
    PopulateTickBoxes(result);
})();
function PopulateTickBoxes(PopupData) {
    let topics = {};
    for (let Variable in PopupData) {
        if (PopupData.hasOwnProperty(Variable)) {
            let Value = PopupData[Variable];
            let TopicTitle = GetTopicTitleFromVariableName(Variable);
            if (TopicTitle) {
                if (!topics[TopicTitle]) {
                    topics[TopicTitle] = [];
                }
                topics[TopicTitle].push({ variable: Variable, value: Value });
            }
        }
    }
    for (let TopicTitle in topics) {
        if (topics.hasOwnProperty(TopicTitle)) {
            let TopicFieldset = document.createElement("fieldset");
            let TopicLegend = document.createElement("legend");
            TopicLegend.textContent = addSpacesToTitle(TopicTitle);
            TopicFieldset.appendChild(TopicLegend);
            topics[TopicTitle].forEach((setting) => {
                let checkboxDiv = document.createElement("div");
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = setting.variable;
                checkbox.checked = setting.value;
                checkbox.addEventListener("click", function () {
                    PopupData[setting.variable] = !PopupData[setting.variable];
                    chrome.storage.local.set({ PopupData: JSON.stringify(PopupData) });
                });
                checkboxDiv.appendChild(checkbox);
                let label = document.createElement("label");
                label.textContent = addSpacesToTitle(setting.variable.split("-")[1] || setting.variable);
                label.setAttribute("for", setting.variable);
                checkboxDiv.appendChild(label);
                TopicFieldset.appendChild(checkboxDiv);
            });
            document.body.appendChild(TopicFieldset);
        }
        let BR = document.createElement("br");
        document.body.appendChild(BR);
    }
}
function addSpacesToTitle(title) {
    return title.replace(/([A-Z])/g, ' $1').trim();
}
function GetTopicTitleFromVariableName(Variable) {
    switch (Variable) {
        case "ShowAnswers":
        case "SaveBookworkChecks":
        case "AddCalculator":
        case "GauthMathButton":
        case "sparx-CleanMenu":
        case "sparx-FakeCrash":
            return "Sparx Maths";
        case "AddQuestionChecking":
        case "DevData":
            return "Know-it-all-ninja";
        case "AutoToggleBoxes":
        case "FillInputBoxes":
            return "Seneca";
        case "AddDictionary":
        case "QuickPointsDisplay":
        case "AddMorphology":
            return "Bedrock Learning";
        case "Keybinds":
            return "Educake";
        default:
            return null;
    }
}
//# sourceMappingURL=popup.js.map