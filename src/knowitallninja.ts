console.log("KNOWITALLNINJA")

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

function improveQuestionUi() {
    let allQuestionButtons = document.querySelectorAll(".wpProQuiz_QuestionButton, .wpProQuiz_question_page")
    for (let i = 0; i < allQuestionButtons.length; i++) {
        let element: any = allQuestionButtons[i]
        if (element.textContent.includes("Question")) {
            element.style.display = "block"
        }
        else if (element.value == "Check") {
            element.style.display = "block"
            element.style.marginLeft = "10px"
        }
        //else {
        //    button.remove()
        //}
    }
    //let questionListItems = document.querySelectorAll(".wpProQuiz_listItem")
    //for (let i = 0; i < questionListItems.length; i++) {
    //    let listItem: any = questionListItems[i]
    //    listItem.style.display = "block"
    //}
}

function revealCourseData() {
    let knowitallninjaData = document.querySelector(".knowitallninja-data")
    if (!knowitallninjaData) {
        let bodyClass = document.querySelector("body")?.classList
        if (bodyClass) {
            let postId
            let quiz
            let course_id
            let lesson_id
            let topic_id
            for (let i = 0; i < bodyClass.length; i++) {
                let classItem = bodyClass[i]
                if (classItem.includes("postid-")) { postId = classItem.split("postid-")[1] }
                else if (classItem.includes("learndash-cpt-sfwd-quiz-")) { quiz = classItem.split("learndash-cpt-sfwd-quiz-")[1] }
                else if (classItem.includes("learndash-cpt-sfwd-courses-")) { course_id = classItem.split("learndash-cpt-sfwd-courses-")[1] }
                else if (classItem.includes("learndash-cpt-sfwd-lessons-")) { lesson_id = classItem.split("learndash-cpt-sfwd-lessons-")[1] }
                else if (classItem.includes("learndash-cpt-sfwd-topic-")) { topic_id = classItem.split("learndash-cpt-sfwd-topic-")[1] }
            }
            let contentContainer = document.querySelector(".ld-focus-content")
            if (contentContainer) {
                let dataContainer = document.createElement("div")
                dataContainer.innerHTML = `
                    <ul>
                        <li>Post ID: ${postId}</li>
                        <li>Quiz: ${quiz}</li>
                        <li>Course ID: ${course_id}</li>
                        <li>Lesson ID: ${lesson_id}</li>
                        <li>Topic ID: ${topic_id}</li>
                    </ul>
                `
                dataContainer.classList.add("knowitallninja-data")
                contentContainer.appendChild(dataContainer)
            }
            console.log(bodyClass)
        }
    }
}

// @ts-ignore
function mainLoop() {
    (async function() {
        let PopupData: any = await isPopupDataValueActive("Global");
        if (PopupData["AddQuestionChecking"]) { improveQuestionUi() }
        if (PopupData["DevData"]) { revealCourseData() }
    })();
}
setInterval(mainLoop, 100)