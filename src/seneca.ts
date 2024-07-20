console.log("SENECA")
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

function AutomizeSeneca() {
    // @ts-ignore
    //var Data: any = JSON.parse(localStorage.getItem("Data")) || {
    //    "Questions": [],
    //    "Answers": [],
    //    "FormatterPlaceholder": ""
    //}
    var Data: any = {
        "Questions": [],
        "Answers": [],
        "FormatterPlaceholder": ""
    }
    function FindElementWithSpecificTextContent(TextContent: string, ElementType: string = "*", isIncludes: boolean = false, Parent: any = document) {
        let PosibleELements = Parent.querySelectorAll(ElementType)
        for (let i = 0; i < PosibleELements.length; i++) {
            let CurrentButtonTextContent = PosibleELements[i].textContent
            if (isIncludes) {
                if (CurrentButtonTextContent.includes(TextContent)) {
                    return PosibleELements[i]
                }
            }
            else {
                if (CurrentButtonTextContent == TextContent) {
                    return PosibleELements[i]
                }
            }
        }
        return null
    }
    //function CreateButton() {
    //    let NewButton = document.createElement("button")
    //    NewButton.style.zIndex = "999"
    //    NewButton.style.padding = "5px"
    //    NewButton.style.borderRadius = "5px"
    //    NewButton.style.position = "fixed"
    //    NewButton.style.top = "5px"
    //    NewButton.style.left = "5px"
    //    NewButton.textContent = "Bot this task"
    //    document.body.appendChild(NewButton)
//
    //    NewButton.addEventListener("click", function() {
    //        GetLatestQuestionAnswerOrStoreIt()
    //    })
    //}
    //function PressContinueButton() {
    //    let ContinueButton: HTMLButtonElement | null = FindElementWithSpecificTextContent("Continue", "button")
    //    if (ContinueButton) {
    //        ContinueButton.click()
    //    }
    //    let CheckButton: HTMLButtonElement | null = FindElementWithSpecificTextContent("Check", "button")
    //    if (CheckButton) {
    //        CheckButton.click()
    //    }
    //}
    function GetLatestQuestionAnswerOrStoreIt() {
        //let MultipleChoiceQuestionElement = document.querySelector("[class*='MultipleChoiceCardContents_container__']:not(.passed)")
        //if (MultipleChoiceQuestionElement) { // Multiple Choice Element
        //    let QuestionTitle = MultipleChoiceQuestionElement.querySelector("[class*='MultipleChoiceQuestion_text__']")?.textContent
        //    if (QuestionTitle != null) {
        //        console.log(Data)
        //        if (Data["Questions"].includes(QuestionTitle)) {
        //            let Answer = Data["Answers"][Data["Questions"].indexOf(QuestionTitle)]
        //            if (Answer != null) {
        //                let AnswerElement = FindElementWithSpecificTextContent(Answer, "button", false, MultipleChoiceQuestionElement)
        //                // @ts-ignore
        //                AnswerElement.click()
        //            }
        //            MultipleChoiceQuestionElement.classList.add("passed")
        //        }
        //        else {
        //            let CorrectAnswerButton = MultipleChoiceQuestionElement?.querySelector("[class*='MultipleChoiceButton_button--correct__']")
        //            if (CorrectAnswerButton) {
        //                Data["Questions"].push(QuestionTitle)
        //                Data["Answers"].push(CorrectAnswerButton.textContent)
        //                
        //                MultipleChoiceQuestionElement.classList.add("passed")
        //            }
        //        }
        //    }
        //}

        (async function() {
            let PopupData: any = await isPopupDataValueActive("Global");
            if (PopupData["AutoToggleBoxes"]) {
                let SliderQuestionElement: HTMLElement | null = document.querySelector(".Toggles__wrapper:not(.passed)")
                if (SliderQuestionElement) { // Sliders
                    let Stages: any = {
                        "linear-gradient(rgb(250, 145, 97), rgb(247, 59, 28))": 1, // Red
                        "linear-gradient(rgb(250, 174, 97), rgb(247, 97, 28))": 2, // Dark Orange
                        "linear-gradient(rgb(250, 203, 97), rgb(247, 135, 28))": 3, // Light Orange
                        "linear-gradient(rgb(250, 231, 97), rgb(247, 173, 28))": 4, // Yellow
                        "linear-gradient(rgb(71, 228, 193), rgb(7, 205, 221))": 5 // Blue
                    }
        
                    function GetCurrentStageNumber() {
                        if (SliderQuestionElement) {
                            return Stages[SliderQuestionElement.style.backgroundImage]
                        }
                        else return null
                    }
        
                    let SliderContainerElement = SliderQuestionElement.querySelector(".Toggles__singletoggles-container");
                    let SliderOuters = SliderContainerElement?.children;
                    if (SliderOuters) {
                        let SliderCompletionLoop = setInterval(function() {
                            if (SliderOuters) {
                                for (let i = 0; i < SliderOuters.length; i++) {
                                   let CurrentSliderButton: HTMLButtonElement | null = SliderOuters[i].querySelector("button")
                                   if (CurrentSliderButton) {
                                       let BeforeStageNumber = GetCurrentStageNumber();
                                       setTimeout(() => {
                                           if (CurrentSliderButton) {
                                               CurrentSliderButton.click();
                                               let AfterStageNumber = GetCurrentStageNumber();
        
                                               if (AfterStageNumber < BeforeStageNumber) {
                                                   setTimeout(() => {
                                                       if (CurrentSliderButton) CurrentSliderButton.click();
                                                   }, 100 * (i + 1));
                                               }
                                           }
                                       }, 100 * (i + 1));
                                   }
                                }
                                if (GetCurrentStageNumber() >= 5) {
                                    clearInterval(SliderCompletionLoop)
                                    SliderQuestionElement?.classList.add("passed")
                                }
                            }
                        }, 100)
                    }
        
                }
            }
        })();

        //let ImageListElement = document.querySelector(".ImageList__wrapper:not(.passed)")
        //if (ImageListElement) { // Image List
        //    function RemoveRandomValuesFromInnerHTML(InputString: string) {
        //        let tempDiv = document.createElement('div');
        //        tempDiv.innerHTML = InputString;
        //    
        //        let spanElements = Array.from(tempDiv.querySelectorAll('span[data-notranslate=""]'));
        //        // @ts-ignore
        //        let lastSpanWithContent = spanElements.filter(span => span.textContent.trim() !== '').pop();
        //    
        //        if (lastSpanWithContent) {
        //            // @ts-ignore
        //            lastSpanWithContent.parentNode.removeChild(lastSpanWithContent);
        //        }
        //    
        //        let resultString = tempDiv.innerHTML;
        //        return resultString;
        //    }
        //    Data["FormatterPlaceholder"] = RemoveRandomValuesFromInnerHTML(ImageListElement.innerHTML)
        //    let InputElement: HTMLInputElement | null = ImageListElement.querySelector("input")
        //    if (Data["FormatterPlaceholder"] != null && InputElement != null) {
        //        if (Data["Questions"].includes(Data["FormatterPlaceholder"])) {
        //            let CorrectAnswer = Data["Answers"][Data["Questions"].indexOf(Data["FormatterPlaceholder"])]
        //            if (CorrectAnswer != null) {
        //                InputElement.value = CorrectAnswer
        //                setTimeout(function() {
        //                    PressContinueButton()
        //                }, 5000)
        //            }
        //        }
        //        //else {
        //        //    InputElement.value = "idk"; // answers "idk", cant do a random answer incase its correct and cant find the incorrect element :()
        //        //    PressContinueButton()
        //        //    setTimeout(function() {
        //        //        if (ImageListElement) {
        //        //            let CorrectAnswer = ImageListElement.querySelector(".ImageList__answerBox--incorrect")?.textContent
        //        //            if (CorrectAnswer != null) {
        //        //                Data["Questions"].push(Data["FormatterPlaceholder"])
        //        //                Data["Answers"].push(CorrectAnswer)
        //        //            }
        //        //        }
        //        //    })
        //        //}
        //    }
        //    ImageListElement.classList.add("passed")
        //}

        //let WordPickElement = document.querySelector(".WrongWord:not(.passed)")
        //if (WordPickElement) {
        //    let QuestionTitle = WordPickElement.querySelector(".WrongWord__selectableSentenceWrapper")?.textContent
        //    if (QuestionTitle != null) {
        //        if (Data["Questions"].includes(QuestionTitle)) {
        //            let Answer = Data["Answers"][Data["Questions"].indexOf(QuestionTitle)]
        //            let CrossAnswer = Answer[0]
        //            let ButtonAnswer = Answer[1]
//
        //            let AllWordOptions = WordPickElement.querySelectorAll(".SelectableWord")
        //            if (AllWordOptions.length > 0) {
        //                for (let i = 0; i < AllWordOptions.length; i++) {
        //                    let CurrentWord: any = AllWordOptions[i]
        //                    if (CurrentWord.textContent == CrossAnswer) {
        //                        CurrentWord.click()
        //                    }
        //                }
        //            }
//
        //            setTimeout(function() {
        //                if (WordPickElement) {
        //                    let AllButtonOptions = WordPickElement.querySelectorAll("[class*='MultipleChoiceButton_button__']")
        //                    if (AllButtonOptions.length > 0) {
        //                        for (let i = 0; i < AllButtonOptions.length; i++) {
        //                            let CurrentButton: any = AllButtonOptions[i]
        //                            if (CurrentButton.textContent == ButtonAnswer) {
        //                                CurrentButton.click()
        //                            }
        //                        }
        //                    }
        //                }
        //            }, 100)
        //            WordPickElement.classList.add("passed")
        //        }
        //        else {
        //            if (WordPickElement) {
        //                let CorrectButtonOption = WordPickElement.querySelector(".SelectableWord--crossedOut")
        //                let CrossAnswer = CorrectButtonOption?.textContent
        //                
        //                let CorrectButtonOptionTwo = WordPickElement?.querySelector("[class*='MultipleChoiceButton_button--correct__']")
        //                if (CorrectButtonOptionTwo) {
        //                    let Answer = [CrossAnswer, CorrectButtonOptionTwo.textContent]
//
        //                    Data["Questions"].push(QuestionTitle)
        //                    Data["Answers"].push(Answer)
        //                    
        //                    WordPickElement.classList.add("passed")
        //                }
        //            }
        //        }
        //    }
        //}

        //let BasicInputElementContainer = document.querySelector("span:has([class*='TestedWord_word_skeleton__'], [class*='Input_input_wrapper__']):not(.passed)")
        //if (BasicInputElementContainer) {
        //    let Answer = BasicInputElementContainer.querySelector("[class*='TestedWord_word_skeleton__']")?.textContent
        //    let InputElement: HTMLInputElement | null = BasicInputElementContainer.querySelector("input")
        //    if (InputElement) {
        //        // @ts-ignore
        //        InputElement.select()
        //        setTimeout(function() {
        //            // @ts-ignore
        //            InputElement.value = Answer
        //            setTimeout(function() {
        //                if (InputElement){
        //                    InputElement.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}))
        //                }
        //            }, 500)
        //        }, 100)
        //    }
        //    BasicInputElementContainer.classList.add("passed")
        //}

        //let ListContainer = document.querySelector(".List__container:not(.passed)")
        //if (ListContainer) {
        //    let Title = ListContainer.querySelector(".List_statement")?.textContent
        //    if (Data["Questions"].includes(Title)) {
        //        let Answers = Data["Answers"][Data["Questions"].indexOf(Title)]
        //        let BlankBoxes = ListContainer.querySelectorAll(".BlurredWord__word")
        //        if (Answers.length == BlankBoxes.length) {
        //            for (let i = 0; i < Answers.length; i++) {
        //                let CurrentBoxSpan = BlankBoxes[i].querySelector("span")
        //                if (CurrentBoxSpan) {
        //                    CurrentBoxSpan.textContent = Answers[i]
        //                    CurrentBoxSpan?.classList.add("TestedWord_word_skeleton__ts")
        //                }
        //            }
        //        }
        //        ListContainer.classList.add("passed")
        //    }
        //    else {
        //        setTimeout(function() {
        //            if (ListContainer){
        //                let AllAnswerElements = ListContainer.querySelectorAll(".BlurredWord__word")
        //                console.log(AllAnswerElements)
        //                let AnswerTextArray = []
        //                for (let i = 0; i < AllAnswerElements.length; i++) {
        //                    AnswerTextArray.push(AllAnswerElements[i].querySelector("span")?.textContent)
        //                }
        //                console.log(AnswerTextArray)
        //
        //                Data["Questions"].push(Title)
        //                Data["Answers"].push(AnswerTextArray)
        //                
        //                ListContainer.classList.add("passed")
        //            }
        //        }, 1900)
        //    }
        //}

        let ContinueButton: HTMLButtonElement | null = FindElementWithSpecificTextContent("Continue", "button")
        if (ContinueButton) {
            ContinueButton.click()
        }

        localStorage.setItem("Data", JSON.stringify(Data))
    }
    setInterval(GetLatestQuestionAnswerOrStoreIt, 2000)
    //CreateButton()
}
AutomizeSeneca()

function SenecaAddCSS() {
    (async function() {
        let PopupData: any = await isPopupDataValueActive("Global");
        if (PopupData["FillInputBoxes"]) {
            let CustomStyleElement = document.querySelector(".custom-styling")
            if (CustomStyleElement) {}
            else {
                let Styling = document.createElement("style")
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
                `
                Styling.classList.add("custom-styling")
                document.body.appendChild(Styling)
            }
        }
        else {
            let CustomStyleElement = document.querySelector(".custom-styling")
            if (CustomStyleElement) {
                CustomStyleElement.remove()
            }
        }
    })();
}
setInterval(SenecaAddCSS, 50)