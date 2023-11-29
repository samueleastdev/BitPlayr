# MediatailorExtension

## Description

This is the MediatailorExtension extension.

## API Documentation

Detailed API documentation for MediatailorExtension.

### Events

```
bitPlayrRef.current.on('adBreakData', (adBreakData) => {
  console.log('Ad Break Data:', adBreakData);
});

bitPlayrRef.current.on('adIsPlaying', (data) => {
  setIsAdPlaying(data.isPlaying);
  if(data.isPlaying){
    console.log('adIsPlaying:', data);
  }
});
```
