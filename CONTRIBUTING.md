progrid.io
===
## Javascript Guidelines
We appreciate all pull requests. However in an effort to keep the code maintainable we do ask that potential contributions follow some style guidelines. When in doubt, I would default to the [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).

### All code should pass [JSHint](http://www.jshint.com/) without errors
run `grunt jshint` to check your build for [JSHint](http://www.jshint.com/) errors. This helps easily enforce best practices across all contributions.
>JSHint is a community-driven tool to detect errors and potential problems in JavaScript code and to enforce your team's coding conventions. It is very flexible so you can easily adjust it to your particular coding guidelines and the environment you expect your code to execute in. JSHint is open source and will always stay this way.

### Asynchronous style
If you would like to make improvements to web.js (the node server componenet), we are trying to minimize the amount of synchronous code. Please consider writing in an asynchronous style when modifying web.js. 

**More information:**
 - http://blog.shinetech.com/2011/08/26/asynchronous-code-design-with-node-js/
 - https://github.com/caolan/async#asyncjs
 - http://book.mixu.net/node/ch7.html
