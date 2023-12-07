import React from 'react';

const BifScrubber = ({ mainThumbnail, sideThumbnails }) => {
  return (
    <div className="thumbnail-scrubber">
      {sideThumbnails.map((thumb, index) => (
        <img key={index} src={thumb} className={thumb === mainThumbnail ? "main-thumbnail" : "side-thumbnail"} alt="thumbnail" />
      ))}
    </div>
  );
};

export default BifScrubber;
