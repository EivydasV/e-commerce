NEST_NAME=backend-nest-nest-1
DB_NAME=backend-nest-db-1

up:
	docker compose up -d

up-build:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker logs ${NEST_NAME} -f

exec-mongo:
	docker exec -it ${DB_NAME} mongosh

exec-node:
	docker exec -it ${NEST_NAME} /bin/bash