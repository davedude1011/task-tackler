"use strict";
console.log("SENECA");
async function isPopupDataValueActive(Variable) {
    return new Promise((resolve) => {
        chrome.storage.local.get(["PopupData"], (result) => {
            let PopupData = JSON.parse(result["PopupData"] || JSON.stringify({
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
            }));
            if (Variable == "Global") {
                resolve(PopupData);
            }
            else {
                resolve(PopupData[Variable]);
            }
        });
    });
}
function AutomizeSeneca() {
    var Data = {
        "Questions": [],
        "Answers": [],
        "FormatterPlaceholder": ""
    };
    function FindElementWithSpecificTextContent(TextContent, ElementType = "*", isIncludes = false, Parent = document) {
        let PosibleELements = Parent.querySelectorAll(ElementType);
        for (let i = 0; i < PosibleELements.length; i++) {
            let CurrentButtonTextContent = PosibleELements[i].textContent;
            if (isIncludes) {
                if (CurrentButtonTextContent.includes(TextContent)) {
                    return PosibleELements[i];
                }
            }
            else {
                if (CurrentButtonTextContent == TextContent) {
                    return PosibleELements[i];
                }
            }
        }
        return null;
    }
    function GetLatestQuestionAnswerOrStoreIt() {
        (async function () {
            let PopupData = await isPopupDataValueActive("Global");
            if (PopupData["AutoToggleBoxes"]) {
                let SliderQuestionElement = document.querySelector(".Toggles__wrapper:not(.passed)");
                if (SliderQuestionElement) {
                    let Stages = {
                        "linear-gradient(rgb(250, 145, 97), rgb(247, 59, 28))": 1,
                        "linear-gradient(rgb(250, 174, 97), rgb(247, 97, 28))": 2,
                        "linear-gradient(rgb(250, 203, 97), rgb(247, 135, 28))": 3,
                        "linear-gradient(rgb(250, 231, 97), rgb(247, 173, 28))": 4,
                        "linear-gradient(rgb(71, 228, 193), rgb(7, 205, 221))": 5
                    };
                    function GetCurrentStageNumber() {
                        if (SliderQuestionElement) {
                            return Stages[SliderQuestionElement.style.backgroundImage];
                        }
                        else
                            return null;
                    }
                    let SliderContainerElement = SliderQuestionElement.querySelector(".Toggles__singletoggles-container");
                    let SliderOuters = SliderContainerElement?.children;
                    if (SliderOuters) {
                        let SliderCompletionLoop = setInterval(function () {
                            if (SliderOuters) {
                                for (let i = 0; i < SliderOuters.length; i++) {
                                    let CurrentSliderButton = SliderOuters[i].querySelector("button");
                                    if (CurrentSliderButton) {
                                        let BeforeStageNumber = GetCurrentStageNumber();
                                        setTimeout(() => {
                                            if (CurrentSliderButton) {
                                                CurrentSliderButton.click();
                                                let AfterStageNumber = GetCurrentStageNumber();
                                                if (AfterStageNumber < BeforeStageNumber) {
                                                    setTimeout(() => {
                                                        if (CurrentSliderButton)
                                                            CurrentSliderButton.click();
                                                    }, 100 * (i + 1));
                                                }
                                            }
                                        }, 100 * (i + 1));
                                    }
                                }
                                if (GetCurrentStageNumber() >= 5) {
                                    clearInterval(SliderCompletionLoop);
                                    SliderQuestionElement?.classList.add("passed");
                                }
                            }
                        }, 100);
                    }
                }
            }
        })();
        let ContinueButton = FindElementWithSpecificTextContent("Continue", "button");
        if (ContinueButton) {
            ContinueButton.click();
        }
        localStorage.setItem("Data", JSON.stringify(Data));
    }
    setInterval(GetLatestQuestionAnswerOrStoreIt, 2000);
}
AutomizeSeneca();
function SenecaAddCSS() {
    (async function () {
        let PopupData = await isPopupDataValueActive("Global");
        if (PopupData["FillInputBoxes"]) {
            let CustomStyleElement = document.querySelector(".custom-styling");
            if (CustomStyleElement) { }
            else {
                let Styling = document.createElement("style");
                Styling.innerHTML = `
                :root {
                    --user-select-accessibility-setting: default !important;
                    cursor: auto !important;
                }
                [class*='TestedWord_word_skeleton__'] {
                    visibility: visible !important;
                    font-weight: bold !important;
                    color: white;
                    opacity: 0.4
                }
                input[class*='Input_input__'] {
                    text-align: left !important;
                    line-height: 0 !important
                }
                `;
                Styling.classList.add("custom-styling");
                document.body.appendChild(Styling);
            }
        }
        else {
            let CustomStyleElement = document.querySelector(".custom-styling");
            if (CustomStyleElement) {
                CustomStyleElement.remove();
            }
        }
    })();
}
setInterval(SenecaAddCSS, 50);
//# sourceMappingURL=seneca.js.map