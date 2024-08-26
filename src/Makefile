api-build:
	docker-compose build api

api-up:
	docker-compose up api

file_to_text: ## run save_file_to_text script
	docker-compose run --rm api python3 app/scripts/file_to_text.py $(file_name)

run-ocr: ## run OCR script # TODOOOOO
	docker-compose run --rm api python3 app/scripts/ocr_ticket_extraction.py $(file_name)

tests: ## run tests
	docker-compose run --rm api pytest app/tests/

web-up: ## run web actualmente en desarrollo
	fnm install 16 && fnm use 16 && cd ./frontend/vite-project && npm run dev

pwd:
	@pwd