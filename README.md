pro-grid
===
_Grid designed for interaction by multiple users._

Goal
---
Our goal is to create an application which explores the interaction between users.
The experiment is run with two blind variables:
 1. You do not know who the other people are (unless you troll together).
 2. You do not know how many other people there are (if sample sizes are large enough).

Method
---
This will be accomplished by creating a screen filled with 16x16 squares and starting with a blank webpage.
Squares can be cycled between "n" amount of colors by clicking... {1,2,3...n}
Default color should be neutral (preferably black or white)
Through updating the color in each square using websockets and node.js we wish to save the file as an ongoing project.
Eventually screenshots will be taken every minute for a whole month, then .gif or .mp4's can be produced with video images over an entire month. This will create interactive videos and can be coupled with statistics such as how many concurrent users over a period exist, etc.

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

Installation Guide
---
Windows
Ruby: http://rubyinstaller.org/
Git: http://git-scm.com/downloads
Node.js: http://nodejs.org/download/
Create a folder to contain this (preferably in your GitHub folder)
Open a command window in that folder (Shift + Right Click folder)
git clone https://github.com/DarrenCattle/pro-grid.git
npm install -g bower
npm install -g grunt-cli
npm install
bower install
Then run in separate windows:
node web.js
grunt serve
Server should automatically open and be through a client!

Team
---

Person | Role
--- | ---
Austin Pray | Lead Front-end Developer
Darren Cattle | Web Development God
Ridwan Hoq | Lead Back-end Developer
You | Open Sauce Software Contributer
