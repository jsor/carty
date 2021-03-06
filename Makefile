MOCHA_REPORTER = spec
MOCHA_FILES = test/**/*-test.js

dist:
	@NODE_ENV=production ./node_modules/.bin/webpack

watch:
	@NODE_ENV=production ./node_modules/.bin/webpack --watch

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(MOCHA_REPORTER) --require es6-promise "$(MOCHA_FILES)"

test-no-polyfills:
	@NODE_ENV=test ./node_modules/.bin/mocha -b --reporter $(MOCHA_REPORTER) "$(MOCHA_FILES)"

test-cov:
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/mocha/bin/_mocha --report html -- --reporter spec --require es6-promise "$(MOCHA_FILES)"

travis:
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/.bin/istanbul cover \
		./node_modules/mocha/bin/_mocha --report lcovonly -- --reporter spec --require es6-promise "$(MOCHA_FILES)"

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: dist watch test test-no-polyfills test-cov travis
