## Common Media Player API

# Features
- Mediatailor SSAI 
- Multiple Player Support HLS.js DASH.js Shaka Player
- Netflix Style Thumbnails
- Works on Tizen Samsung TVs
- Quality Switching
- Subtitles
- Audio Tracks

### Setup

cd into BitPlayr SDK and run
~~~sh
npm link
~~~

cd into React and run
~~~sh
npm link bitplayr
~~~

Start the SDK with
~~~sh
npm run watch
~~~

Start React App
~~~sh
npm start
~~~

### Generate Extensions Tool

We have a new tool to generate extensions.

~~~sh
cd BitPlayr/tools/generator
chmod +x create-extension.js
npm link
~~~

Now run 
~~~sh
extension
~~~

It will be outputted to the extensions folder in the SDK

