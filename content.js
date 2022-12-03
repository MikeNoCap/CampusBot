function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function getAnswerData(str) {
    let startindex = str.indexOf("var aNode");
    let endindex = str.indexOf(";\n", startindex);
    if (startindex !=-1 && endindex !=-1 &&  endindex  > startindex );
      var parsed = JSON.parse(str.substring(startindex , endindex ).replace("var aNode = ", "")).data;
      var answerObject = Array.isArray(parsed.answers) ? parsed.answers : parsed.answer;
      if (answerObject) {
        delete answerObject.input;
      }
      return answerObject;
}


async function botLoop() {
    while (true) {
        const oppgave = document.getElementById("partial-body");
        let svarScript = oppgave.getElementsByTagName("script")[0];
        svarScript = svarScript.innerText;
        const erOpenTask = svarScript.includes("var isOpenAnswer = true;")
        if (erOpenTask) {
            alert("Denne må desverre gjöres manuelt. Start botten igjen etter denne oppgaven.")
            break;
        }

    
        const answerData = getAnswerData(svarScript);
        const answer = [];
        if (answerData === undefined || typeof answerData == "string" || Array.isArray(answerData)) {
            
        }
        else {
            
            for (let i = 0; i<answerData.numbers.length; i++) {
                answer.push(answerData.numbers[i].number);
            }
            for (let i = 0; i<answerData.formulas.length; i++) {
                answer.push(answerData.formulas[i].formula);
            }
            for (let i = 0; i<answerData.words.length; i++) {
                answer.push(answerData.words[i].word)
            }
        }
    
        const svarSeksjon = oppgave.getElementsByClassName("NodeAnswer");
        const svarInputs = Array.from(svarSeksjon[0].getElementsByTagName("input")).concat(Array.from(svarSeksjon[0].getElementsByTagName("select")))
        console.log(svarInputs)
        for (let i = 0; i<svarInputs.length; i++) {
            if (svarInputs[i].type == "radio") {
                if (svarInputs[i].value === answerData) {
                    svarInputs[i].checked = true;
                    break;
                }
                continue;
            }
            if (svarInputs[i].type == "checkbox") {
                if (answerData.includes(svarInputs[i].value)) {
                    svarInputs[i].checked = true;
                }
                continue;
            }
            const verdi =  answer.length === 0 ? "" : answer[i];
            svarInputs[i].value = verdi;
        }   
        const avgiSvarKnapp = document.getElementById("submit-answer");
        avgiSvarKnapp.click();
        await sleep(250)
        const nesteOppgaveKnapp = document.getElementById("next-task");
        nesteOppgaveKnapp.click();
        await sleep(250)
        
    }
}


botLoop()