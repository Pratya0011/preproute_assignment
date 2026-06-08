import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { handleSidebarToggle } from '../../_store/reducer/commonStore'

function AddQuestions() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(handleSidebarToggle(false))
    },[])
  return (
    <div>AddQuestions</div>
  )
}

export default AddQuestions