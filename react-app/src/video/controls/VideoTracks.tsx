// BitrateSwitcher.tsx
import React from 'react';

interface IVideoTracks {
  index?: number;
  type?: string;
  labels?: string[];
  lang?: string;
  roles?: string[];
  codec?: string;
  mimeType?: string;
}

interface IVideoTracksProps {
  videoTracks: IVideoTracks[];
  videoChanged: (level: IVideoTracks) => void;
}

const VideoTracks: React.FC<IVideoTracksProps> = ({ videoTracks, videoChanged }) => {
  const handleBitrateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const level = videoTracks[parseInt(event.target.value)];
    videoChanged(level);
  };

  return (
    <select onChange={handleBitrateChange}>
      {videoTracks.map((level, index) => (
        <option key={index} value={index}>
          {`${level.lang}`}
        </option>
      ))}
    </select>
  );
};

export default VideoTracks;
