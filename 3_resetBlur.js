export const removeNewlyBlurred = (event) => {
  const blurredElements = document.getElementsByClassName("blurred");
  Array(...blurredElements).forEach((blurred) => {
    if (blurred.id === "new-blurred") {
      blurred.className = "";
      blurred.id = "";
    }
  });
};
