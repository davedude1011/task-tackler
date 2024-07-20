"use strict";
console.log("SPARX");
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
function GetButtonBaseTextContent() {
    let Button = document.querySelector("[class*='_ButtonBase_']");
    if (Button) {
        return Button.textContent;
    }
    else {
        return undefined;
    }
}
function GetBookworkCode() {
    let Code = document.querySelector("[class*='_Chip_']");
    if (Code && Code.textContent && Code.textContent.includes("Bookwork code: ")) {
        return Code.textContent.split("Bookwork code: ")[1];
    }
    else {
        return undefined;
    }
}
function SubmitButtonSetup() {
    let AllButtonBases = document.querySelectorAll("[class*='_ButtonBase_']");
    for (let i = 0; i < AllButtonBases.length; i++) {
        if (AllButtonBases[i].textContent == "Submit answer" && !AllButtonBases[i].classList.contains("event-listener-added")) {
            AllButtonBases[i].classList.add("event-listener-added");
            AllButtonBases[i].addEventListener("click", function () {
                let AnswerHTML = document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML;
                if (AnswerHTML) {
                    let CheatSheet = JSON.parse(localStorage.getItem("CheatSheet") || '[]');
                    let CodeExists = false;
                    for (let j = 0; j < CheatSheet.length; j++) {
                        let CheatSheetCode = CheatSheet[j][0];
                        if (CheatSheetCode == GetBookworkCode() && CheatSheetCode) {
                            CodeExists = true;
                            CheatSheet[j][1] = AnswerHTML;
                        }
                    }
                    if (!CodeExists) {
                        let NewCheatSheetItem = [GetBookworkCode(), AnswerHTML];
                        CheatSheet.push(NewCheatSheetItem);
                    }
                    localStorage.setItem("CheatSheet", JSON.stringify(CheatSheet));
                }
            });
        }
    }
    console.log("FUNCTION ON");
}
window.addEventListener("click", function () {
    setTimeout(function () {
        if (GetButtonBaseTextContent() == "Back") {
            SubmitButtonSetup();
        }
    }, 500);
});
function BookworkCheckLoop() {
    try {
        if (document.querySelector("[class*='_DialogTitle_']")?.textContent == "Bookwork check") {
            let BookworkCode = document.querySelector("[class*='_Chip_']")?.textContent?.split(" ")[1];
            let CheatSheet = JSON.parse(localStorage.getItem("CheatSheet") || "[]");
            let answer = `Bookwork Not Found ¯\\_(ツ)_/¯`;
            if (BookworkCode && BookworkCode.length < 20) {
                for (let i = 0; i < CheatSheet.length; i++) {
                    let CheatSheetCode = CheatSheet[i][0];
                    if (CheatSheetCode == BookworkCode) {
                        answer = CheatSheet[i][1];
                    }
                }
                let EditElement = document.querySelector("[class*='_Subtitle_']");
                if (EditElement) {
                    EditElement.innerHTML = answer;
                    EditElement.style.border = "3px solid #190057";
                    EditElement.style.borderRadius = "10px";
                    EditElement.style.padding = "1vw";
                    document.querySelector("[class*='_InlineSlotOptions_']")?.remove();
                    document.querySelector("[id*='button-']")?.remove();
                }
            }
        }
    }
    catch { }
}
function AddCalculator() {
    let QuestionContainerClass = document.querySelector("[class*='_QuestionContainer_']")?.classList[0] || null;
    let Calculators = document.querySelectorAll(".main-calculator");
    if (Calculators.length == 0 && QuestionContainerClass != null) {
        let NewCalculator = document.createElement("iframe");
        NewCalculator.classList.add(QuestionContainerClass);
        NewCalculator.classList.add("main-calculator");
        NewCalculator.src = "https://www.desmos.com/scientific";
        NewCalculator.style.maxWidth = "600px";
        NewCalculator.style.width = "100%";
        NewCalculator.style.margin = "auto 0 1rem 1vw";
        NewCalculator.style.borderRadius = "5px";
        let Container = document.querySelector("[class*='_Activity_']");
        if (Container) {
            Container.style.flexDirection = "row";
            Container.insertBefore(NewCalculator, Container.firstChild);
        }
    }
    function ToggleCalculator() {
        let MainCalculator = document.querySelector(".main-calculator");
        let QuestionElement = document.querySelector("[class*='_QuestionContainer_']:not(.main-calculator)");
        if (MainCalculator && QuestionElement) {
            if (MainCalculator.style.display == "none") {
                MainCalculator.style.display = "block";
                QuestionElement.style.margin = "auto auto 1rem 1vw";
            }
            else {
                MainCalculator.style.display = "none";
                QuestionElement.style.margin = "auto auto 1rem auto";
            }
        }
    }
    let CalculatorText = document.querySelector("[class*='_CalculatorInfoContainer_'] [class*='_HiddenAt_']");
    if (CalculatorText) {
        if (CalculatorText.innerHTML != "Toggle<br>Calculator") {
            CalculatorText.innerHTML = "Toggle<br>Calculator";
            CalculatorText.style.textAlign = "center";
            CalculatorText.style.marginLeft = "5px";
            let CalculatorIcon = document.querySelector("[class*='_CalculatorIcon_']");
            if (CalculatorIcon) {
                CalculatorIcon.src = "https://static.sparxhomework.uk/sw2/4c1c4c893f811a1fa3c1c64624ebdba9e3be9d70/assets/CalculatorAllowed-7c873ab4.svg";
            }
            let CalculatorIconOuter = document.querySelector("[class*='_CalculatorInfoContainer_']");
            if (CalculatorIconOuter) {
                CalculatorIconOuter.addEventListener("click", ToggleCalculator);
                CalculatorIconOuter.style.cursor = "pointer";
                let MainCalculator = document.querySelector(".main-calculator");
                console.log(MainCalculator?.style.display == "none");
                ToggleCalculator();
                if (MainCalculator && MainCalculator.style.display == "block") {
                    ToggleCalculator();
                }
            }
        }
    }
}
function SnipeBookworkCheck() {
    let BookworkCode = document.querySelector("[class*='_Chip_']");
    if (BookworkCode && BookworkCode.textContent?.split(" ")[0] == "Bookwork") {
        BookworkCode.remove();
        let FirstOption = document.querySelector("[class*='_WACOption_']");
        if (FirstOption) {
            FirstOption.click();
            setTimeout(function () {
                let AllSubmitButtons = document.querySelectorAll("[class*='_ButtonBase_']");
                for (let i = 0; i < AllSubmitButtons.length; i++) {
                    let SubmitButton = AllSubmitButtons[i];
                    if (SubmitButton.textContent == "Submit") {
                        SubmitButton.click();
                    }
                }
            }, 50);
        }
    }
    else {
        let AllButtons = document.querySelectorAll("[class*='_ButtonBase_']");
        for (let i = 0; i < AllButtons.length; i++) {
            let RefreshButton = AllButtons[i];
            if (RefreshButton.textContent == "Refresh") {
                RefreshButton.click();
                RefreshButton.remove();
            }
        }
    }
}
function AddCSS() {
    let CustomStyleElement = document.querySelector(".custom-styling");
    if (!CustomStyleElement) {
        let Styling = document.createElement("style");
        Styling.innerHTML = `
        :root {
            --user-select-accessibility-setting: default !important;
            cursor: auto !important;
        }
        `;
        Styling.classList.add("custom-styling");
        document.body.appendChild(Styling);
    }
}
function AddGauthMathLink() {
    let ButtonClass = document.querySelector("[class*='_CalculatorInfoContainer_']")?.classList[0] || null;
    let ExistingGauthButton = document.querySelector(".gauth-button");
    if (!ExistingGauthButton && ButtonClass != null) {
        let NewGauthButton = document.createElement("div");
        NewGauthButton.style.cursor = "pointer";
        NewGauthButton.classList.add(ButtonClass);
        NewGauthButton.classList.add("gauth-button");
        NewGauthButton.innerHTML = `<img class="_CalculatorIcon_5oh8x_23" src="https://sf16-scmcdn-ehi.gauthmath.com/obj/ehi-fe-us/gauth-portal/favicon.png"><div class="_HiddenAt_gk0gx_1 _Sm_gk0gx_12" style="text-align: center; margin-left: 5px;">Gauth</div>`;
        NewGauthButton.addEventListener("click", function () {
            window.open("https://www.gauthmath.com");
        });
        document.querySelector("[class*='_QuestionInfo_']")?.appendChild(NewGauthButton);
        let ButtonContainer = document.querySelector("[class*='_QuestionInfo_']");
        if (ButtonContainer) {
            let BookworkCodeElement = ButtonContainer.children[0];
            let CalculatorButtonElement = ButtonContainer.children[1];
            let CalculatorButtonImage = CalculatorButtonElement.querySelector("img");
            let CalculatorButtonText = CalculatorButtonElement.querySelector("div");
            if (CalculatorButtonText && CalculatorButtonImage) {
                CalculatorButtonImage.style.marginLeft = "0px";
                CalculatorButtonText.style.marginRight = "var(--spx-unit-6)";
            }
            ButtonContainer.insertBefore(CalculatorButtonElement, BookworkCodeElement);
        }
    }
}
function createCrashButton() {
    let crashButton = document.querySelector(".crash-button");
    if (!crashButton) {
        let crashButton = document.createElement("button");
        crashButton.classList.add("crash-button");
        crashButton.classList.add("_NotificationsIconContainer_1fmcf_1");
        crashButton.textContent = "Fake crash";
        crashButton.style.width = "fit-content";
        crashButton.style.paddingLeft = "var(--spx-unit-6)";
        crashButton.style.paddingRight = "var(--spx-unit-6)";
        crashButton.onclick = function () {
            window.open("/page-not-found", "_self");
        };
        let crashButtonContainer = document.querySelector("[class*='_BannerRight_']");
        crashButtonContainer?.appendChild(crashButton);
    }
}
function CleanMenu() {
    if (window.location.pathname == "/student/homework/" || window.location.pathname == "/student/homework") {
        let HomeworksContainer = document.querySelectorAll("[class*='_AccordionItem_9fvag_7']");
        for (let i = 0; i < HomeworksContainer.length; i++) {
            let HomeworkMenu = HomeworksContainer[i];
            if (HomeworkMenu.textContent?.includes("Completed") || HomeworkMenu.textContent?.includes("Introducing Sparx Maths")) {
                HomeworkMenu.style.display = "none";
            }
        }
    }
}
function Loop() {
    (async function () {
        let PopupData = await isPopupDataValueActive("Global");
        if (PopupData["SaveBookworkChecks"]) {
            BookworkCheckLoop();
        }
        if (PopupData["AddCalculator"]) {
            AddCalculator();
        }
        if (PopupData["GauthMathButton"]) {
            AddGauthMathLink();
        }
        if (PopupData["sparx-CleanMenu"]) {
            CleanMenu();
        }
        if (PopupData["sparx-FakeCrash"]) {
            createCrashButton();
        }
        AddCSS();
    })();
}
setInterval(Loop, 50);
//# sourceMappingURL=sparx.js.map