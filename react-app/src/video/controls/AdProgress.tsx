import React, { useEffect, useRef } from 'react';
import ProgressBar from 'progressbar.js';

const AdProgress = ({ adPercentage, adTime, isAdPlaying }) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  let progressBar;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    progressBar = new ProgressBar.Circle(containerRef.current, {
      strokeWidth: 8,
      color: '#FFEA82',
      trailColor: '#000',
      trailWidth: 8,
      easing: 'easeInOut',
      svgStyle: null,
      fill: 'rgba(0, 0, 0)',
      duration: 1000,
    });

    progressBar.set(adPercentage);
    progressBar.setText(`${Math.ceil(adTime)}s`);

    progressBarRef.current = progressBar;

    return () => {
      progressBar.destroy();
    };
  }, [adPercentage]);

  return (
    <div
      className="ad-progress-bar"
      ref={containerRef}
      style={{ display: isAdPlaying ? 'block' : 'none', width: '60px', height: '60px' }}
    >
      {/* The progress bar will be rendered here */}
    </div>
  );
};

export default AdProgress;
