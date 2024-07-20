import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyBcy5vGOIDu4CLE08wI5uFwc9Andup9z3U",
    authDomain: "tasktackler-828a2.firebaseapp.com",
    projectId: "tasktackler-828a2",
    storageBucket: "tasktackler-828a2.appspot.com",
    messagingSenderId: "232126771357",
    appId: "1:232126771357:web:18de9fa923a6217888a474",
    measurementId: "G-4H8TM3QRFJ"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("WORKING");
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
var gauthData = [];
fetch(chrome.runtime.getURL('compressedData.json'))
    .then(response => response.json())
    .then(data => {
    gauthData = data;
})
    .catch(error => console.error('Error loading JSON:', error));
var solveButtonType = "Solution";
function getQuestion() {
    return document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML || "ERROR FINDING _QuestionWrapper_";
}
function removeBracketedContent(inputString) {
    let output = [];
    let insideBrackets = false;
    for (let char of inputString) {
        if (char === '<') {
            insideBrackets = true;
        }
        else if (char === '>') {
            insideBrackets = false;
        }
        else if (!insideBrackets) {
            output.push(char);
        }
    }
    return output.join('').replace(/&ZeroWidthSpace;/g, "").replace("\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  ", "");
}
function changeMenuHtml(html) {
    let questionElement = document.querySelector("[class*='_QuestionWrapper_']")?.children[0];
    if (questionElement) {
        questionElement.innerHTML = html;
        questionElement = document.querySelector("[class*='_QuestionWrapper_']")?.children[0];
        if (questionElement) {
            questionElement.querySelector("[class*='TextCopy_']")?.remove();
            questionElement.querySelector("[class*='AnswerRate_']")?.remove();
            questionElement.querySelector("[class*='AnswerLabel_']")?.remove();
        }
    }
}
function getQuestionAnswer() {
    function setAnswer(answerData) {
        changeMenuHtml(answerData);
        localStorage.setItem("lastAnswerHTML", answerData);
        localStorage.setItem("lastHref", window.location.href);
    }
    if (solveButtonType == "Solution") {
        let questionData = getQuestion();
        let questionText = removeBracketedContent(questionData || "");
        localStorage.setItem("lastQuestionHTML", questionData || "");
        setAnswer("<div>Searching for matching results...</div>");
        console.log(1);
        setQuestionAnswerLocalStorage(questionText, setAnswer);
        console.log(2);
        setQuestionAnswerDatabase(questionText, setAnswer);
        console.log(3);
        setQuestionAnswerGauth(questionText, setAnswer);
        console.log(4);
        document.querySelector(".solve-button")?.replaceWith(document.createElement("div"));
        solveButtonType = "Question";
    }
    else if (solveButtonType == "Question") {
        console.log("QUESTION");
        changeMenuHtml(localStorage.getItem("lastQuestionHTML") || "LOCAL STORAGE NOT WORKING, TRY REFRESHING PAGE :)");
        document.querySelector(".solve-button")?.replaceWith(document.createElement("div"));
        solveButtonType = "Solution";
    }
}
function setQuestionAnswerGauth(question, setAnswer) {
    for (let i = 0; i < gauthData.length; i++) {
        try {
            if (gauthData[i].question.includes(question) || question.includes(gauthData[i].question)) {
                setAnswer(gauthData[i].answer);
                break;
            }
        }
        catch {
            console.log(i);
        }
    }
}
function setQuestionAnswerLocalStorage(question, setAnswer) {
    if ((localStorage.getItem("lastQuestionHTML") || "") == question) {
        setAnswer(localStorage.getItem("lastAnswerHTML") || "");
    }
}
function setQuestionAnswerDatabase(question, setAnswer) {
    get(ref(database, "questionData")).then((snapshot) => {
        const questionData = snapshot.val();
        if (questionData) {
            for (let i = 0; i < questionData.length; i++) {
                if (removeBracketedContent(questionData[i].question) == question) {
                    setAnswer(questionData[i].answer);
                    break;
                }
                console.log(questionData[i]);
            }
        }
    })
        .catch((error) => {
        console.log(error);
    });
    return question || undefined;
}
function saveQuestionData(questionHTML, answerHTML) {
    console.log("Sparx Saving Data");
    get(ref(database, "questionData")).then((snapshot) => {
        if (snapshot.exists()) {
            let questionData = snapshot.val().filter((element) => (element.question != questionHTML) && (removeBracketedContent(element.question) != removeBracketedContent(questionHTML))) || [];
            const newData = {
                question: questionHTML,
                answer: answerHTML,
            };
            if (!questionData.includes(newData)) {
                questionData.push(newData);
            }
            set(ref(database, "questionData"), questionData)
                .then(() => {
                console.log('Sparx Data Appended correctly :)');
            })
                .catch((error) => {
                console.error('Error appending data:', error);
            });
        }
    });
}
function handleFirebaseSaving() {
    const submitButton = document.querySelectorAll("[class*='_ButtonBase_']");
    for (let i = 0; i < submitButton.length; i++) {
        if (submitButton[i].textContent == "Submit answer" && !submitButton[i].classList.contains("firebase-event-listener-added")) {
            submitButton[i].addEventListener("click", function () {
                let questionHTML = localStorage.getItem("lastQuestionHTML") || "ERROR ACCESSING LOCALSTORAGE LASTQUESTIONHTML";
                let answerHTML = document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML || "ERROR FINDING _QuestionWrapper_";
                saveQuestionData(questionHTML, answerHTML);
            });
            submitButton[i].classList.add("firebase-event-listener-added");
        }
        if (submitButton[i].textContent == "Answer" && !submitButton[i].classList.contains("answer-event-listener-added")) {
            submitButton[i].addEventListener("click", function () {
                if (!document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML.includes("Expert Verified Solution") && !document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML.includes("Gauth AI Solution")) {
                    if (solveButtonType == "Solution") {
                        localStorage.setItem("lastQuestionHTML", document.querySelector("[class*='_QuestionWrapper_']")?.innerHTML || "ERROR FINDING _QuestionWrapper_");
                    }
                }
            });
            submitButton[i].classList.add("answer-event-listener-added");
        }
    }
}
function mainLoop() {
    (async function () {
        let PopupData = await isPopupDataValueActive("Global");
        if (PopupData["ShowAnswers"]) {
            let solveButton = document.querySelector(".solve-button");
            if (!solveButton) {
                if (window.location.href != localStorage.getItem("lastHref")) {
                    solveButtonType = "Solution";
                }
                let bottomBar = document.querySelector("[class*='_BottomBar_']")?.firstChild || null;
                if (bottomBar) {
                    if (bottomBar.children[bottomBar.children.length - 1].textContent == "Answer") {
                        solveButton = document.createElement("button");
                        solveButton.className = "solve-button _ButtonBase_nt2r3_1 _FocusTarget_1nxry_1 _ButtonMd_nt2r3_35 _ButtonBlue_nt2r3_76 _ButtonContained_nt2r3_111";
                        solveButton.textContent = solveButtonType;
                        solveButton.addEventListener("click", getQuestionAnswer);
                        let badChild = bottomBar?.firstChild;
                        if (bottomBar && badChild) {
                            bottomBar.replaceChild(solveButton, badChild);
                        }
                    }
                    else if (solveButtonType == "Question") {
                        solveButtonType = "Solution";
                    }
                }
            }
        }
        handleFirebaseSaving();
    })();
}
setInterval(mainLoop, 10);
//# sourceMappingURL=sparxSolver.js.map