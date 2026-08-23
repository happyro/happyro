SHELL := /bin/bash

.PHONY: status doctor fetch-upstreams upstream-status configure-client configure-gateway configure-resources configure-server database-start database-stop database-status database-verify server-start server-stop server-status server-verify gateway-start gateway-stop gateway-status gateway-verify test-account automation-account test-client test-gateway build-server test

status:
	@./scripts/maintenance/status.sh

doctor:
	@./scripts/maintenance/doctor.sh

fetch-upstreams:
	@./scripts/maintenance/upstreams.sh fetch

upstream-status:
	@./scripts/maintenance/upstreams.sh status

configure-client:
	@./scripts/client/configure-client.sh

configure-gateway:
	@./scripts/gateway/configure-gateway.sh

configure-resources:
	@./scripts/resources/configure-resources.sh

configure-server:
	@./scripts/server/configure-server.sh

database-start:
	@./scripts/database/database.sh start

database-stop:
	@./scripts/database/database.sh stop

database-status:
	@./scripts/database/database.sh status

database-verify:
	@./scripts/database/database.sh verify

server-start:
	@./scripts/server/server.sh start

server-stop:
	@./scripts/server/server.sh stop

server-status:
	@./scripts/server/server.sh status

server-verify:
	@./scripts/server/server.sh verify

gateway-start:
	@./scripts/gateway/gateway.sh start

gateway-stop:
	@./scripts/gateway/gateway.sh stop

gateway-status:
	@./scripts/gateway/gateway.sh status

gateway-verify:
	@./scripts/gateway/gateway.sh verify

test-account:
	@./scripts/account/test-account.sh

automation-account:
	@./scripts/account/automation-account.sh

test-client: configure-client
	@./scripts/client/test-client.sh

test-gateway: configure-gateway
	@./scripts/gateway/test-gateway.sh

build-server:
	@./scripts/server/build-server.sh

test: doctor test-client test-gateway build-server
