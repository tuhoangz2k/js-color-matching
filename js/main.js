import { GAME_STATUS ,PAIRS_COUNT} from './constants.js'
import {getRandomColorPairs, showPlayAgainButton, hidePlayAgainButton,setTimeText,createTimer} from './utils.js'
import {getColorElementList,getListColorElement,getNotActiveElements,getPlayAgainButton,getColorBackground} from './selectors.js'
// Global variables

let selections = []
let gameState = GAME_STATUS.PLAYING
let timer=createTimer({
    seconds:60,
    onChange:onChange,
    onfinish:onFinish
})
function onChange(second) {
    setTimeText(second)
    console.log(second);
}
function onFinish() {
    setTimeText('you lose')
    showPlayAgainButton()
    gameState = GAME_STATUS.FINISHED
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function reset() {
   selections = []
 gameState = GAME_STATUS.PLAYING
    // remove active 

    const liList=getColorElementList()
    liList.forEach(li=>{
        li.classList.remove("active")
        delete li.dataset.color
    })
    // color
    initColorElements()
    setTimeText('')
    hidePlayAgainButton()
    timer.start()
    let backgroundColor=getColorBackground()
    backgroundColor.style.backgroundColor='goldenrod'
}

function handleAgainButtonClick(){
    const playAgainButton=getPlayAgainButton()
    if(!playAgainButton)return
    playAgainButton.addEventListener("click",reset)
}

function handleClickElement(liElement){
    const isPause=[GAME_STATUS.BLOCKING,GAME_STATUS.FINISHED].includes(gameState)
    const isClicked=liElement.classList.contains('active')
    if(!liElement||isPause||isClicked)return;
    liElement.classList.add('active');
   
    selections.push(liElement);
//    check match 
if(selections.length<2)return ;
const firstColor=selections[0].dataset.color
const secondColor=selections[1].dataset.color
const isMatch=firstColor===secondColor


if(isMatch){
    // check win
    const isNotActive=getNotActiveElements()
    // if win
    let backgroundColor=getColorBackground()
    backgroundColor.style.backgroundColor=selections[0].dataset.color
    if(isNotActive.length===0){
        selections=[]
        gameState=GAME_STATUS.FINISHED
        showPlayAgainButton()
        setTimeText('you win')
        timer.clean()
        return;
    }
    // if not win
    selections=[]
    gameState=GAME_STATUS.PLAYING
    // not win
}else{
    // remove active
    gameState=GAME_STATUS.BLOCKING
    setTimeout(() =>{
        selections.forEach(color=>{
            color.classList.remove('active')
        })
        selections=[]
        if(gameState!==GAME_STATUS.FINISHED){
            gameState=GAME_STATUS.PLAYING

        }
    },500)
}
 
}
function attachEventForColorList(){
    const ulElement=getListColorElement()
    ulElement.addEventListener("click",(e) =>{
        if(e.target.tagName!=="LI") return;
            
            handleClickElement(e.target)
    })
}

function initColorElements() {
   const colorList= getRandomColorPairs(PAIRS_COUNT)
   const liElement=getColorElementList()
   liElement.backgroundColor
   liElement.forEach((element,index)=>{
    element.dataset.color=colorList[index]
   const overlay= element.querySelector('.overlay')
   overlay.style.backgroundColor=colorList[index]
   })
   
}
// main 
(()=>{

    // init color element
    initColorElements()
    attachEventForColorList()
    handleAgainButtonClick()
    timer.start()
})()