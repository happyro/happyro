SHELL := /bin/bash

.PHONY: status doctor fetch-upstreams upstream-status configure-client configure-gateway test-client test-gateway build-server test

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

test-client: configure-client
	@./scripts/test-client.sh

test-gateway: configure-gateway
	@./scripts/test-gateway.sh

build-server:
	@./scripts/build-server.sh

test: doctor test-client test-gateway build-server
