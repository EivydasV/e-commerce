NEST_NAME=backend-nest-nest-1
DB_NAME=backend-nest-db-1
start-dev:
	docker compose up -d

stop-dev:
	docker compose down

logs-dev:
	docker logs ${NEST_NAME} -f

exec-db:
	docker exec -it ${DB_NAME} mongosh

exec-dev:
	docker exec -it ${NEST_NAME} /bin/bash