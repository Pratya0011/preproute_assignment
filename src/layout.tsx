import React from 'react'
import Sidebar from "./sidebar"

function layout(props : any) {
  return (
    <>
    <Sidebar/>
    {props.children}
    </>
  )
}

export default layout