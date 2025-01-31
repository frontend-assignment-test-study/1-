document.addEventListener("DOMContentLoaded", () => {
  // DOM elements //////////////////////////////////////////////////
  const blurBtn = document.getElementById("blurBtn");
  const resetBtn = document.getElementById("resetBtn");
  const removeBlurBtn = document.getElementById("removeBlurBtn");
  const countdown = document.getElementById("countdown");
  const content = document.getElementById("content");

  // 유틸리티 함수////////////////////////////////////////////////

  const removeSpecialChars = (str) => {
    let result = "";
    for (let char of str) {
      if (
        (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z") ||
        (char >= "0" && char <= "9")
      ) {
        result += char;
      }
    }
    return result;
  };

  const getSplitWordsArray = (text) => {
    // 연속된 공백문자들(\s)을 기준으로 분리하고 빈 문자열 제거
    return text.split(/\s+/).filter((word) => word.length > 0);
  };

  // 초기 블러 처리 관련 함수////////////////////////////////////////////////
  const getFrequentWordsSet = (words, minLength, minCount) => {
    const wordMap = new Map();
    words.forEach((word) => {
      const cleanWord = removeSpecialChars(word.trim().toLowerCase());
      if (cleanWord && cleanWord.length >= minLength) {
        wordMap.set(cleanWord, (wordMap.get(cleanWord) || 0) + 1);
      }
    });

    return new Set(
      Array.from(wordMap.entries())
        .filter(([_, count]) => count >= minCount)
        .map(([word]) => word)
    );
  };

  const applyBlurToWords = (paragraph, blurWordsSet) => {
    const parts = getSplitWordsArray(paragraph.innerHTML);
    const processed = parts.map((part) => {
      const cleanPart = removeSpecialChars(part);
      return blurWordsSet.has(cleanPart)
        ? `<span class="blurred initial">${part}</span>`
        : part;
    });
    return processed.join(" ");
  };

  const initialBlur = () => {
    const words = getSplitWordsArray(content.innerText);
    const blurWordsSet = getFrequentWordsSet(words, 5, 6);

    Array.from(content.getElementsByTagName("p")).forEach((paragraph) => {
      paragraph.innerHTML = applyBlurToWords(paragraph, blurWordsSet);
    });
  };

  // 블러 처리 관련 함수////////////////////////////////////////////////
  const validateSelection = (selectedText) => {
    if (!selectedText || /^\s*$/.test(selectedText)) {
      alert("블러 처리 할 단어 및 문장을 드래그 해주세요.");
      return false;
    }

    if (selectedText.trim().split(/\s+/).length > 5) {
      alert("5단어 이상 선택할 수 없습니다.");
      return false;
    }

    return true;
  };

  const checkAlreadyBlurred = (paragraph) => {
    if (paragraph.closest(".blurred")) {
      // 부모요소에 blurred 클래스가 있는지 확인
      alert("이미 블러 처리 되어 있습니다.");
      return true;
    }
    return false;
  };

  const findWordBoundaries = (text, startOffset, endOffset) => {
    let startPos = startOffset;
    let endPos = endOffset;

    // 시작 부분이 공백이 아닌 경우에만 단어 시작점 찾기
    if (!/\s/.test(text[startPos])) {
      while (startPos > 0 && !/\s/.test(text[startPos - 1])) {
        startPos--;
      }
    }

    // 끝 부분이 공백이 아닌 경우에만 단어 끝점 찾기
    if (!/\s/.test(text[endPos - 1])) {
      while (endPos < text.length && !/\s/.test(text[endPos])) {
        endPos++;
      }
    }

    return { startPos, endPos };
  };

  // 이벤트 핸들러
  const handleBlurClick = () => {
    const selectedText = window.getSelection().toString();

    if (!validateSelection(selectedText)) return;

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const paragraph = range.commonAncestorContainer.parentElement;

    if (checkAlreadyBlurred(paragraph)) return;

    const { startPos, endPos } = findWordBoundaries(
      range.startContainer.textContent,
      range.startOffset,
      range.endOffset
    );

    const newRange = document.createRange();
    newRange.setStart(range.startContainer, startPos);
    newRange.setEnd(range.startContainer, endPos);

    const blurSpan = document.createElement("span");
    blurSpan.className = "blurred";

    try {
      newRange.surroundContents(blurSpan); // 해당 범위를 element로 둘러싸주는 dom api
    } catch (error) {
      alert("선택한 영역을 다시 확인해주세요.");
      return;
    }

    selection.removeAllRanges();
  };

  const handleResetClick = () => {
    const addedBlurs = document.getElementsByClassName("blurred");
    Array.from(addedBlurs).forEach((element) => {
      if (!element.classList.contains("initial")) {
        // 초기 블러 요소 제외 초기화
        element.outerHTML = element.textContent;
      }
    });
  };

  const handleRemoveBlurClick = () => {
    const blurredElements = document.getElementsByClassName("blurred");
    Array.from(blurredElements).forEach((el) => (el.style.filter = "none"));

    let timeLeft = 3;
    countdown.textContent = timeLeft;

    const timer = setInterval(() => {
      timeLeft--;
      countdown.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timer);
        countdown.textContent = "";
        Array.from(blurredElements).forEach(
          (el) => (el.style.filter = "blur(5px)") // 블러 추가
        );
      }
    }, 1000);
  };

  // 이벤트 리스너 등록
  blurBtn.addEventListener("click", handleBlurClick);
  resetBtn.addEventListener("click", handleResetClick);
  removeBlurBtn.addEventListener("click", handleRemoveBlurClick);

  // 초기화
  initialBlur();
});
