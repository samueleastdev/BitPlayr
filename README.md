## Common Media Player API

### Setup

cd into BitPlayr SDK and run
~~~sh
npm link
~~~

cd into react-app and run
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

