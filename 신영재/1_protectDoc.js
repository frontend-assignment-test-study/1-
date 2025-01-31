export const filterWordsToBlurr = () => {
  var wordTimes = {};
  const pTagArray = document.getElementsByTagName("p");
  //<p></p> 사이의 문자열 split
  Array(...pTagArray).forEach((pTag) => {
    const splitedWordsArray = pTag.innerText
      .trim()
      .split(new RegExp("[ .,]+", "g"))
      .filter((word) => word !== "");

    //단어 등장 횟수 count 후 obj 저장
    splitedWordsArray.forEach((word) => {
      if (Object.keys(wordTimes).findIndex((key) => key === word) === -1) {
        wordTimes[word] = 1;
      } else {
        wordTimes[word] += 1;
      }
    });
  });

  //6회 이상 출현한 단어 array 저장 후 리턴
  var toBlurrArray = [];
  Object.keys(wordTimes).forEach((word) => {
    if (wordTimes[word] >= 6 && word.length >= 5) {
      toBlurrArray.push(word);
    }
  });
  return toBlurrArray;
};

export const setBlurr = (toBlurrArray) => {
  const pTagArray = document.getElementsByTagName("p");
  Array(...pTagArray).forEach((pTag) => {
    var innerHTML = pTag.innerHTML;
    const blurReplacer = new RegExp(
      `(\s|^|,|\.|, )${toBlurrArray.join("|")}(\s|,|\.|$)`,
      "g"
    );
    innerHTML = innerHTML.replace(blurReplacer, (subStr) => {
      return `<span class="blurred">${subStr}</span>`;
    });

    pTag.innerHTML = innerHTML;
  });
};
