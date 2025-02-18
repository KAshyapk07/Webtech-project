import React, { useState } from 'react'
import './CSS/Loginsignup.css'
import cinematics from '../Components/Assets/Background Video/cinematics.mp4'

const Loginsignup = () => {

  const [state,setState] = useState("Login");
  const [formData,setFormData] = useState({
    username: "",
    password:"",
    email:""
  })
  
  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async()=>{
      console.log("Login function executed",formData);
      let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Acceept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response)=>response.json()).then((data)=>responseData=data);
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }
    else{
      alert(responseData.errors)
    }
  }

  const signup = async()=>{
    console.log("Signup function executed",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Acceept:'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(formData)
    }).then((response)=>response.json()).then((data)=>responseData=data);
    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }
    else{
      alert(responseData.errors)
    }
  }


  return (
    <div className="loginsignup">
       <video id='Background-clip' autoPlay muted loop src={cinematics}></video>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state=== "Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text"placeholder=' Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="Email"placeholder=' Email Adress' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder=' Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign Up"?<p className="loginsignup-login">Already Have An Account? <span onClick={()=>{setState("Login")}}>Login here</span></p>:
                           <p className="loginsignup-login">Create A Account <span onClick={()=>{setState("Sign Up")}}>Sign Up</span></p>
        }
        
        
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' required/>
          <p>By continuing , I agree to the terms of use & privacy policyy</p>
        </div>
      </div>
    </div>
  )
}

export default Loginsignup