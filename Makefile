REPORTER ?= list

.PHONY: test

test:
	./node_modules/mocha/bin/mocha -R $(REPORTER) test/suite
