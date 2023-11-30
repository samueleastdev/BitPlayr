/*
  https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
  https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd
  https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
*/
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { BitPlayr, ThumbnailsExtension, MediatailorExtension, BasicCapabilities, MediatailorService, LogLevel, IVideoService } from 'bitplayr';
import TimeDisplay from './controls/TimeDisplay';
import AdProgress from './controls/AdProgress';

interface IPlayer {
  initialize(vp: IVideoService): unknown;
  on(arg0: string, arg1: (event: any) => void): unknown;
  play: () => void;
  pause: () => void;
  fullscreen: () => void;
  seekTo: (time: number) => void;
}

function App() {
  const videoElementId = 'video-element--sam';
  const bitPlayrRef = useRef<IPlayer | null>(null);
  const progressBarRef = useRef(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [adTime, setAdTime] = useState(0);

  useEffect(() => {
    const initializePlayer = async () => {

      const playerOptions = {
        extensions: [new ThumbnailsExtension(), new MediatailorExtension()],
        deviceCapabilities: new BasicCapabilities({ 
          default: 'hls.js', // dash.js | hls.js | video.js
          playerConfig: {
            videojs: {},
            dash: {
                'streaming': {
                    'abr': {
                        'minBitrate': {
                            'video': -1
                        },
                        'maxBitrate': {
                            'video': 5000
                        },
                        'limitBitrateByPortal': false
                    }
                }
            },
            hls: {
              autoplay: true
            }
          }
         }),
        sdkConfig: {
          logLevel: LogLevel.INFO,
          telemetryEnabled: true
        },
      };

      try {
        
        bitPlayrRef.current = await BitPlayr.createPlayer(videoElementId, playerOptions) as IPlayer;

        // Fetch the video provider URL
        const vp = await BitPlayr.videoProvider(new MediatailorService({
          url: 'https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/session/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8'
        }));
        /*
        const vp = await BitPlayr.videoProvider(new BasicService({
          url: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
        }));*/

        if (!vp) {
          throw new Error('Manifest URL not found');
        }

        const progressBar = document.getElementById('progress');

        bitPlayrRef.current.initialize(vp);

        bitPlayrRef.current.on('timeupdate', (event) => {
          const currentTime = event.currentTime;
          const duration = event.duration;
          setCurrentTime(currentTime);
          setDuration(duration);
          const percentage = (currentTime / duration) * 100;
          progressBar!.style.width = `${percentage}%`;
        });

        bitPlayrRef.current.on('seeked', (event) => {
          // Event handler logic
        });

        bitPlayrRef.current.on('manifestAvailable', (event) => {
          
        });

        bitPlayrRef.current.on('loadedmetadata', (event) => {
          setDuration(event.target.duration);
        });

        bitPlayrRef.current.on('adBreakData', (adBreakData) => {
          console.log('Ad Break Data:', adBreakData);
        });

        bitPlayrRef.current.on('adTrackingPinged', (url) => {
          console.log('Tracking Pinged:', url);
        });

        bitPlayrRef.current.on('adIsPlaying', (data) => {
          setIsAdPlaying(data.isPlaying);
          if(data.isPlaying){
            setPercentage(data.progress);
            setAdTime(data.remainingTime);
          }
        });

      } catch (error) {
        console.error('Player initialization error:', error);
      } finally {
        
      }
    };

    initializePlayer();

    return () => {
      // Cleanup logic if necessary
    };
  }, [videoElementId]);

  
  function play(){
    if(bitPlayrRef.current){
      bitPlayrRef.current.play().then(() => {
        console.log('Playback started successfully');
      })
      .catch((error) => {
        console.error('Error trying to play the media:', error);
      });
    }
  }

  function pause(){
    if(bitPlayrRef.current){
      bitPlayrRef.current?.pause();
    }
  }

  function fullscreen(){
    if(bitPlayrRef.current){
      bitPlayrRef.current?.fullscreen();
    }
  }

  function restart(){
    if(bitPlayrRef.current){
      bitPlayrRef.current.seekTo(0);
      bitPlayrRef.current.play().then(() => {
        console.log('Playback started successfully');
      })
      .catch((error) => {
        console.error('Error trying to play the media:', error);
      });
    }
  }

  function progress(e){
    if (bitPlayrRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * bitPlayrRef.current!.playerStrategy.videoElement.duration; 
      bitPlayrRef.current.seekTo(newTime); 
    }
  }

  function handleDragStart(e) {
    e.preventDefault();
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', handleDragEnd);
  }

  function handleDragging(e) {
    if (bitPlayrRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * bitPlayrRef.current!.playerStrategy.videoElement.duration;
      bitPlayrRef.current.seekTo(newTime); 
    }
  }

  function handleDragEnd() {
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('mouseup', handleDragEnd);
  }

  return (
    <div id='player-container'>
      <video width={1280} height={720} id={videoElementId}></video>
      <AdProgress adPercentage={percentage} adTime={adTime} isAdPlaying={isAdPlaying} />
      <div id='control-bar' style={{ display: isAdPlaying ? 'none' : 'flex' }}>
        <div className="progress-bar" ref={progressBarRef} onClick={progress} onMouseDown={handleDragStart}>
          <div className="progress" id="progress"></div>
        </div>
        <div className='control-bar-buttons'>
          <div className="left-controls">
            <button onClick={play}>Play</button>
            <button onClick={pause}>Pause</button>
            <button onClick={restart}>Restart</button>
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
          <div className="right-controls">
            <button onClick={fullscreen}>Go Fullscreen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
