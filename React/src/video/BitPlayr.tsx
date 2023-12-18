/*
  https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
  https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd
  https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd
  https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
*/
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './BitPlayr.css';
import {
  BitPlayr,
  ThumbnailsExtension,
  MediatailorExtension,
  BasicCapabilities,
  MediatailorService,
  LogLevel,
  IVideoService,
  BasicService,
  ITrack,
  IQualityLevel,
  BifsExtension,
  BasePlayer,
  GoogleAnalyticsExtension,
} from 'bitplayr';
import TimeDisplay from './controls/TimeDisplay';
import AdProgress from './controls/AdProgress';
import ProgressBar from './controls/ProgressBar';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';

// Controls
import QualityLevels from './controls/QualityLevels';
import SubtitleTracks from './controls/SubtitleTracks';
import AudioTracks from './controls/AudioTracks';
import BifScrubber from './controls/BifScrubber';

function BitPlayrVideo() {
  const videoElementId = 'video-element';
  // useRef
  const bitPlayrRef = useRef<BasePlayer | null>(null);
  const bifsExtensionRef = useRef<BifsExtension | null>(null);
  const bifScrubberTimeRef = useRef(0);
  // useState
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adBreaks, setAdBreaks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [adTime, setAdTime] = useState(0);
  const [bufferedAhead, setBufferedAhead] = useState(0);
  const [bufferedBehind, setBufferedBehind] = useState(0);
  const [qualityLevels, setQualityLevels] = useState<any[]>([]);
  const [subtitleTracks, setSubtitleTracks] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [mainThumbnail, setMainThumbnail] = useState('');
  const [sideThumbnails, setSideThumbnails] = useState([]);
  const [isBifScrubberVisible, setIsBifScrubberVisible] = useState(false);

  const [fastForwardIntervalId, setFastForwardIntervalId] = useState(null);
  const [rewindIntervalId, setRewindIntervalId] = useState(null);

  const [focusedButton, setFocusedButton] = useState('playPause');

  useEffect(() => {
    const initializePlayer = async () => {
      const thumbnailsExtension = new ThumbnailsExtension();
      const mediatailorExtension = new MediatailorExtension();

      const bifsExtension = new BifsExtension();

      bifsExtensionRef.current = bifsExtension;

      const playerOptions = {
        extensions: [bifsExtension, new GoogleAnalyticsExtension()],
        playerConfig: {
          global: {
            startTime: 25,
            preferredLanguage: 'en',
          },
          dash: {
            streaming: {
              abr: {
                minBitrate: {
                  video: -1,
                },
                maxBitrate: {
                  video: 5000,
                },
                limitBitrateByPortal: false,
              },
            },
            drm: {
              'com.widevine.alpha': {
                serverURL: 'YOUR_WIDEVINE_LICENSE_SERVER_URL',
              },
              'com.microsoft.playready': {
                serverURL: 'YOUR_PLAYREADY_LICENSE_SERVER_URL',
              },
            },
          },
          hls: {
            drmSystemOptions: {
              widevine: {
                licenseUrl: 'YOUR_WIDEVINE_LICENSE_SERVER_URL',
              },
              playready: {
                licenseUrl: 'YOUR_PLAYREADY_LICENSE_SERVER_URL',
              },
            },
          },
          shaka: {
            drm: {
              servers: {
                'com.widevine.alpha': 'https://widevine-license-server-url',
                'com.microsoft.playready': 'https://playready-license-server-url',
                // Add other DRM systems and their license servers if needed
              },
            },
            // Streaming configurations
            streaming: {
              // Sets the rebuffering goal in seconds. The player will buffer this much
              // content before resuming playback after a buffer underrun.
              rebufferingGoal: 2,

              // Sets the buffering goal in seconds. The player will try to keep this
              // much content buffered ahead of the playhead. This value must be
              // greater than or equal to the rebuffering goal.
              bufferingGoal: 10,

              // Sets the number of seconds of content that the streaming engine will
              // try to keep buffered ahead of the playhead when it is forced to buffer
              // in low bandwidth situations.
              bufferBehind: 30,

              // Whether to ignore text stream adaptation set by the abr manager.
              ignoreTextStreamFailures: true,
            },
          },
        },
        sdkConfig: {
          logLevel: LogLevel.INFO,
          telemetryEnabled: true,
        },
      };

      try {
        const device = await BitPlayr.initialiseDevice();

        bitPlayrRef.current = await BitPlayr.createPlayer(videoElementId, playerOptions, device);

        /*
        const vp = await BitPlayr.videoProvider(
          new MediatailorService({
            url: 'https://ad391cc0d55b44c6a86d232548adc225.mediatailor.us-east-1.amazonaws.com/v1/session/d02fedbbc5a68596164208dd24e9b48aa60dadc7/singssai/master.m3u8',
          }),
        );*/

        const vp = await BitPlayr.videoProvider(
          new BasicService({
            //url: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
            //url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
            url: 'https://d1wkjvw8nof1jc.cloudfront.net/5fc11f81-4458-4632-a8a8-d9406cd27f14/master.m3u8',
            bif: 'https://d1wkjvw8nof1jc.cloudfront.net/5fc11f81-4458-4632-a8a8-d9406cd27f14/master.bif',
          }),
        );

        if (!vp) {
          throw new Error('Manifest URL not found');
        }

        bitPlayrRef.current.load(vp);

        bitPlayrRef.current.on('timeupdate', (event) => {
          const videoElement = bitPlayrRef!.current!.videoElement;

          const currentTime = videoElement.currentTime;
          const duration = videoElement.duration;
          setCurrentTime(currentTime);
          setDuration(duration);

          if (videoElement && videoElement.buffered.length > 0) {
            const bufferEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
            setBufferedAhead(Math.max(0, bufferEnd - currentTime));
            setBufferedBehind(Math.max(0, currentTime - videoElement.buffered.start(0)));
          }
        });

        bitPlayrRef.current.on('seeked', (event) => {});

        bitPlayrRef.current.on('manifestAvailable', (event) => {});

        bitPlayrRef.current.on('qualitySwitch', (data) => {
          console.log('qualitySwitch', data);
        });

        bitPlayrRef.current.on('qualityLevels', (data) => {
          setQualityLevels(data);
        });

        bitPlayrRef.current.on('tracks', (data) => {
          setSubtitleTracks(data.subtitles);
          setAudioTracks(data.audio);
        });

        bitPlayrRef.current.on('trackChanged', (data) => {
          console.log('Track Change!!!', data);
        });

        bitPlayrRef.current.on('loadedmetadata', (event) => {
          setDuration(event.target.duration);
        });

        bitPlayrRef.current.on('adBreakData', (adBreakData) => {
          console.log('Ad Break Data:', adBreakData);
          const parsedAdBreaks = adBreakData.map((adBreak) => {
            return {
              startTime: adBreak.startTimeInSeconds,
              duration: adBreak.durationInSeconds,
            };
          });
          setAdBreaks(parsedAdBreaks);
        });

        bitPlayrRef.current.on('adTrackingPinged', (url) => {
          console.log('Tracking Pinged:', url);
        });

        bitPlayrRef.current.on('adIsPlaying', (data) => {
          setIsAdPlaying(data.isPlaying);
          if (data.isPlaying) {
            setPercentage(data.progress);
            setAdTime(data.remainingTime);
          }
        });

        bitPlayrRef.current.on('error', (data) => {
          console.error(data);
        });
      } catch (error) {
        console.error('Player initialization error:', error);
      } finally {
      }
    };

    initializePlayer();

    return () => {};
  }, []);

  const changeFocus = useCallback(
    (direction: string) => {
      const buttonsOrder = [
        'playPause',
        'restart',
        'skipBack',
        'skipForward',
        'rewind',
        'fastForward',
        'settings',
        'fullscreen',
      ];

      let currentIndex = buttonsOrder.indexOf(focusedButton);

      if (currentIndex === -1) {
        currentIndex = 0;
      }

      let nextIndex = currentIndex;
      switch (direction) {
        case 'ArrowLeft':
          if (focusedButton === 'playPause') {
            if (bitPlayrRef.current) {
              bitPlayrRef.current.pause();
              setIsPlaying(false);

              const newTime = Math.max(bifScrubberTimeRef.current - 5, 0);
              bifScrubberTimeRef.current = newTime;
              handleBifImageDisplay(bifScrubberTimeRef.current);
            }
          } else {
            nextIndex = (currentIndex - 1 + buttonsOrder.length) % buttonsOrder.length;
            setFocusedButton(buttonsOrder[nextIndex]);
          }
          break;
        case 'ArrowRight':
          if (focusedButton === 'playPause') {
            // Custom functionality for fast forward when focused on play/pause
            //handleFastForward();
            console.log('handleFastForward');

            if (bitPlayrRef.current) {
              bitPlayrRef.current.pause();
              setIsPlaying(false);
              const newTime = Math.min(bifScrubberTimeRef.current + 5, duration);
              bifScrubberTimeRef.current = newTime;
              handleBifImageDisplay(bifScrubberTimeRef.current);
            }
          } else {
            nextIndex = (currentIndex + 1) % buttonsOrder.length;
            setFocusedButton(buttonsOrder[nextIndex]);
          }
          break;
        case 'ArrowDown':
          if (focusedButton === 'playPause') {
            setFocusedButton('restart');
          }
          break;
        default:
          break;
      }
    },
    [focusedButton],
  );

  const executeFocusedAction = () => {
    console.log('focusedButton', focusedButton);
    switch (focusedButton) {
      case 'playPause':
        togglePlayPause();
        break;
      case 'restart':
        handleRestart();
        break;
      case 'skipBack':
        handleSkipBackward();
        break;
      case 'skipForward':
        handleSkipForward();
        break;
      case 'rewind':
        //handleRewindStart();
        break;
      case 'fastForward':
        //handleFastForwardStart();
        break;
      case 'settings':
        toggleMenu();
        break;
      case 'fullscreen':
        fullscreen();
        break;
      default:
        break;
    }
  };

  const handleArrowKeys = (key: string) => {
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrowKeys.includes(key)) {
      changeFocus(key);
    }
  };

  const handleTizenKeys = (keyCode: number) => {
    const tizenKeyActions = {
      [tizen.tvinputdevice.getKey('MediaPlay').code]: togglePlayPause,
      [tizen.tvinputdevice.getKey('MediaPause').code]: togglePlayPause,
      // MediaStop, MediaFastForward, MediaRewind
    };

    const action = tizenKeyActions[keyCode];
    if (action) action();
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      handleArrowKeys(event.key);

      if (event.key === 'Enter') {
        executeFocusedAction();
      }

      if (typeof tizen !== 'undefined') {
        handleTizenKeys(event.keyCode);
      }
    },
    [changeFocus, executeFocusedAction],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const togglePlayPause = () => {
    if (bitPlayrRef.current) {
      if (isPlaying) {
        bitPlayrRef.current.pause();
      } else {
        if (isBifScrubberVisible) {
          bitPlayrRef.current.seekTo(bifScrubberTimeRef.current);
          setIsBifScrubberVisible(false);
        }
        bitPlayrRef.current
          .play()
          .then(() => {
            console.log('Playback started successfully');
          })
          .catch((error) => {
            console.error('Error trying to play the media:', error);
          });
      }
      setIsPlaying(!isPlaying);
    }
  };

  function fullscreen() {
    if (bitPlayrRef.current) {
      bitPlayrRef.current?.fullscreen();
    }
  }

  const handleSeek = (newTime: number) => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.seekTo(newTime);
    }
  };

  const qualityChange = (level: IQualityLevel) => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current?.setQuality(level);
    }
  };

  const trackChanged = (track: ITrack) => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current?.setTrack(track);
    }
  };

  const handleBifImageDisplay = (newTime: number) => {
    const interval = 5;
    const numOfThumbnailsEachSide = 4;
    if (bifsExtensionRef.current) {
      try {
        setIsBifScrubberVisible(true);

        let sideThumbnailsData = [];

        for (let i = numOfThumbnailsEachSide; i > 0; i--) {
          const time = Math.max(0, newTime - interval * i);
          if (time < newTime) {
            const thumbnailData = bifsExtensionRef.current.getImageAtSecond(time);
            if (thumbnailData && thumbnailData.length > 25) {
              sideThumbnailsData.push(thumbnailData);
            }
          }
        }

        const mainThumbnailData = bifsExtensionRef.current.getImageAtSecond(newTime);
        if (mainThumbnailData && mainThumbnailData.length > 25) {
          sideThumbnailsData.push(mainThumbnailData);
        }

        for (let i = 1; i <= numOfThumbnailsEachSide; i++) {
          const time = newTime + interval * i;
          const thumbnailData = bifsExtensionRef.current.getImageAtSecond(time);
          if (thumbnailData && thumbnailData.length > 25) {
            sideThumbnailsData.push(thumbnailData);
          }
        }

        setMainThumbnail(mainThumbnailData);
        setSideThumbnails(sideThumbnailsData);
      } catch (error: unknown) {
        console.error(error.message);
      }
    }
  };

  const hideBifImage = () => {
    setIsBifScrubberVisible(false);
  };

  function handleRestart() {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.seekTo(0);
      bitPlayrRef.current
        .play()
        .then(() => {
          console.log('Playback started successfully');
        })
        .catch((error) => {
          console.error('Error trying to play the media:', error);
        });
    }
  }

  const handleSkipForward = () => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.videoElement.currentTime += 10;
    }
  };

  const handleSkipBackward = () => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.videoElement.currentTime -= 10;
    }
  };

  const handleFastForwardStart = () => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.pause();
      setIsPlaying(false);
      const intervalId = setInterval(() => {
        const newTime = Math.min(bifScrubberTimeRef.current + 5, duration);
        bifScrubberTimeRef.current = newTime;
        handleBifImageDisplay(bifScrubberTimeRef.current);
      }, 50);
      setFastForwardIntervalId(intervalId);
    }
  };

  const handleRewindStart = () => {
    if (bitPlayrRef.current) {
      bitPlayrRef.current.pause();
      setIsPlaying(false);
      const intervalId = setInterval(() => {
        const newTime = Math.max(bifScrubberTimeRef.current - 5, 0);
        bifScrubberTimeRef.current = newTime;
        handleBifImageDisplay(bifScrubberTimeRef.current);
      }, 50);
      setRewindIntervalId(intervalId);
    }
  };

  const handleFastForwardEnd = () => {
    clearInterval(fastForwardIntervalId);
    setFastForwardIntervalId(null);
  };

  const handleRewindEnd = () => {
    clearInterval(rewindIntervalId);
    setRewindIntervalId(null);
  };

  const onThumbnailClick = () => {
    if (bitPlayrRef.current) {
      if (isBifScrubberVisible) {
        bitPlayrRef.current.seekTo(bifScrubberTimeRef.current);
        setIsBifScrubberVisible(false);
        bitPlayrRef.current
          .play()
          .then(() => {
            console.log('Playback started successfully');
          })
          .catch((error) => {
            console.error('Error trying to play the media:', error);
          });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div id="player-container">
      <video width={1280} height={720} id={videoElementId}></video>
      {isBifScrubberVisible && (
        <BifScrubber
          mainThumbnail={mainThumbnail}
          sideThumbnails={sideThumbnails}
          onThumbnailClick={onThumbnailClick}
        />
      )}
      <div
        id="ttml-rendering-div"
        style={{
          position: 'absolute',
          bottom: '10px',
          width: '100%',
          textAlign: 'center',
        }}
      ></div>
      <AdProgress adPercentage={percentage} adTime={adTime} isAdPlaying={isAdPlaying} />
      <div id="control-bar" style={{ display: isAdPlaying ? 'none' : 'flex' }}>
        <div className="top-controls">
          <IconButton
            onClick={togglePlayPause}
            color="primary"
            tabIndex={0}
            className={focusedButton === 'playPause' ? 'focused' : ''}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            bufferedAhead={bufferedAhead}
            bufferedBehind={bufferedBehind}
            adBreaks={adBreaks}
            onSeek={handleSeek}
            onBifImageDisplay={handleBifImageDisplay}
            onHideBifImage={hideBifImage}
          />
          <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
        <div className="bottom-controls">
          <div className="control-bar-buttons">
            <div className="left-controls">
              <IconButton
                onClick={handleRestart}
                color="primary"
                tabIndex={0}
                className={focusedButton === 'restart' ? 'focused' : ''}
              >
                <RestartAltIcon />
              </IconButton>
              <IconButton
                onClick={handleSkipBackward}
                color="primary"
                tabIndex={0}
                className={focusedButton === 'skipBack' ? 'focused' : ''}
              >
                <Replay10Icon />
              </IconButton>
              <IconButton
                onClick={handleSkipForward}
                color="primary"
                tabIndex={0}
                className={focusedButton === 'skipForward' ? 'focused' : ''}
              >
                <Forward10Icon />
              </IconButton>
              <IconButton
                onMouseDown={handleRewindStart}
                onMouseUp={handleRewindEnd}
                onMouseLeave={handleRewindEnd}
                tabIndex={0}
                className={focusedButton === 'rewind' ? 'focused' : ''}
              >
                <FastRewindIcon />
              </IconButton>
              <IconButton
                onMouseDown={handleFastForwardStart}
                onMouseUp={handleFastForwardEnd}
                onMouseLeave={handleFastForwardEnd}
                tabIndex={0}
                className={focusedButton === 'fastForward' ? 'focused' : ''}
              >
                <FastForwardIcon />
              </IconButton>
            </div>
            <div className="right-controls">
              <div className="settings">
                <IconButton
                  id="settingsButton"
                  color="primary"
                  onClick={toggleMenu}
                  tabIndex={0}
                  className={focusedButton === 'settings' ? 'focused' : ''}
                >
                  <SettingsIcon />
                </IconButton>
                {isMenuVisible && (
                  <div className="menu" id="settingsMenu">
                    <QualityLevels qualityLevels={qualityLevels} qualityChange={qualityChange} />
                    <SubtitleTracks
                      subtitleTracks={subtitleTracks}
                      subtitleChanged={trackChanged}
                    />
                    <AudioTracks audioTracks={audioTracks} audioChanged={trackChanged} />
                  </div>
                )}
              </div>
              <IconButton
                onClick={fullscreen}
                color="primary"
                tabIndex={0}
                className={focusedButton === 'fullscreen' ? 'focused' : ''}
              >
                <FullscreenIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BitPlayrVideo;
