"use strict";
console.log("WORKING");
var gauthData = [];
fetch(chrome.runtime.getURL('outputData.json'))
    .then(response => response.json())
    .then(data => {
    gauthData = data;
})
    .catch(error => console.error('Error loading JSON:', error));
var solveButtonType = "Solution";
function getQuestion() {
    var _a;
    let questionElement = (_a = document.querySelector("[class*='_QuestionWrapper_']")) === null || _a === void 0 ? void 0 : _a.children[0];
    if (questionElement) {
        let questionData = questionElement.innerHTML;
        return questionData;
    }
    return null;
}
function getQuestionAnswer() {
    var _a, _b, _c;
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
        var _a, _b, _c, _d, _e;
        let questionElement = (_a = document.querySelector("[class*='_QuestionWrapper_']")) === null || _a === void 0 ? void 0 : _a.children[0];
        if (questionElement) {
            questionElement.innerHTML = html;
            questionElement = (_b = document.querySelector("[class*='_QuestionWrapper_']")) === null || _b === void 0 ? void 0 : _b.children[0];
            if (questionElement) {
                questionElement.style.all = "unset";
                (_c = questionElement.querySelector("[class*='TextCopy_']")) === null || _c === void 0 ? void 0 : _c.remove();
                (_d = questionElement.querySelector("[class*='AnswerRate_']")) === null || _d === void 0 ? void 0 : _d.remove();
                (_e = questionElement.querySelector("[class*='AnswerLabel_']")) === null || _e === void 0 ? void 0 : _e.remove();
            }
        }
    }
    if (solveButtonType == "Solution") {
        let questionData = getQuestion();
        let isSolutionFound = false;
        if ((localStorage.getItem("lastQuestionHTML") || "") == questionData) {
            changeMenuHtml(localStorage.getItem("lastAnswerHTML") || "");
            isSolutionFound = true;
        }
        else {
            for (let i = 0; i < gauthData.length; i++) {
                if (removeBracketedContent(questionData || "") == removeBracketedContent(gauthData[i].question) &&
                    !((_a = new DOMParser().parseFromString(gauthData[i].answer, 'text/html').body.textContent) === null || _a === void 0 ? void 0 : _a.includes("😉"))) {
                    localStorage.setItem("lastQuestionHTML", questionData || "");
                    changeMenuHtml(gauthData[i].answer);
                    isSolutionFound = true;
                    localStorage.setItem("lastAnswerHTML", gauthData[i].answer);
                    localStorage.setItem("lastHref", window.location.href);
                    break;
                }
            }
        }
        if (!isSolutionFound) {
            let noDataMessage = "<div>Sorry, no solution found :-(</div><br><div>Try entering your question into <a href='https://www.gauthmath.com'>gauthmath.com</a>.</div>";
            localStorage.setItem("lastQuestionHTML", questionData || "");
            changeMenuHtml(noDataMessage);
            isSolutionFound = true;
            localStorage.setItem("lastAnswerHTML", noDataMessage);
            localStorage.setItem("lastHref", window.location.href);
        }
        (_b = document.querySelector(".solve-button")) === null || _b === void 0 ? void 0 : _b.replaceWith(document.createElement("div"));
        solveButtonType = "Question";
    }
    else if (solveButtonType == "Question") {
        changeMenuHtml(localStorage.getItem("lastQuestionHTML") || "LOCAL STORAGE NOT WORKING, TRY REFRESHING PAGE :)");
        (_c = document.querySelector(".solve-button")) === null || _c === void 0 ? void 0 : _c.replaceWith(document.createElement("div"));
        solveButtonType = "Solution";
    }
}
function mainLoop() {
    var _a;
    let solveButton = document.querySelector(".solve-button");
    if (!solveButton) {
        if (window.location.href != localStorage.getItem("lastHref")) {
            solveButtonType = "Solution";
        }
        let bottomBar = ((_a = document.querySelector("[class*='_BottomBar_']")) === null || _a === void 0 ? void 0 : _a.firstChild) || null;
        if (bottomBar) {
            if (bottomBar.children[bottomBar.children.length - 1].textContent == "Answer") {
                solveButton = document.createElement("button");
                solveButton.className = "solve-button _ButtonBase_nt2r3_1 _FocusTarget_1nxry_1 _ButtonMd_nt2r3_35 _ButtonBlue_nt2r3_76 _ButtonContained_nt2r3_111";
                solveButton.textContent = solveButtonType;
                solveButton.addEventListener("click", getQuestionAnswer);
                let badChild = bottomBar === null || bottomBar === void 0 ? void 0 : bottomBar.firstChild;
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
setInterval(mainLoop, 10);
//# sourceMappingURL=function.js.map