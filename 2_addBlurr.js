import { alertMsg } from "./alertMsg.js";
export const addBlurr = (event) => {
  const selected = window.getSelection();
  //1. 드래그 한 텍스트 없을 때 alert
  if (selected.rangeCount === 0) {
    alert(alertMsg["noBlank"]);
    return;
  }

  //2.공백, 점 등만 드래그 했을 때 alert
  const range = selected.getRangeAt(0);
  if (new RegExp("^[ .,]+$").test(range.toString())) {
    alert(alertMsg["noBlank"]);
    return;
  }

  //3,이미 blurred인지 체크
  if (!checkAlreadyBlur(range.cloneContents().childNodes)) {
    alert(alertMsg["alreadyBlur"]);
    return;
  }

  //4. 단어 전체로 range 확장 -> 다섯 단어 이상인지 체크
  const extendedRange = extendRange(range);
  if (!checkOverFiveWords(extendedRange)) {
    alert(alertMsg["overFiveWords"]);
    return;
  }
  createBlurredSpan(extendedRange);
};

const extendRange = (range) => {
  const cloneRange = range.cloneRange();
  const startContainer = cloneRange.startContainer;
  const endContainer = cloneRange.endContainer;
  var startOffset = cloneRange.startOffset;
  var endOffset = cloneRange.endOffset;
  while (startOffset > 0) {
    startOffset -= 1;
    if (new RegExp("^[ .,]$").test(startContainer.textContent[startOffset])) {
      break;
    }
  }
  while (endOffset < endContainer.textContent.length - 1) {
    endOffset += 1;
    if (new RegExp("^[ .,]$").test(endContainer.textContent[endOffset])) {
      break;
    }
  }
  cloneRange.setStart(startContainer, startOffset);
  cloneRange.setEnd(endContainer, endOffset);
  return cloneRange;
};

const checkAlreadyBlur = (nodeList) => {
  if (
    Array(...nodeList).findIndex((node) => {
      return node.className === "blurred";
    }) !== -1
  ) {
    return false;
  }
  return true;
};

const checkOverFiveWords = (cloneRange) => {
  const splitedWords = cloneRange
    .toString()
    .trim()
    .split(new RegExp("[ .,]+", "g"));
  if (splitedWords.length >= 5) {
    return false;
  }
  return true;
};

const createBlurredSpan = (range) => {
  const newElement = document.createElement("span");
  newElement.className = "blurred";
  newElement.textContent = range.toString();
  newElement.id = "new-blurred";
  range.deleteContents();
  range.insertNode(newElement);
};
