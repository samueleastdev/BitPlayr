## Common Media Player API

### Setup

cd into BitPlayr SDK and run
~~~
npm link
~~~

cd into react-app and run
~~~
npm link bitplayr
~~~

Start the SDK with
~~~
npm run watch
~~~

Start React App
~~~
npm start
~~~

### Generate Extensions Tool

We have a new tool to generate extensions.

~~~
cd BitPlayr/tools/generator
chmod +x create-extension.js
npm link
~~~

Now run 
~~~
extension
~~~

It will be outputted to the extensions folder in the SDK

