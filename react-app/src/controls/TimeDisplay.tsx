import React from 'react';
import { HFormatTime } from 'bitplayr';

function TimeDisplay({ currentTime, duration }) {

  const currentTimeFormatted = HFormatTime(currentTime);
  const durationFormatted = HFormatTime(duration);

  return (
    <div id="time-display">
      {currentTimeFormatted} / {durationFormatted}
    </div>
  );
}

export default TimeDisplay;
