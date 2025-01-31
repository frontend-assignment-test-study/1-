document.addEventListener("DOMContentLoaded", () => {
  protectDocument();
  addBlur();
  resetAddBlur();
  revealDocument();
});

// 1번. 문서보호
const protectDocument = () => {
  const content = document.querySelector(".content");
  const text = content.innerHTML;
  const wordCounts = {};
  const words = text.match(/\b\w{5,}\b/g); // 5글자 이상 단어 추출

  if (words) {
    words.forEach((word) => {
      const lowerWord = word.toLowerCase();
      wordCounts[lowerWord] = (wordCounts[lowerWord] || 0) + 1;
    });
  }

  const wordsToBlur = Object.keys(wordCounts).filter(
    (word) => wordCounts[word] >= 6
  );

  // 블러처리
  wordsToBlur.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    content.innerHTML = content.innerHTML.replace(
      regex,
      `<span class='blurred initial'>${word}</span>`
    );
  });
};

// 2번. 블러 추가
const addBlur = () => {
  document.getElementById("blurBtn").addEventListener("click", () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText || /^\s*$/.test(selectedText)) {
      alert("블러 처리 할 단어 및 문장을 드래그 해주세요.");
      return;
    }

    const selectedWords = selectedText.split(/\s+/).length;
    if (selectedWords > 5) {
      alert("5단어 이상 선택할 수 없습니다.");
      return;
    }

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // 단어 미선택 부분 추출
    let startWord =
      startNode.textContent
        .substring(0, range.startOffset)
        .split(/\s+/)
        .pop() || "";
    let endWord =
      endNode.textContent.substring(range.endOffset).split(/\s+/)[0] || "";

    // index 범위 설정
    const fullText = startNode.textContent;
    console.log("fullText>>>>>>>>>", fullText);
    const startIndex = fullText.lastIndexOf(startWord, range.startOffset);
    const endIndex =
      fullText.indexOf(endWord, range.endOffset) + endWord.length;

    const parent = startNode.parentElement;
    if (parent.classList.contains("blurred")) {
      alert("이미 블러 처리 되어 있습니다.");
      return;
    }

    // 블러 범위 생성
    const newRange = document.createRange();
    newRange.setStart(startNode, startIndex);
    newRange.setEnd(endNode, endIndex);

    const span = document.createElement("span");
    span.classList.add("blurred", "additional");
    newRange.surroundContents(span);

    selection.removeAllRanges();
  });
};

// 3번. 추가 블러 초기화
const resetAddBlur = () => {
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.querySelectorAll(".blurred.additional").forEach((element) => {
      element.classList.remove("additional");
      if (!element.classList.contains("initial")) {
        element.classList.remove("blurred");
      }
    });
  });
};

// 4번. 원문 3초 보기
const revealDocument = () => {
  document.getElementById("removeBlurBtn").addEventListener("click", () => {
    const button = document.getElementById("removeBlurBtn");
    const blurredElements = document.querySelectorAll(".blurred");
    let countdown = 3;

    blurredElements.forEach((element) => {
      element.classList.add("revealed");
    });
    button.disabled = true; // 버튼 비활성화

    //카운트다운
    button.textContent = countdown;
    const interval = setInterval(() => {
      --countdown;
      button.textContent = countdown;

      if (countdown == 0) {
        clearInterval(interval);
        button.textContent = "원본 보기";
        button.disabled = false;

        blurredElements.forEach((element) =>
          element.classList.remove("revealed")
        );
      }
    }, 1000);
  });
};
