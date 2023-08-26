import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
// import './styles/record.css';


const WCR = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recording, setRecording] = useState(false);

  const handleStartRecording = () => {
    const options = { mimeType: 'video/webm; codecs=vp9,opus' };
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, options);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => prev.concat(event.data));
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recorded-video.webm';
      a.click();
      URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  };

  return (
    <div>
      <Webcam audio={true} video={true} ref={webcamRef} />

      <div>
        <button onClick={handleStartRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={handleStopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={handleDownload} disabled={recordedChunks.length === 0}>
          Download
        </button>
      </div>

      <p>Status: {recording ? 'Recording...' : 'Not Recording'}</p>
    </div>
  );
};

export default WCR;
