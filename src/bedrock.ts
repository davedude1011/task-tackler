console.log("BEDROCK")
// @ts-ignore
async function isPopupDataValueActive(Variable: string) {
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
            }))

            if (Variable == "Global") { resolve(PopupData); }
            else { resolve(PopupData[Variable]); }
        });
    });
}
//(async function() {
//    let PopupData: any = await isPopupDataValueActive("Global");
//    if (PopupData[""]) {
//
//    }
//})();
  

let LastState: any = null
function AddMorphology() {
    (async function() {
        let PopupData: any = await isPopupDataValueActive("Global");

        let UserState = JSON.parse(localStorage.getItem("state") as string)
        if (PopupData["AddMorphology"]) {
            if (UserState["student"]["access"]["Morphology"] != true) {
                UserState["student"]["access"]["Morphology"] = true;
                localStorage.setItem("state", JSON.stringify(UserState))
            }
        }
        else {
            if (UserState["student"]["access"]["Morphology"] != false) {
                UserState["student"]["access"]["Morphology"] = false;
                localStorage.setItem("state", JSON.stringify(UserState))
            }
        }
        if (LastState != null) {
            if (PopupData["AddMorphology"] != LastState) {
                window.location.reload()
            }
        }
        LastState = PopupData["AddMorphology"]
    })();
}
setInterval(AddMorphology, 50)


function GetUserData() {
    let StringedData = localStorage.getItem("state")
    if (StringedData) {
        return JSON.parse(StringedData)
    }
}
function GetWeeklyProgress() {
    let UserData = GetUserData()
    return UserData["student"]["student"]["pointsWeek"]
}
GetWeeklyProgress()

//<span>Bedrock Points: (2/20)</span>
//<progress id="file" value="32" max="100"></progress>

function SetWeeklyProgress() {
    (async function() {
        let PopupData: any = await isPopupDataValueActive("Global");
        if (PopupData["QuickPointsDisplay"]) {
            let Outer = document.querySelector(".user-controls-group")
            let Points = GetWeeklyProgress()
            if (Outer) {
                Outer.innerHTML = `<span>Points: (<b>${Points}</b>/20)</span>`
            }
            DictionaryButton()
        }
    })();
}
setInterval(SetWeeklyProgress, 50)

function SetDictionary(Word: string) {
    let OuterElement: HTMLElement | null = document.querySelector(".quiz-questions") || document.querySelector(".panel--learning")
    if (OuterElement) {
        OuterElement.style.display = "flex"
        OuterElement.style.flexDirection = "row-reverse"

        let DictionaryElement: HTMLIFrameElement | null = document.querySelector(".dictionary")
        if (DictionaryElement) {
            DictionaryElement.src = `https://www.merriam-webster.com/dictionary/${Word}`
        }
        else {
            let DictionaryElement = document.createElement("iframe")
            DictionaryElement.src = `https://www.merriam-webster.com/dictionary/${Word}`
            DictionaryElement.classList.add("dictionary")
            DictionaryElement.style.width = "30%"

            OuterElement.appendChild(DictionaryElement)
        }
    }
    let LaptopContainer = document.querySelector(".panel--pad.background_image.extra_padded")?.parentElement?.parentElement
    if (LaptopContainer) {
        LaptopContainer.style.width = "70%"
    }
}
function RemoveDictionary() {
    document.querySelector(".dictionary")?.remove()
    // @ts-ignore
    document.querySelector(".no-select")?.parentNode?.removeChild(document.querySelector(".no-select"))
    
    let LaptopContainer = document.querySelector(".panel--pad.background_image.extra_padded")?.parentElement?.parentElement
    if (LaptopContainer) {
        LaptopContainer.style.width = "100%"
    }
}
function DictionaryButton() {
    (async function() {
        let PopupData: any = await isPopupDataValueActive("Global");
        if (PopupData["AddDictionary"]) {
            let DictionaryButton = document.querySelector(".dictionary-button")
            if (DictionaryButton) {}
            else {
                let VocabOuter = document.querySelector(".learning-controls")
                if (VocabOuter) {
                    let NewButton = document.createElement("div")
                    NewButton.innerHTML = `<span _ngcontent-c5="" class="lcb-label">Toggle Dictionary</span>`
                    NewButton.classList.add("lc-button")
                    NewButton.classList.add("lc-button--iconMobile")
                    NewButton.classList.add("dictionary-button")
        
                    NewButton.addEventListener("click", function() {
                        isCalculator = !isCalculator
        
                        if (!isCalculator) {
                            RemoveDictionary()
                        }
                        else {
                            SetDictionary("")
                            var selectionStyle = document.createElement('style');
                            selectionStyle.classList.add("no-select");
                            selectionStyle.textContent = `
                                ::selection {
                                    background: transparent;
                                }
                            `;
                            document.head.appendChild(selectionStyle);
                        }
                    })
            
                    let ExitButton = VocabOuter.querySelector(".lc-button .fa-times-circle")?.parentElement
                    if (ExitButton) {
                        VocabOuter.insertBefore(NewButton , ExitButton)
                    }
                }
            }
        }
        else {
            let DictionaryButton = document.querySelector(".dictionary-button")
            if (DictionaryButton) {
                DictionaryButton.remove()
            }
        }
    })();
}

window.addEventListener("click", function(event) { // runs every time the user clicks anywhere
    let SelectableTextStyle = ":root { --user-select-accessibility-setting: default !important; }"
    let SelectableTextStyleElement = document.createElement("style")
    SelectableTextStyleElement.innerHTML = SelectableTextStyle
    document.head.appendChild(SelectableTextStyleElement)

    try {
        // @ts-ignore
        let ClickedElement: HTMLElement | null = event.target
        if (ClickedElement && ClickedElement.classList.contains("ready")) {
            if (isCalculator) {
                isCalculator = false
                RemoveDictionary()
            }
        }
    }
    catch{}
})
window.addEventListener("contextmenu", function(event) {
    if (isCalculator) {
        event.preventDefault();

        var clickedElement = event.target;
    
        // @ts-ignore
        if (clickedElement.nodeType === Node.TEXT_NODE) {
            // @ts-ignore
            clickedElement = clickedElement.parentNode; // If it's a text node, get its parent element
        }
    
        var selection = window.getSelection();
        // @ts-ignore
        var range = selection.getRangeAt(0);
        var node = range.startContainer;
    
        // Expand the range to include the whole word
        while (range.toString().indexOf(' ') != 0 && range.startOffset > 0) {
            range.setStart(node, range.startOffset - 1);
        }
    
        range.setStart(node, range.startOffset + 1);
    
        do {
            range.setEnd(node, range.endOffset + 1);
        } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '');
    
        var word = range.toString().trim().replace(/[^a-zA-Z]/g, '');
    
        SetDictionary(word);
    }
});

var isCalculator = false