progrid.io
===
_Live multiplayer grid clicking game._

[![Build Status](https://travis-ci.org/pro-grid/pro-grid.svg?branch=master)](https://travis-ci.org/pro-grid/pro-grid)
[![Code Climate](http://img.shields.io/codeclimate/github/pro-grid/pro-grid.svg)](https://codeclimate.com/github/pro-grid/pro-grid) 
[![Coverage Status](https://img.shields.io/coveralls/pro-grid/pro-grid.svg)](https://coveralls.io/r/pro-grid/pro-grid?branch=master)
[![Dependency Status](https://david-dm.org/pro-grid/pro-grid.svg)](https://david-dm.org/pro-grid/pro-grid)
[![devDependency Status](https://david-dm.org/pro-grid/pro-grid/dev-status.svg)](https://david-dm.org/pro-grid/pro-grid#info=devDependencies)
[Google+](https://plus.google.com/+ProgridIoofficial) 
[Facebook](https://www.facebook.com/ProGrid) 
[Twitter](https://twitter.com/Pro_Grid)

![ProGrid](http://cdn.progrid.io/progrid-logo-360.png)

Goal
---
Our goal is to create an application which explores the interaction between users.
The experiment is run with two blind variables:
 1. You do not know who the other people are (unless you troll together).
 2. You do not know how many other people there are (if sample sizes are large enough).

Method
---
This will be accomplished by creating a screen filled with MxM squares and starting with a blank webpage.
Through updating the color in each square using websockets and node.js we wish to save the file as an ongoing project. Each user will be assigned a random color on entry, and this can be changed upon refresh. This enables you to realize who is messing with your stuff and possibly create "color bias" through the application. Clicking on an already colored square will remove anyones color to white, this would be the invisible method of interaction "anonymous cleansing" where it could be anyone.
Eventually screenshots will be taken every minute for a whole month, then .gif or .mp4's can be produced with video images over an entire month. This will create interactive videos and can be coupled with statistics such as how many concurrent users over a period exist, which colors were the most popular, etc.

Audience
---
We wish to target a mainstream audience that desires mindless clicking and time-wasting. You may love to make pixel art, you may love to click every damn square. Do what you want. We want your love. Interaction drives this application known as "pro-grid".

Possible Adaptations
---
 - _Invert Command_ - Simply flip the colors of each square with a press of a button (or a hidden hotkey would be sweet)
 - _Randomized Square Real Estate_ - Each user gets z% of the grid and is distributed randomly for control. Refreshing would change the seed but this would promote more random art and less totalitarian trolling
 - _Image buffering_ - Upload a 16x16 image and be able to place it into squares for all to see.
 - _3D Implementation_ - Each cube is represented by a 16x16x16 space and has lighting/rendering effects. Videos can be produced of renders from multiple perspective angles.
 - _N_ - ability to change number of colors and specific colors to mix things up

Building The Project
---
### General Dependencies
This project requires the [Node.js](http://nodejs.org/) runtime as well as [Ruby](https://www.ruby-lang.org/en/). Given those dependencies are met, this project assumes you have [Compass](http://compass-style.org/install/), [Grunt](http://gruntjs.com/), and [Bower](http://bower.io/) installed globally on your computer.
### Mac
To install Compass, Grunt, and Bower you may run:
```bash
gem install compass
npm -g install grunt-cli bower
```
In your project directory run:
```bash
npm install
bower install
```
Now all your dependencies are installed and good to go! It just works™. Now build the project and run the web server.
```bash
grunt build
grunt web
```
Visit [http://localhost:9001](http://localhost:9001) to see your grid.

### Windows
 - Ruby: http://rubyinstaller.org/
 - Git: http://git-scm.com/downloads
 - Node.js: http://nodejs.org/download/
 - Create a folder to contain this (preferably in your GitHub folder)
 - Open a command window in that folder (Shift + Right Click folder)

Fork pro-grid: https://github.com/ridhoq/pro-grid  
If you need help understanding visit: https://help.github.com/articles/fork-a-repo

```bash
gem install compass
npm install -g bower
npm install -g grunt-cli
npm install
bower install
grunt build
grunt web
```
Open the app at [http://localhost:9001](http://localhost:9001)

### Linux
Install RVM and Ruby: https://rvm.io/rvm/install
```bash
# Example for Ubuntu 13.10:
\curl -sSL https://get.rvm.io | bash -s stable
# Verify that RVM is a bash function:
# restart your terminal
type rvm | head -n 1
# See https://rvm.io/integration/gnome-terminal if you get
# "RVM is not a function"
rvm install 2.1.0
rvm use 2.1.0
# Verify that Ruby is installed
ruby -v
gem install compass
```
Install Node.js: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
```bash
# Example for Ubuntu 13.10:
sudo add-apt-repository ppa:chris-lea/node.js  
sudo apt-get update  
sudo apt-get install nodejs
```
Fork pro-grid: https://github.com/pro-grid/pro-grid  
If you need help understanding visit: https://help.github.com/articles/fork-a-repo
```bash
git clone git@github.com:[your_github_username]/pro-grid.git
git remote add upstream git@github.com:pro-grid/pro-grid.git
git fetch upstream
```
Install Grunt and Bower:
```bash
sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install
bower install
```
Build the project and run the web server
```bash
grunt build
grunt web
```
Visit http://localhost:9001/

Team
---

Person | Role
--- | ---
Austin Pray | Lead Javascript Snob
Darren Cattle | Web Development God
Ridwan Hoq | Repo Mule
You | Open Sauce Software Contributer
Kyle Flottman | #socialmedia
