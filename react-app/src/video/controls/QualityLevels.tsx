import { IQualityLevel } from 'bitplayr';
import React from 'react';

interface IQualityLevelsProps {
  qualityLevels: IQualityLevel[];
  qualityChange: (level: IQualityLevel) => void;
}

const QualityLevels: React.FC<IQualityLevelsProps> = ({ qualityLevels, qualityChange }) => {
  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quality = qualityLevels[parseInt(event.target.value)];
    qualityChange(quality);
  };

  return (
    <>
      <label>Quality Levels</label>
      <select onChange={handleQualityChange}>
        <option value="-1">None</option>
        {qualityLevels.map((quality, index) => (
          <option key={index} value={index}>
            {`${quality.bitrate + ' kbps' ?? ''} (${quality.width}x${quality.height})`}
          </option>
        ))}
      </select>
    </>
  );
};

export default QualityLevels;
