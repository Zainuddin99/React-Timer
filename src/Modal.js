import React,{useEffect} from 'react'

function Modal({content,closeModal,open}) {

    useEffect(()=>{
        const a = setTimeout(closeModal,800)
        return(()=>clearTimeout(a))
    },[])

    return (
        <div>
            <h5>{content}</h5>
        </div>
    )
}

export default Modal
