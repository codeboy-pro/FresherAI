import React from 'react'
import {  FiArrowLeft } from 'react-icons/fi'
import DownloadBtn from './DownloadBtn'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import ATStemplate from './ATStemplate'

const PriviewResume = ({data,onBack,user,setUser}) => {
    const resumeRef=useRef(null);
    const [scale,setScale]=useState(1);
    
useEffect(() => {
  const updateScale = () => {
    if (window.innerWidth < 640) {
      setScale(0.42);
    } else if (window.innerWidth < 768) {
      setScale(0.58);
    } else if (window.innerWidth < 1024) {
      setScale(0.72);
    } else {
      setScale(0.9);
    }
  };

  updateScale();

  window.addEventListener("resize", updateScale);

  return () => {
    window.removeEventListener("resize", updateScale);
  };
}, []);


  return (
    <div>
        {/* header  */}
        <div>
            <div>
                <h2>Resume Priview</h2>
                <p>
                    Review your Resume before downloading
                </p>
            </div>

            <div>
                <button onClick={onBack}>
                    <FiArrowLeft/>
                    <span className='hidden sm:block'>Back to Edit</span>
                </button>
               <DownloadBtn docRef={resumeRef} user={user} setUser={setUser}/>
            </div>
        </div>


{/* Template  */}
      <div>
               <div>
                <div>
                        <div ref={resumeRef}>
                            <ATStemplate data={data} />
                        </div>
                </div>
               </div>
      </div>
    </div>
  )
}

export default PriviewResume