api-build:
	docker-compose build api

api-up:
	docker-compose up api

run-ocr: ## run OCR script
	docker-compose run --rm api python3 app/scripts/ocr.py
tests: ## run tests
	docker-compose run --rm api pytest app/tests/

web-up: ## run web actualmente en desarrollo
	fnm install 16 && fnm use 16 && cd ./frontend/vite-project && npm run dev

pwd:
	@pwd