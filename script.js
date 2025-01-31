import { filterWordsToBlurr, setBlurr } from "./1_protectDoc.js";
import { addBlurr } from "./2_addBlurr.js";
import { removeNewlyBlurred } from "./3_resetBlur.js";
import { removeBlur3Seconds } from "./4_viewOrigin.js";

//1. 문서 보호하기
//blur 처리 조건에 해당되는 단어 array 리턴
const toBlurrArray = filterWordsToBlurr();
setBlurr(toBlurrArray);

//2. 블러 처리 할 단어 및 문장 추가하기
//드래그 한 후 블러 처리 : 블러 추가 버튼 활성화
const blurBtn = document.getElementById("blurBtn");
blurBtn.addEventListener("click", (event) => addBlurr(event));

//3.블러 초기화
//블러 초기화 버튼 활성화
const resetBtn = document.getElementById("resetBtn");
//블러 된 것 중 id = new blurred만을 blurred 지움
resetBtn.addEventListener("click", (event) => removeNewlyBlurred(event));

//4.문서 원본 보기
//원본 보기 버튼 활성화
const removeBlurBtn = document.getElementById("removeBlurBtn");
removeBlurBtn.addEventListener("click", (event) => removeBlur3Seconds(event));
