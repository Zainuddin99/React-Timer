import {React,useState,useRef,useEffect,useReducer} from 'react'
import { FaTrash } from 'react-icons/fa'
import Modal from './Modal'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

function App() {
 const reducer = (state,action) =>{
    if(action === "lapse"){
      return {...state,isModalOpen:true,modalContent:"Time lapsed"}
    }
    if(action === "itemDeleted"){
      return {...state,isModalOpen:true,modalContent:"Item deleted"}
    }
    if(action === "itemsCleared"){
      return {...state,isModalOpen:true,modalContent:"All items cleared"}
    }
    if(action === "closeModal"){
      return {...state,isModalOpen:false}
    }

  }

  const [state,dispach] = useReducer(reducer,{isModalOpen:false,modalContent:""})
  const [timer,setTimer] = useState({h:0,m:0,s:0,ms:0})
  const [timerValue,setTimerValue] = useState();
  const [lapseList,setLapseList] = useState([])
  const startButton = useRef(null)
  const closeButton = useRef(null)
  const resetButton = useRef(null)
  const lapseButton = useRef(null)

useEffect(()=>{
  closeButton.current.disabled = true
  resetButton.current.disabled = true
  lapseButton.current.disabled = true
}
  ,[])

  const startTimer = () =>{
    startButton.current.disabled = true
    closeButton.current.disabled = false
    setTimerValue(setInterval(run,10))
    resetButton.current.disabled = false
    lapseButton.current.disabled = false
  }

  const run = ()=>{
      setTimer((init)=>{
        if(init.ms<99){
        return {...init,ms:init.ms+1}
        }
        if(init.s === 59){
          return {...init,m:init.m+1,s:0,ms:0}
        }
        return {...init,ms:0,s:init.s+1}
      })
    }

  const stopTimer = () =>{
    startButton.current.disabled = false
    closeButton.current.disabled = true
    clearInterval(timerValue)
  }

  const lapseTimer = () =>{
    const a = timer
    setTimer({h:0,m:0,s:0,ms:0})
    let result = ""
    for(let i in a){
      result+=placer(a[i])+" : "
    }
    dispach("lapse")
    let actualResult = result.slice(0,-3)
    setLapseList((list)=>[actualResult,...list])
  }

  const resetTimer = () =>{
    if(timerValue){
      clearInterval(timerValue)
    }
    setTimer({h:0,m:0,s:0,ms:0})
    setLapseList([])
    if(startButton.current.disabled){
      closeButton.current.disabled = true
      startButton.current.disabled = false
    }
    resetButton.current.disabled = true
    lapseButton.current.disabled = true
    if(lapseList.length!==0){
      dispach("itemsCleared")
    }
  }

  const placer = (a) =>{
    if(a<10){
      return '0'+a
    }else{
      return a
    }
  }

  const removeListItem = (id) =>{
    let newList = lapseList.filter((item,index)=>index!==id)
    setLapseList(newList)
    dispach("itemDeleted")
  }

  const closeModal = () =>{
    dispach("closeModal")
  }

  const {h,m,s,ms} = timer
  return (
    <>
      <h1><span>{placer(h)}</span>:<span>{placer(m)}</span>:<span>{placer(s)}</span>:<span>{placer(ms)}</span></h1>
      <center>
        <div className="butns">
      <button onClick={startTimer} ref={startButton}>Start</button>
      <button onClick={stopTimer} ref={closeButton}>Stop</button>
      <button onClick={resetTimer} className="reset" ref={resetButton}>Reset</button>
      <button onClick={lapseTimer} className="lapse" ref={lapseButton}>Lapse</button>
      </div>
      <TransitionGroup component={null}>
      {
        lapseList.map((item,index)=>{
          return(
        <CSSTransition key={index} classNames="lapseItem" timeout={500}>
        <h1 className="lapseItem">
          {item}<span onClick={()=>removeListItem(index)}><FaTrash/></span>
          </h1>
          </CSSTransition>
          )
        })
      }
      </TransitionGroup>
      {lapseList.length===0 && <h3>No Items present</h3>}
      {state.isModalOpen && <Modal open={state.isModalOpen} content={state.modalContent} closeModal={closeModal}/>}
      </center>
      </>
  );
}

export default App;
