import React from 'react';

const BifScrubber = ({ mainThumbnail, sideThumbnails, onThumbnailClick }) => {
  return (
    <div className="thumbnail-scrubber">
      {sideThumbnails.map((thumb, index) => (
        <img
          key={index}
          src={thumb}
          className={thumb === mainThumbnail ? 'main-thumbnail' : 'side-thumbnail'}
          alt="thumbnail"
          onClick={() => onThumbnailClick()}
        />
      ))}
    </div>
  );
};

export default BifScrubber;
