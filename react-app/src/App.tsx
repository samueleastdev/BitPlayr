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
import ProgressBar from './controls/ProgressBar';

// Importing MUI Icons and Styles
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';

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
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adBreaks, setAdBreaks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [adTime, setAdTime] = useState(0);
  const [bufferedAhead, setBufferedAhead] = useState(0);
  const [bufferedBehind, setBufferedBehind] = useState(0);

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

        bitPlayrRef.current.initialize(vp);

        bitPlayrRef.current.on('timeupdate', (event) => {
          const currentTime = event.currentTime;
          const duration = event.duration;
          setCurrentTime(currentTime);
          setDuration(duration);

          const videoElement = bitPlayrRef!.current!.playerStrategy!.videoElement;
          if (videoElement && videoElement.buffered.length > 0) {
            const bufferEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
            setBufferedAhead(Math.max(0, bufferEnd - currentTime)); // Ensure it's not negative
            setBufferedBehind(Math.max(0, currentTime - videoElement.buffered.start(0))); // Ensure it's not negative
          }

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
          const parsedAdBreaks = adBreakData.map(adBreak => {
            return {
              startTime: adBreak.startTimeInSeconds,
              duration: adBreak.durationInSeconds
            };
          });
          setAdBreaks(parsedAdBreaks);
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

  const togglePlayPause = () => {
    if (bitPlayrRef.current) {
      if (isPlaying) {
        bitPlayrRef.current.pause();
      } else {
        bitPlayrRef.current.play().then(() => {
          console.log('Playback started successfully');
        })
        .catch((error) => {
          console.error('Error trying to play the media:', error);
        });
      }
      setIsPlaying(!isPlaying); // Toggle the playing state
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

  const handleSeek = (newTime) => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.seekTo(newTime);
    }
  };

  return (
    <div id='player-container'>
      <video width={1280} height={720} id={videoElementId}></video>
      <AdProgress adPercentage={percentage} adTime={adTime} isAdPlaying={isAdPlaying} />
      <div id='control-bar' style={{ display: isAdPlaying ? 'none' : 'flex' }}>
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          bufferedAhead={bufferedAhead} 
          bufferedBehind={bufferedBehind}
          adBreaks={adBreaks}
          onSeek={handleSeek} 
        />
        <div className='control-bar-buttons'>
          <div className="left-controls">
            <IconButton onClick={togglePlayPause} color="primary">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton onClick={restart} color="primary">
              <RestartAltIcon />
            </IconButton>
            <TimeDisplay currentTime={currentTime} duration={duration} />
          </div>
          <div className="right-controls">
            <IconButton onClick={fullscreen} color="primary">
              <FullscreenIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
