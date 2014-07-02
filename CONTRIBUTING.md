Contributing to progrid.io server
===
## development environment

## vagrant development getting started tutorial

## local development getting started tutorial

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
