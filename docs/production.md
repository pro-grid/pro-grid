Deploying progrid.io server to production
===

## [Heroku][]
progrid.io server is 100% good to go out of the box to push to [Heroku][] with
no fuss no muss.

  1. [Become familiar with Heroku’s getting started guide][Heroku getting started]
  2. Create an app `NAMEOFHEROKUAPP` on [Heroku][].
  3. Clone or fork progrid.io server
  4. `heroku git:remote -a NAMEOFHEROKUAPP` inside the project directory [learn more][Heroku git]
  5. `heroku labs:enable websockets` [learn more][Heroku websockets]
  6. `heroku addons:add redistogo` [learn more][redistogo]
  7. `git push heroku master` [learn more][Heroku git]

It is as simple as that.


[Heroku]: https://www.heroku.com/home
[new issue]: https://github.com/pro-grid/pro-grid/issues/new
[Heroku git]: https://devcenter.heroku.com/articles/git
[Heroku getting started]: https://devcenter.heroku.com/articles/quickstart
[redistogo]: https://addons.heroku.com/redistogo#nano
[Heroku websockets]: https://devcenter.heroku.com/articles/heroku-labs-websockets
