//Important commnets on  26, 59, 61



import { parse } from 'postcss';
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import Webcam from "react-webcam";

export default function  App(){
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const [progressBarWidth, setProgressBarWidth] = React.useState(2)
  const [progressBarDisplay, setProgressBarDisplay] = React.useState("none")
  var ratio = window.devicePixelRatio || 1;
  var width = screen.width * 1;
  var height = screen.height * 1;

  
  const videoConstraints = {
    facingMode: "user",
    frameRate:30,
  };


  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setProgressBarDisplay("block")
    const updateProgressBarWidth = setInterval(()=>{setProgressBarWidth((prev)=>((1000/3000) + prev))},[10])
    setTimeout(() => {
      document.getElementById("stopCapture").click();
      setProgressBarDisplay("none")
      clearInterval(updateProgressBarWidth)
      document.getElementById("upload").click()
    }, [3000])     // 3000 means 3000 miliseconds, change to whatever amount to seconds
  }, [webcamRef, setCapturing, mediaRecorderRef]);



  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );



  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    alert("capturing stopped")
    setTimeout(() => {
      document.getElementById("upload").click()
    }, [1000]) 
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "mediaTypeMP4"
      });
      console.log(blob)
      const url = URL.createObjectURL(blob);
      var fd = new FormData();
      fd.append('scan', blob, 'scan7.mp4');   // changr upl to your file.get name
      console.log("here")
      fetch('http://localhost:5500/upload',    // change URL to your scan server URL
        {
          method: 'post',
          body: fd
        })
        .then(function (response) {
          alert("Scan is successfully uploaded")
          console.log('done');
          console.log(response);
        })
        .catch(function (err) {
          alert("Something wrong happened, please try again")
          console.log(err);
        });
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);


  return (
    <div className=''>
      <Webcam
        style={{
          height: "100vh",
          width: "100%",
          objectFit: "fill",
          position: "absolute"
        }} className=''  audio={false} videoConstraints={videoConstraints} ref={webcamRef} />
      <div className='text-white absolute z-[100] top-8 w-[80vw] left-[10%]'>
          Make sure the console is in view and the camera is focused before starting the scan.
      </div>
      <div class=" w-[100px] h-[20px] z-100 absolute  left-[50vw]  bottom-[80vh]  bg-red-900" style={{ display: `${progressBarDisplay}` }} >
        <div class="bg-[#FF5447] h-[100%]" style={{width:`${progressBarWidth}%`}}></div>
      </div>
      {capturing ?
        <div>
          <div className='absolute bottom-0 w-[100vw] z-100  bg-black h-[50px] ' >
            <div className='bg-[#FF5447] w-[40px] h-[40px] rounded-full mx-auto translate-y-[-17px]' ></div>
          </div>
          <p className='text-red-900 hidden'>Capturing footage</p>
          <button style={{ display: "none" }} id='stopCapture' onClick={handleStopCaptureClick}>Stop Capture</button>
        </div>
        : (
          <div className='absolute bottom-0 w-[100vw] z-100  bg-black h-[50px] ' >
            <div className='bg-[#FF5447] w-[40px] h-[40px] rounded-full mx-auto translate-y-[-17px] ' onClick={handleStartCaptureClick} ></div>
          </div>
        )}
      {recordedChunks.length > 0 && 
        (
          <div className='absolute bottom-0 w-[100vw] z-100  bg-black h-[50px] ' >
          <div className='bg-[#FF5447] w-[40px] h-[40px] rounded-full mx-auto translate-y-[-17px]' ></div>
          <button style={{ display: "none" }} id='upload'  onClick={handleDownload}>Download</button>
          </div>
        )
      }
    </div>
  );
};

