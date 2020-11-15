# Black Diamond Wallet
BD Wallet is the world’s first decentralized blockchain rating model. Through community rating reports, users’ understanding and awareness of blockchain are improved; at the same time, we provide users with secure blockchain asset storage and professional blockchain Financial Services. We also actively participate in the construction of Polkadot's ecology and are committed to achieving the goals and missions of web3.0.

# Overview
+ [app](https://github.com/bdwallet/wallet-app/tree/master/application/APP): the app of the BDWallet
+ [pc](https://github.com/bdwallet/wallet-app/tree/master/application/pc): the website of the BDWallet
+ [wap](https://github.com/bdwallet/wallet-app/tree/master/application/wap): the mobile website of the BDWallet

# Stack
------
> * Use nodejs to automatically build a packaged single page application
> * `nodejs` `vue2` `vuex` `vue-router` `webpack` `axios` `Mock` `Less` `ES6`


# Development
------

``` shell
# install nodejs
https://nodejs.org

# Clone this repo
git clone https://github.com/bdwallet/wallet-app.git

# Go to the project root directory
cd your path ...

# install dependencies
npm install

# compile dll
npm run dll appName

# run app
npm run dev appName
```

# Release
``` shell
npm run pro appName
```

# Project structure
------

```shell
root
|-- application
|   |-- doc
|   |   |-- ...
|   |-- pc // BDWallet website
|   |   |-- assets
|   |   |-- components
|   |   |-- pages
|   |   |   |-- index
|   |   |   |-- user
|   |   |   |-- ... 
|   |   |-- script
|   |   |-- config
|   |   |-- ...
|   |-- wap // BDWallet mobile website
|   |   |-- appcomps
|   |   |-- assets
|   |   |-- components
|   |   |-- layout
|   |   |-- pages
|   |   |   |-- down
|   |   |   |-- index
|   |   |   |-- pro
|   |   |   |-- ... 
|   |   |-- script
|   |   |-- config
|   |   |-- README.md
|   |   |-- ...
|   |-- APP // Hbuilder compiled APP
|   |   |-- static
|   |   |-- unpackage
|   |   |-- index.html
|   |   |-- manifest.json
|   |   |-- ...
|   |-- paper // rating
|   |   |-- assets
|   |   |-- components
|   |   |-- index
|   |   |-- script
|   |   |-- config
|   |   |-- ...
|-- assets
|-- compiled
|-- components
|-- documents
|-- node_modules
|-- .babelrc
|-- build.js
|-- package.json
|-- README.md
```
# note
This is the old version of BDWallet, the new version of BDWallet will implement Hierarchical Deterministic Wallet and fully support the polkadot ecology, so stay tuned