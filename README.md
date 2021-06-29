```cmd

> git clone https://github.com/Ryanhustler420/Webpack-React-Electron-JS-Boilerplate.git
> cd ./Webpack-React-Electron-JS-Boilerplate
> npm install
> npm run watch
> npm start

```

You need to create these file/folder on root level of this project (review .gitignore)

- .env
- assets/images
- build/js (automatically gets created once you run - npm run watch)
- node_modules (automatically gets created once you run - npm install)


> dependencies you need,

- npm i --save @popperjs/core (if you want to use bootstrap into react app)

- Please remove .git which is hidden in the directory, and run `git init`

# index.js
```js

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js';

ReactDOM.render(<App />, document.getElementById('Root'))

```

# Boilerplate

> npm install --save-dev webpack-merge

Now you just need to run `npm run build` in order to make a production build and produce an executable file for ready to use

After build, you will get a /build directory on root level of the project, and there will be a source map of code as well

> npm start

NOTE: not this command will run your code as production build, so everytime you change your code, you have to build your project with `npm run build` and the `npm start`


#Build Process

> npm install --save-dev electron-builder

> Resources

``
(Apple Package Name)[https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8]

``

NOTE:

``
The Hardened Runtime, along with System Integrity Protection (SIP),
protects the runtime integrity of your software by preventing certain classes of
exploits, like code injection, dynamically linked library (DLL) hijacking

It enforces code signing and verifies downloaded applications before allowing them to run, thereby reducing the likelihood of inadvertently executing malware.

``
> npm run make:win

##### OR (Recommended) [12.10.1 >= node version]

> npm install -g electron-packager
> electron-packager --help
> electron-packager --version
> electron-packager . --electron-version="13.1.2" --asar=true

>> Make sure you execute the above command while you are in the root level of the project

## Issues

> (Menu)[https://github.com/electron/electron/issues/2591]

> (Installer)[https://ourcodeworld.com/articles/read/927/how-to-create-a-msi-installer-in-windows-for-an-electron-framework-application]
