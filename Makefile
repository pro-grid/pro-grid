watch: 
	./node_modules/.bin/nodemon lib/web.js

test:
	./node_modules/.bin/mocha --reporter list

.PHONY: test watch
