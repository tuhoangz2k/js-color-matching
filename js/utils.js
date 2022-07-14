import {getPlayAgainButton,getTimerElement} from './selectors.js'

function mixedcolor(colors) {
  for(let i = colors.length - 1; i>1;i--) {
    const index=Math.floor(Math.random()*i)
    let tmp=colors[i]
    colors[i] = colors[index]
    colors[index] = tmp
}

}
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor
  const colorList=[];
  const hueList=['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];
  for(let i=0;i<count;i++) {
    const color=randomColor({
      luminosity: 'dark',
      hue: hueList[i%count.length]
   })
   colorList.push(color);
  }
  const newColorList=[...colorList,...colorList];
  mixedcolor(newColorList)
  return newColorList;
}

export function showPlayAgainButton(){
  const playAgainButton=getPlayAgainButton()
  playAgainButton.classList.add('show')
}
export function hidePlayAgainButton(){
  const playAgainButton=getPlayAgainButton()
  playAgainButton.classList.remove('show')
}
export function setTimeText(text){
  const timeElement=getTimerElement()
  timeElement.innerText=text
}
export function createTimer({seconds,onChange,onfinish}){
  let timerId
  function start(){
    let currentSecond=seconds

    timerId=setInterval(() =>{
      onChange(currentSecond)
      --currentSecond
      if(currentSecond<0) {
        clean()
        onfinish()
      };
    },1000)
  }
  function clean(){
    clearInterval(timerId)
    
  }

  return{
    start,
    clean
  }
}