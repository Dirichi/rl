# RL

This repository explores the use of different reinforcement learning algorithms with [p5js](https://p5js.org/) games

# Getting started
If you have git and npm installed, you can clone the repo and get started like so in your terminal

```
# clone the project
git clone https://github.com/Dirichi/rl.git

# go inside the project's folder
cd rl

# install all the necessary node packages
npm install

# create a temporary folder that will house the bundled q files
mkdir public/lib/tmp

# create an empty file into which the bundled files will be written
touch public/lib/tmp/bundle.js
```

Currently there is only a pong game using QRegression. To test it out run
`npm start`

and then visit `localhost:3000` in a (preferrably chrome) browser

# RL IN ACTION
[!reinforcement learning with pong](https://vimeo.com/236285279)

# Recommended reading
I'm also doing some writing about reinforcement learning on my medium blog. Check out the first story in the series at https://medium.com/@yung_API/i-just-taught-some-pixels-on-my-screen-how-to-play-pong-6f5b50cc25ad
