MOCHA_REPORTER = spec
MOCHA_FILES = test/**/*-test.js

dist:
	@NODE_ENV=prod ./node_modules/.bin/browserify index.js -o dist/carty.js -s carty
	@NODE_ENV=prod ./node_modules/.bin/browserify store/localStorage.js -o dist/carty.store.localstorage.js -s carty.store.localStorage
	@NODE_ENV=prod ./node_modules/.bin/uglify -s dist/carty.js -o dist/carty.min.js
	@NODE_ENV=prod ./node_modules/.bin/uglify -s dist/carty.store.localstorage.js -o dist/carty.store.localstorage.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(MOCHA_REPORTER) --require ./test/_polyfills "$(MOCHA_FILES)"

test-no-polyfills:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(MOCHA_REPORTER) "$(MOCHA_FILES)"

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/mocha/bin/_mocha --report html -- --reporter spec --require ./test/_polyfills "$(MOCHA_FILES)"

travis:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/mocha/bin/_mocha --report lcovonly -- --reporter spec --require ./test/_polyfills "$(MOCHA_FILES)" && \
		cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: dist test test-no-polyfills test-cov travis
