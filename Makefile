help:
	@echo "usage: make osctools-update|osctools-install|debian|raspi-init" 
osctools-update:
	@./bin/osctools-update.sh
install:
	@./bin/osctools-install.sh
raspi-init:
	@./bin/raspi-init.sh
debian:
	@./bin/build.sh

