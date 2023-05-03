help:
	@echo "usage: make update|install|debian" 
update:
	@cd osctools
	@npm install
install:
	@cd osctools
	npm -g install
debian:
	@./bin/build.sh

