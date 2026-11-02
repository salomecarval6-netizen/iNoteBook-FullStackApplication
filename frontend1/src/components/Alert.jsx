// eslint-disable-next-line no-unused-vars
import React from 'react'

const Alert = (props) => {

  const capitalize =(word)=>{
    if(word==="danger")
        word="error"
    const lower=word.toLowerCase();
    return lower.charAt(0).toUpperCase()+lower.slice(1);
  }
  return (

    props.alert &&
      (<div style={{minHeight:'48px'}} className={`alert alert-${props.alert.type === 'danger' || props.alert.type === 'error' ? 'danger' : 'success'} custom-alert`} role="alert">
       <span>{props.alert.type === 'danger' || props.alert.type === 'error' ? '⚠️' : '✅'}</span>
       <strong>{capitalize(props.alert.type)}</strong> {props.alert.message}

     </div>
      )
  )
}

export default Alert;
