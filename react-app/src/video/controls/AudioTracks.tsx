import { ITrack } from 'bitplayr';
import React from 'react';

interface IAudioTracksProps {
  audioTracks: ITrack[];
  audioChanged: (track: ITrack) => void;
}

const AudioTracks: React.FC<IAudioTracksProps> = ({ audioTracks, audioChanged }) => {
  const handleBitrateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const track = audioTracks[parseInt(event.target.value)];
    audioChanged(track);
  };

  return (
    <>
      <label>Audio Tracks</label>
      <select onChange={handleBitrateChange}>
        <option value="-1">None</option>
        {audioTracks.map((track, index) => (
          <option key={index} value={index}>
            {`${track.id ?? track.index} ${track.name ?? track.lang} ${track.codec ?? ''}`}
          </option>
        ))}
      </select>
    </>
  );
};

export default AudioTracks;
