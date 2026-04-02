FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir "fastapi>=0.115.0,<1.0.0" "pydantic>=2.8.0,<3.0.0" "uvicorn>=0.30.0,<1.0.0"

COPY apps/control-plane/pyproject.toml ./pyproject.toml
COPY apps/control-plane/app ./app
COPY agents ./agents
COPY docs ./docs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--app-dir", "/app"]
