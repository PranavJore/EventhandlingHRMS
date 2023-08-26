import React, { useState, useRef } from 'react';
import RecordRTC from 'recordrtc';
import WCR from './cameraRecord';
// import './styles/record.css';

function RecordingComponent() {
  const [screenStr, setScreenStr] = useState(null);
  const [cameraStr, setCameraStr] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [addBlob, setaddBlob] = useState(null);

  const videoRefs = {
    screen: useRef(null),
    camera: useRef(null),
  };

  const startRecording = async () => {
    const screenStr = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const cameraStr = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    setScreenStr(screenStr);
    setCameraStr(cameraStr);

    const addStream = new MediaStream([...screenStr.getTracks(), ...cameraStr.getTracks()]);

    const recorder = new RecordRTC(addStream, {
      type: 'video',
      mimeType: 'video/webm',
    });

    recorder.startRecording();
    setRecorder(recorder);
  };

  const stopRecording = () => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      setaddBlob(blob);
    });
    screenStr.getTracks().forEach(track => track.stop());
    cameraStr.getTracks().forEach(track => track.stop());
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording </button>
      <div className="video-container">
        <video ref={videoRefs.screen} controls src={addBlob && URL.createObjectURL(addBlob)} />
        <div><a href={addBlob && URL.createObjectURL(addBlob)} download="combinedRecording.webm">
          Download Screen Recording
        </a>
        </div><br/><br/>
      </div>
      {/* <div className="video-container">
        <video ref={videoRefs.camera} controls srcObject={cameraStream} />
        <a href={cameraStream && URL.createObjectURL(cameraStream)} download="cameraRecording.webm">
          Download Camera Recording
        </a>
      </div> */}
      <WCR />
    </div>
  );
}

export default RecordingComponent;
