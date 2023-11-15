/*
  https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
  https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd
  https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
*/
import React, { useEffect, useRef } from 'react';
import './App.css';
import { BitPlayrFactory, ThumbnailPlugin } from 'bitplayr';

function App() {
  const videoElementId = 'video-element'; 
  const bitPlayrRef = useRef(null);

  useEffect(() => {
    // Only initialize if the player isn't already initialized
    if (bitPlayrRef.current === null) {
      const playerOptions = {
        player: 'hls.js', // dash.js | hls.js | video.js
        plugins: [new ThumbnailPlugin()],
        deviceCapabilities: {
          supportsAdvancedFeatures: true,
        },
        sdkConfig: {
          telemetryEnabled: true
        },
        playerConfig: {
          autoplay: true
        }
      };
  
      bitPlayrRef.current = BitPlayrFactory.createPlayer(playerOptions);
      if(bitPlayrRef.current){
        bitPlayrRef.current.initialize(videoElementId, 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8');

        bitPlayrRef.current.on('timeupdate', (event) => {
          console.log('timeupdate', event);
        });
    
        bitPlayrRef.current.on('seeked', (event) => {
          console.log('seeked', event);
        });
      }
    }
  
    return () => {
      // Cleanup logic if necessary
    };
  }, [videoElementId]);

  return (
    <>
        <video width={1280} height={720} id={videoElementId} controls></video>
        <button onClick={() => { bitPlayrRef.current.fullscreen()}}>Go Fullscreen</button>
        <button onClick={() => { bitPlayrRef.current.play()}}>Play</button>
        <button onClick={() => { bitPlayrRef.current.pause()}}>Pause</button>
    </>
  );
}

export default App;
