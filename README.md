progrid.io server
===
[progrid.io][] is a live multiplayer pixel art game.

[![Build Status Badge][]][Build Status]
[![Code Climate Badge][]][Code Climate]
[![Coverage Status Badge][]][Coverage Status]
[![Dependency Status Badge][]][Dependency Status]
[![devDependency Status Badge][]][devDependency Status]
[![Gitter chat][gitter badge]][gitter]

[Google+](https://plus.google.com/+ProgridIoofficial) 
[Facebook](https://www.facebook.com/ProGrid)
[Twitter](https://twitter.com/Pro_Grid)

![progrid.io][progrid gif]

[progrid.io][] is made up of two modules. [pro-grid][], a [Node.js][]/[Socket.IO][] server
which handles many clients, and [pro-grid-client][], the user interface built as
a client-side javascript app using [AngularJS][]. 

## quickstart
If you know your way around [Vagrant][]:

```bash
vagrant up
```

For more information on how get up an running and the development environment in
general:

>[**visit the detailed development tutorial**][dev instructions]

For a list of commands needed to work on progrid.io server:

>[**commands reference**][commands link] 

### now what?
progrid.io server is only half of progrid.io. You need a 
[progrid.io client][pro-grid-client] 
to connect to your server.

>[**progrid.io client**][pro-grid-client]

## need help?
[Opening an issue][new issue] is the fastest way to get help. You can also try
pinging Austin Pray ([@austinpray][]) on Twitter.

## team

Person | Role
--- | ---
Austin Pray | Lead Javascript Snob
Darren Cattle | Web Development God
Ridwan Hoq | Test Driven Dopeness (TDD) Expert
You | Open Sauce Software Contributor

[@austinpray]: https://twitter.com/austinpray
[AngularJS]: https://angularjs.org/ "AngularJS"
[Bower]: http://bower.io/ "Bower"
[Build Status Badge]: http://img.shields.io/travis/pro-grid/pro-grid.svg?style=flat
[Build Status]: https://travis-ci.org/pro-grid/pro-grid
[CONTRIBUTING.md]: CONTRIBUTING.md
[Code Climate Badge]: http://img.shields.io/codeclimate/github/pro-grid/pro-grid.svg?style=flat
[Code Climate]: https://codeclimate.com/github/pro-grid/pro-grid
[Coverage Status Badge]: https://img.shields.io/coveralls/pro-grid/pro-grid.svg?style=flat
[Coverage Status]: https://coveralls.io/r/pro-grid/pro-grid?branch=master
[Dependency Status Badge]: http://img.shields.io/david/pro-grid/pro-grid.svg?style=flat
[Dependency Status]: https://david-dm.org/pro-grid/pro-grid
[gitter]: https://gitter.im/pro-grid
[gitter badge]: http://img.shields.io/badge/GITTER-progrid-green.svg?style=flat
[Homebrew]: http://brew.sh/
[Make]: http://www.gnu.org/software/make/
[Makefile]: https://github.com/pro-grid/pro-grid/blob/master/Makefile
[Node.js]: http://nodejs.org/ "Node.js"
[Redis install]: http://redis.io/download
[Redis]: http://redis.io/
[Ruby]: https://www.ruby-lang.org
[Sass]: http://sass-lang.com/ "Sass"
[Socket.IO]: http://socket.io/
[Vagrant]: https://vagrantup.com/
[commands link]: docs/development.md#commands
[dev instructions]: docs/development.md
[devDependency Status Badge]: http://img.shields.io/david/dev/pro-grid/pro-grid.svg?style=flat
[devDependency Status]: https://david-dm.org/pro-grid/pro-grid#info=devDependencies
[gulp]: http://gulpjs.com/ "gulp.js"
[livereload]: https://github.com/intesso/connect-livereload
[new issue]: https://github.com/pro-grid/pro-grid/issues/new
[nvm]: https://github.com/creationix/nvm "Node Version Manager (NVM)"
[pro-grid-client]: http://github.com/pro-grid/pro-grid-client
[pro-grid-utils]: http://github.com/austinpray/pro-grid-utils
[pro-grid]: http://github.com/pro-grid/pro-grid
[progrid gif]: http://i.imgur.com/GiLvpX3.gif
[progrid.io]: http://www.progrid.io "progrid.io"
[rvm]: https://rvm.io/ "Ruby Version Manager (RVM)"
