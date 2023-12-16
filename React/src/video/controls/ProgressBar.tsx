import React from 'react';

const ProgressBar = ({
  currentTime,
  duration,
  bufferedAhead,
  bufferedBehind,
  adBreaks,
  onSeek,
  onBifImageDisplay,
  onHideBifImage,
}) => {
  const progressBarRef = React.useRef(null);

  const renderAdBreaks = () => {
    return adBreaks.map((adBreak, index) => {
      const leftPosition = (adBreak.startTime / duration) * 100;
      const width = (adBreak.duration / duration) * 100;
      return (
        <div
          key={index}
          className="ad-break"
          style={{ left: `${leftPosition}%`, width: `${width}%` }}
        ></div>
      );
    });
  };

  const calculateProgress = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  const calculateBuffered = (bufferedTime) => {
    return duration > 0 ? (bufferedTime / duration) * 100 : 0;
  };

  const handleProgressClick = (e) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * duration;
      onSeek(newTime);
    }
  };

  function handleDragStart(e) {
    e.preventDefault();
    updateBifImage(e);
    window.addEventListener('mousemove', handleDragging);
    window.addEventListener('mouseup', handleDragEnd);
  }

  function handleDragging(e) {
    updateBifImage(e);
  }

  function updateBifImage(e) {
    const rect = progressBarRef.current.getBoundingClientRect();
    const newTime = ((e.clientX - rect.left) / rect.width) * duration;
    onBifImageDisplay(newTime, e.clientX - rect.left);
  }

  function handleDragEnd(e) {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * duration;
      onSeek(newTime);
      onHideBifImage();
    }
    window.removeEventListener('mousemove', handleDragging);
    window.removeEventListener('mouseup', handleDragEnd);
  }

  return (
    <div
      className="progress-bar"
      ref={progressBarRef}
      onClick={handleProgressClick}
      onMouseDown={handleDragStart}
    >
      {renderAdBreaks()}
      <div
        className="buffered-behind"
        style={{ width: `${calculateBuffered(bufferedBehind)}%` }}
      ></div>
      <div className="progress" style={{ width: `${calculateProgress()}%` }}></div>
      <div
        className="buffered-ahead"
        style={{ width: `${calculateBuffered(bufferedAhead)}%`, left: `${calculateProgress()}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
