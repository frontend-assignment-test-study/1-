export const removeBlur3Seconds = (event) => {
  //블러 처리 된 태그들 임시로 클래스 이륾 변경
  const blurredElements = document.getElementsByClassName("blurred");
  console.log(Array(...blurredElements)[0]);
  Array(...blurredElements).forEach((element) => {
    element.className = "temp-removed";
  });
  //3초 뒤 다시 blurred로 클래스 이름 변경
  setTimeout(() => {
    const removedElement = document.getElementsByClassName("temp-removed");
    Array(...removedElement).forEach((element) => {
      element.className = "blurred";
    });
  }, 3000);
};
