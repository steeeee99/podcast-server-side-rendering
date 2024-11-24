FROM python:3.13-slim
RUN pip install poetry

WORKDIR /app

COPY pyproject.toml ./pyproject.toml
COPY poetry.lock ./poetry.lock
COPY ./.env .env
RUN poetry install

COPY ./backend_podcast/ ./backend_podcast/

EXPOSE 8000
CMD poetry run start
