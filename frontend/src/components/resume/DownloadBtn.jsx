import React from 'react'
import { FiDownload } from 'react-icons/fi'
import { useReactToPrint } from "react-to-print";
const DownloadBtn = ({docRef,user,setUser}) => {
  const handlePdf = useReactToPrint({
    contentRef: () => docRef.current,
    documentTitle: "FresherAIPDF"
  });

  const handleDownload=()=>{
    handlePdf();
  }
  return (
    <button onClick={handleDownload}>
        <FiDownload/>
        Download PDF
    </button>
  )
}

export default DownloadBtn