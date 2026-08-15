SHELL := /bin/bash

.PHONY: status doctor fetch-upstreams upstream-status configure-client configure-gateway configure-resources configure-server database-start database-stop database-status database-verify server-start server-stop server-status server-verify gateway-start gateway-stop gateway-status gateway-verify test-account automation-account test-client test-gateway build-server test

status:
	@./scripts/status.sh

doctor:
	@./scripts/doctor.sh

fetch-upstreams:
	@./scripts/upstreams.sh fetch

upstream-status:
	@./scripts/upstreams.sh status

configure-client:
	@./scripts/configure-client.sh

configure-gateway:
	@./scripts/configure-gateway.sh

configure-resources:
	@./scripts/configure-resources.sh

configure-server:
	@./scripts/configure-server.sh

database-start:
	@./scripts/database.sh start

database-stop:
	@./scripts/database.sh stop

database-status:
	@./scripts/database.sh status

database-verify:
	@./scripts/database.sh verify

server-start:
	@./scripts/server.sh start

server-stop:
	@./scripts/server.sh stop

server-status:
	@./scripts/server.sh status

server-verify:
	@./scripts/server.sh verify

gateway-start:
	@./scripts/gateway.sh start

gateway-stop:
	@./scripts/gateway.sh stop

gateway-status:
	@./scripts/gateway.sh status

gateway-verify:
	@./scripts/gateway.sh verify

test-account:
	@./scripts/test-account.sh

automation-account:
	@./scripts/automation-account.sh

test-client: configure-client
	@./scripts/test-client.sh

test-gateway: configure-gateway
	@./scripts/test-gateway.sh

build-server:
	@./scripts/build-server.sh

test: doctor test-client test-gateway build-server
