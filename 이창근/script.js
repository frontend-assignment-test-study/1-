const protectDocument = () => {
  const wordsMap = new Map();
  const documentElement = document.querySelectorAll(".content");

  const documentText = Array.from(documentElement)
    .map((p) => p.innerText)
    .join(" ")
    .split(" ");

  for (let word of documentText) {
    word = word.replace(/[.,]/g, "");
    const currentCount = wordsMap.get(word) || 0;
    wordsMap.set(word, currentCount + 1);
  }

  Array.from(documentElement).forEach((p) => {
    let updatedText = p.innerHTML
      .split(" ")
      .map((word) => {
        const cleanedWord = word.replace(/[.,]/g, "");
        if (wordsMap.get(cleanedWord) >= 6 && cleanedWord.length >= 5) {
          return `<span class="blurred initial-blurred">${word}</span>`;
        }
        return word;
      })
      .join(" ");
    p.innerHTML = updatedText;
  });
};

// 블러 처리할 단어 및 문장 추가하기
const addBlurWord = () => {
  const blurBtn = document.getElementById("blurBtn");

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText || /^\s*$/.test(selectedText)) {
      alert("블러 처리 할 단어 및 문장을 드래그 해주세요.");
      return;
    }

    const wordCount = selectedText.split(/\s+/).length;
    if (wordCount > 5) {
      alert("5단어 이상 선택할 수 없습니다.");
      return;
    }

    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const endNode = range.endContainer;

    let startWord =
      startNode.textContent
        .substring(0, range.startOffset)
        .split(/\s+/)
        .pop() || "";
    let endWord =
      endNode.textContent.substring(range.endOffset).split(/\s+/)[0] || "";

    const fullText = startNode.textContent;
    const startIndex = fullText.lastIndexOf(startWord, range.startOffset);
    const endIndex =
      fullText.indexOf(endWord, range.endOffset) + endWord.length;

    const parent = startNode.parentElement;
    if (parent.classList.contains("blurred")) {
      alert("이미 블러 처리 되어 있습니다.");
      return;
    }

    const newRange = document.createRange();
    newRange.setStart(startNode, startIndex);
    newRange.setEnd(endNode, endIndex);

    const span = document.createElement("span");
    span.classList.add("blurred");
    newRange.surroundContents(span);

    selection.removeAllRanges();
  };

  blurBtn.addEventListener("click", handleSelection);
};

// 블러 초기화 기능
const resetBlur = () => {
  const resetBtn = document.getElementById("resetBtn");

  resetBtn.addEventListener("click", () => {
    const addedBlurredWords = document.querySelectorAll(
      ".content *:not(.initial-blurred).blurred"
    );
    addedBlurredWords.forEach((word) => {
      word.classList.remove("blurred");
    });
  });
};

// 원본 보기 기능
const showOriginalText = () => {
  const originalBtn = document.getElementById("removeBlurBtn");
  let countdown = 3;
  let isBlurred = true;
  let blurredElements = [];

  originalBtn.addEventListener("click", () => {
    if (isBlurred) {
      originalBtn.textContent = countdown;

      blurredElements = Array.from(
        document.querySelectorAll(".blurred, .initial-blurred")
      );

      blurredElements.forEach((word) => {
        word.classList.remove("blurred");
      });

      const interval = setInterval(() => {
        countdown--;
        originalBtn.textContent = countdown;

        if (countdown <= 0) {
          clearInterval(interval);
          originalBtn.textContent = "원본 보기";

          blurredElements.forEach((word) => {
            word.classList.add("blurred");
          });

          countdown = 3;
          isBlurred = true;
          blurredElements = [];
        }
      }, 1000);

      isBlurred = false;
    }
  });
};
// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
  protectDocument();
  addBlurWord();
  resetBlur();
  showOriginalText();
});
