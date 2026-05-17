# CalculatorApp

A simple FastAPI calculator app with a modern static frontend.

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
uvicorn calculator:app --reload
```

Then open the app in your browser at:

```text
http://127.0.0.1:8000/
```

## API

POST `/api/calc`

Request body:

```json
{
  "expression": "15+5"
}
```

Response example:

```json
{
  "result": 20
}
```

## Browser usage

- Enter an arithmetic expression in the input field
- Press `=` or hit Enter
- The result appears below the expression field

Supported operators:

- `+`, `-`, `*`, `/`
- `%`, `**`
- parentheses `( )`

## Tests

Run the automated test suite with:

```bash
pytest
```

## Continuous integration

This project includes a GitHub Actions workflow that runs `pytest` automatically on every push and pull request.
