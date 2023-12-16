import { ITrack } from 'bitplayr';
import React from 'react';

interface ISubtitleProps {
  subtitleTracks: ITrack[];
  subtitleChanged: (track: ITrack) => void;
}

const SubtitleTracks: React.FC<ISubtitleProps> = ({ subtitleTracks, subtitleChanged }) => {
  const handleTrackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const track = subtitleTracks[parseInt(event.target.value)];
    subtitleChanged(track);
  };

  return (
    <>
      <label>Subtitles</label>
      <select onChange={handleTrackChange}>
        <option value="-1">None</option>
        {subtitleTracks &&
          subtitleTracks.length > 0 &&
          subtitleTracks.map((track, index) => (
            <option key={index} value={index}>
              {`${track.id ?? track.index} ${track.name ?? track.lang} ${track.codec ?? ''}`}
            </option>
          ))}
      </select>
    </>
  );
};

export default SubtitleTracks;
