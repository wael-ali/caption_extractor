
console.log('--- --- --- --- --- ---')
console.log('devtools-panel.js')
console.log('--- --- --- --- --- ---')

class PanelDom {
  emptyHtmlTagText(htmlNode) {
    htmlNode.innerHTML = '';
  }

  hide(htmlNode) {
    htmlNode.classList.add('hide');
  }
  show(htmlNode) {
    htmlNode.classList.remove('hide');
  }

  createAccordion(buttonText, panelText, panelFullText) {
    console.log('add-accordion is clicked');
    const button = document.createElement('button');
    button.innerHTML = buttonText;
    button.classList.add('accordion');
    button.addEventListener("click", function () {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.style.color = 'var(--dark-bg-color)';
    const entries_p = document.createElement('p');
    entries_p.innerHTML = panelText;
    const fulltext_p = document.createElement('p');
    fulltext_p.innerHTML = panelFullText;
    panel.appendChild(entries_p);
    panel.appendChild(fulltext_p);

    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('accordion-container');
    accordionContainer.appendChild(button);
    accordionContainer.appendChild(panel);
    return accordionContainer;
  }
}

class SrtEntry {
  constructor(id, time, text) {
    this.id = id;
    this.time = time;
    this.text = text;
  }

  getText() {
    return ` ${this.text}`;
  }

  toString() {
    return `${this.id} <br> ${this.time} <br> ${this.text}`
  }
}

class SrtParser {

  // return every srt file as array of objects every time entry will be an object
  // like: {id: "1", time: "00:00:00,000 --> 00:00:07,746", text: "the first text in srt"}
  // srtContent is array ['srt file text', 'text/srt']
  getObjectsArray(srtContent) {
    return this.getObjectsArrayFromText(srtContent[0]);
  }

  getObjectsArrayFromText(srtText) {
    const data = [];
    const dataLines = srtText.split('\n\n');
    dataLines.forEach(line => {
      const lineDataArray = line.split('\n');
      data.push(new SrtEntry(lineDataArray[0], lineDataArray[1], lineDataArray[2]));
    })
    return data;
  }
}

class SrtText {

  getAllSrtDataEntriesAsString(srtEntries) {
    let contentText = '';
    srtEntries.forEach(srtEntry => {
      contentText += `${srtEntry} <br> <br>`;
    });
    return contentText;
  }

  getTextOnlyFromSrtEntries(srtEntries) {
    let contentText = 'Long Text: <br>';
    srtEntries.forEach(srtEntry => {
      contentText += ` ${srtEntry.text}`;
    });
    return contentText;
  }

}

class SrtHelper {
  srtFileExtension = '.srt';

  isSrtFile(url) {
    const lastFourCharachters = url.slice(url.length - this.srtFileExtension.length);
    return lastFourCharachters === this.srtFileExtension;
  }

  getUrlWithOutQueryParams(url) {
    const constArray = url.split('?');
    return constArray[0];
  }
}


// initiate all objects
const srtParser = new SrtParser();
const srtText = new SrtText();
const panelDom = new PanelDom();
const srtHelper = new SrtHelper();
// DOM
const accordionList = document.getElementById('accordionList');
const loadingModal = document.getElementById('loadingModal');

document.getElementById("clear_network_list").addEventListener("click", () => {
  panelDom.emptyHtmlTagText(accordionList);
  accordionList.innerHTML = "List of srt entries goes here.";
});

document.getElementById("getNetWork").addEventListener("click", () => {
  panelDom.show(loadingModal);
  browser.devtools.network.getHAR().then(logs => {
    if (logs.entries.length > 0) {
      panelDom.emptyHtmlTagText(accordionList);
      logs.entries.forEach(element => {
        if (srtHelper.isSrtFile(srtHelper.getUrlWithOutQueryParams(element.request.url))) {
          const accordion = panelDom.createAccordion(
            srtHelper.getUrlWithOutQueryParams(element.request.url),
            srtText.getAllSrtDataEntriesAsString(srtParser.getObjectsArrayFromText(element.response.content.text)),
            srtText.getTextOnlyFromSrtEntries(srtParser.getObjectsArrayFromText(element.response.content.text))
          );
          accordionList.appendChild(accordion);
        }
      });
      panelDom.hide(loadingModal)
    } else {
      const divElement = document.createElement('div');
      divElement.innerHTML = 'none'
      accordionList.appendChild(divElement);
      panelDom.hide(loadingModal)
    }

  })
});

function requestListner(harItem) {
  if (srtHelper.isSrtFile(srtHelper.getUrlWithOutQueryParams(harItem.request.url))) {
    panelDom.show(loadingModal);
    panelDom.emptyHtmlTagText(accordionList);

    const divElement = document.createElement('div');
    harItem.getContent().then(content => {
      const accordionNode = panelDom.createAccordion(
        srtHelper.getUrlWithOutQueryParams(harItem.request.url),
        srtText.getAllSrtDataEntriesAsString(srtParser.getObjectsArray(content)),
        srtText.getTextOnlyFromSrtEntries(srtParser.getObjectsArray(content))
        );
      accordionList.appendChild(accordionNode);
      panelDom.hide(loadingModal);
    });
  }

}

browser.devtools.network.onRequestFinished.addListener(requestListner);


// Accordion js
// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function () {
//     /* Toggle between adding and removing the "active" class,
//     to highlight the button that controls the panel */
//     this.classList.toggle("active");

//     /* Toggle between hiding and showing the active panel */
//     var panel = this.nextElementSibling;
//     if (panel.style.display === "block") {
//       panel.style.display = "none";
//     } else {
//       panel.style.display = "block";
//     }
//   });
// }


