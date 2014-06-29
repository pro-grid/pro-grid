progrid.io server
===
[progrid.io][] is a live multiplayer pixel art game.

[![Build Status Badge][]][Build Status]
[![Code Climate Badge][]][Code Climate]
[![Coverage Status Badge][]][Coverage Status]
[![Dependency Status Badge][]][Dependency Status]
[![devDependency Status Badge][]][devDependency Status]

[Google+](https://plus.google.com/+ProgridIoofficial) 
[Facebook](https://www.facebook.com/ProGrid)
[Twitter](https://twitter.com/Pro_Grid)

![progrid.io][progrid gif]

[progrid.io][] is made up of two modules. [pro-grid][], a [Node.js][]/[Socket.IO][] server
which handles many clients, and [pro-grid-client][], the user interface built as
a client-side javascript app using [AngularJS][]. 

## quickstart
This project relies on [Node.js][] and a running [Redis][] instance

Install the dependencies

```bash
npm install
```

Run the server

```bash
# make sure your Redis server is running first
make watch
```

To run the test suite

```bash
make test
```

If you need some help see the getting started tutorial below.

## getting started tutorial

### install dependencies
We presume you have an up-to-date version of [Node.js][] installed on your machine.
We recommend [nvm][] for managing your node installations.

Install the Node.js dependencies via 

```bash
npm install
```

Progrid uses [Redis][] as its data store. You will need to install and run a
Redis server to run the progrid server. Installation instructions can
be found [here][Redis install]. If you are on a Mac with [Homebrew][] installed it
is as simple as running `brew install redis` and following the post-install
instructions.

### run the server
We use [Make][] as our build tool. Most all unix-like operating systems should
have this utility out of the box.

To run the server:

```bash
make watch
```

This command will do two things:

 1. Run `lib/web.js` which will start the server
 2. Restart the server any time you change the source files

This makes development nice and easy.

Note: if you do not have Make (perhaps you are on Windows) and are truly lazy,
you can manually copy/paste the commands found in the [Makefile][]

### run the test suite

```bash
make test
```

If all the tests pass then everything should be good to go at this point.

## team

Person | Role
--- | ---
Austin Pray | Lead Javascript Snob
Darren Cattle | Web Development God
Ridwan Hoq | Repo Mule
You | Open Sauce Software Contributer

[AngularJS]: https://angularjs.org/ "AngularJS"
[Bower]: http://bower.io/ "Bower"
[Build Status Badge]: http://img.shields.io/travis/pro-grid/pro-grid.svg?style=flat
[Build Status]: https://travis-ci.org/pro-grid/pro-grid
[Code Climate Badge]: http://img.shields.io/codeclimate/github/pro-grid/pro-grid.svg?style=flat
[Code Climate]: https://codeclimate.com/github/pro-grid/pro-grid
[Coverage Status Badge]: https://img.shields.io/coveralls/pro-grid/pro-grid.svg?style=flat
[Coverage Status]: https://coveralls.io/r/pro-grid/pro-grid?branch=master
[Dependency Status Badge]: http://img.shields.io/david/pro-grid/pro-grid.svg?style=flat
[Dependency Status]: https://david-dm.org/pro-grid/pro-grid
[Homebrew]: http://brew.sh/
[Make]: http://www.gnu.org/software/make/
[Makefile]: https://github.com/pro-grid/pro-grid/blob/master/Makefile
[Node.js]: http://nodejs.org/ "Node.js"
[Redis install]: http://redis.io/download
[Redis]: http://redis.io/
[Ruby]: https://www.ruby-lang.org
[Sass]: http://sass-lang.com/ "Sass"
[Socket.IO]: http://socket.io/
[devDependency Status Badge]: http://img.shields.io/david/dev/pro-grid/pro-grid.svg?style=flat
[devDependency Status]: https://david-dm.org/pro-grid/pro-grid#info=devDependencies
[gulp]: http://gulpjs.com/ "gulp.js"
[livereload]: https://github.com/intesso/connect-livereload
[nvm]: https://github.com/creationix/nvm "Node Version Manager (NVM)"
[pro-grid-client]: http://github.com/pro-grid/pro-grid-client
[pro-grid-utils]: http://github.com/austinpray/pro-grid-utils
[pro-grid]: http://github.com/pro-grid/pro-grid
[progrid gif]: http://i.imgur.com/GiLvpX3.gif
[progrid.io]: http://www.progrid.io "progrid.io"
[rvm]: https://rvm.io/ "Ruby Version Manager (RVM)"
