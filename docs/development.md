Developing progrid.io server
===

![development gif][]

## summary
progrid.io server has a pretty slick Vagrant-based development environment
packaged and ready to go. 
[Learn more about how Vagrant benefits you.][Why Vagrant]

## dependencies
progrid.io server has a pretty slick development environment packaged and
ready to go.  You need these things installed on your machine to get started:

  - [Vagrant][]
  - [Virtualbox][]
  - [Make][] (included by default in any Unix-like OS)

## get started
To spawn a fully-functioning development environment all you have to do is run:

```bash
# inside the project directory
vagrant up
```

This gives you an Ubuntu 14.04 LTS guest machine with 

  - [Node.JS][] and [npm][]
  - [Redis][]
  - progrid.io server running at http://localhost:9001

Your entire project directory is rsynced one time to the guest machine. Changes
to the following folders are updated live on the guest machine as you work on
them:

  - `lib/`
  - `test/`
  - `site/`

Every time you change a file in `lib/`, the progrid.io server process is
automatically restarted

## commands
All commands are run inside the project directory. Refer to the [Vagrant
Command-Line Interface Documentation][Vagrant CLI Docs] for a full list of
Vagrant commands.

### vagrant up
spawns vagrant development environment

### vagrant destroy
completely deletes your vagrant development environment and cleans up after
itself

### vagrant ssh
run commands inside the guest machine 

### make install
Every time you modify the package.json and change progrid.io server’s
dependencies, you must update the guest machine’s slug with `make install`. This
command will: 

  1. use rsync to sync the new package.json with the updated list of
    dependencies to the guest machine.
  2. `npm prune` to get rid of any unused dependencies.
  3. `npm install` to install any new dependencies.

### make logs
Live `tail` of the server log files. Useful for debugging purposes. Logs are
located at `var/log/node.log` on the guest machine FYI.

### make test
runs progrid.io server’s [Mocha][] test suite.

### make jshint
runs [JSHint][] on the .js files inside `lib/` and `test/`.

### make sync
Any time you make edits outside of `lib/`, `test/`, or `site/` you must sync
these changes over to the guest machine. You will not have to use this command
very often however.

## need help?
[Opening an issue][new issue] is the fastest way to get help. You can also try
pinging Austin Pray ([@austinpray][]) on Twitter.

[@austinpray]: https://twitter.com/austinpray
[JSHint]: http://www.jshint.com/
[Make]: http://www.gnu.org/software/make/
[Mocha]: http://visionmedia.github.io/mocha/
[Node.JS]: http://nodejs.org/
[Redis]: http://redis.io/
[Vagrant CLI Docs]: http://docs.vagrantup.com/v2/cli/index.html
[Vagrant]: https://docs.vagrantup.com/v2/installation/index.html
[Virtualbox]: https://www.virtualbox.org/wiki/Downloads
[Why Vagrant]: http://docs.vagrantup.com/v2/why-vagrant/index.html
[development gif]: http://i.imgur.com/OnoxXgq.gif
[new issue]: https://github.com/pro-grid/pro-grid/issues/new
[npm]: https://www.npmjs.org/
