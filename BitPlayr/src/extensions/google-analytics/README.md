# GoogleAnalyticsExtension

## Using Extension
To use this extension make sure you add it to the extensions array in the playerConfig options.

```
const playerConfig = {
  extensions: [new GoogleAnalyticsExtension()],
};

bitPlayrRef.current = await BitPlayr.createPlayer(videoElementId, playerConfig, device);
```

You will also need to export it via index.ts to make it available via the bitplayr api.
```
export { GoogleAnalyticsExtension } from './extensions/google-analytics/google-analytics';
```

## Description
This is the GoogleAnalyticsExtension extension.

## API Documentation
Detailed API documentation for GoogleAnalyticsExtension.
