REPORTER = spec

dist:
	@NODE_ENV=prod ./node_modules/.bin/browserify index.js -o dist/carty.js -s carty
	@NODE_ENV=prod ./node_modules/.bin/browserify store/localStorage.js -o dist/carty.store.localstorage.js -s carty.store.localStorage

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(REPORTER) --recursive

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha --report html -- -R spec --recursive

travis:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec --recursive && \
		cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: dist test test-cov travis
