import Header from "./components/Header"
import MainContent from "./components/MainContent"
import { useState, useEffect } from "react"
export default function App(){
  const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useState(()=>{
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return prefers
  })

  function togglemode() {
    setIsDark( prev => !prev)
    
  }
  useEffect(()=>{
    localStorage.setItem('darkMode', isDark);
  if (isDark) {
      document.body.classList.add('dark')
      console.log("set to dark")
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDark])

  return(
    <>
    <Header isDark={isDark} togglemode={togglemode}/>
    <MainContent />
    </>
  )
}