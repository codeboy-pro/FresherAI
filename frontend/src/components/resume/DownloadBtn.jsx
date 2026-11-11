import { motion } from "motion/react";
import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { useCoins } from "../../apis/user.api";

const DownloadBtn = ({ docRef,user,setUser }) => {
  const handlePdf = useReactToPrint({
    contentRef: docRef,
    documentTitle: "FresherAI-Resume",

    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      @media print {
        html,
        body {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        #resume-document {
          display: block !important;
          width: 210mm !important;
          min-height: 297mm !important;
          height: auto !important;
          margin: 0 !important;
          box-sizing: border-box !important;
          overflow: visible !important;
          transform: none !important;
          box-shadow: none !important;
          background: #ffffff !important;
          break-inside: auto !important;
          page-break-inside: auto !important;
        }

        #resume-document section {
          break-inside: auto;
          page-break-inside: auto;
        }

        #resume-document article {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `,
  });
  const handleDownload = async ()=>{
    try{
       const coinResponse=await useCoins({coins:10,action:"resume-builder"});
            setUser((prev) => ({
              ...prev,
              interviewCoin: coinResponse?.interviewCoin,
            }));

handlePdf();

    }catch(error){
   if(error.response?.status===403){
   return  alert("Not enough interview Coins. ");
   }

   alert(
    error.response?.data?.message || "Something went wrong."
   );
   

    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      whileTap={{ scale: 0.96 }}
      aria-label="Download resume as PDF"
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-200/70 transition-all duration-200 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl sm:w-auto sm:px-4 sm:py-3 sm:text-sm"
    >
      <FiDownload className="h-4 w-4 shrink-0" />

      <span>Download PDF</span>
    </motion.button>
  );
};

export default DownloadBtn;
