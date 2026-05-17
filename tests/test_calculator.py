from fastapi.testclient import TestClient
import pytest

from calculator import app, evaluate_expression

client = TestClient(app)


@pytest.mark.parametrize(
    "expression, expected",
    [
        ("1 + 2", 3),
        ("4*5", 20),
        ("7 - 2", 5),
        ("10/2", 5),
        ("2 + 3 * 4", 14),
        ("(1 + 3) * 2", 8),
        ("5 % 2", 1),
        ("2 ** 3", 8),
        ("-4 + 10", 6),
    ],
)
def test_evaluate_expression_valid(expression, expected):
    assert evaluate_expression(expression) == expected


@pytest.mark.parametrize(
    "expression",
    [
        "",
        "1 +",
        "2 ++ 2",
        "abs(1)",
        "__import__('os')",
        "2 + '3'",
    ],
)
def test_evaluate_expression_invalid(expression):
    with pytest.raises(ValueError):
        evaluate_expression(expression)


def test_api_calc_success():
    response = client.post("/api/calc", json={"expression": "15+5"})
    assert response.status_code == 200
    assert response.json() == {"result": 20}


def test_api_calc_empty_expression():
    response = client.post("/api/calc", json={"expression": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "Expression is required"


def test_api_calc_division_by_zero():
    response = client.post("/api/calc", json={"expression": "10 / 0"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Division by zero is not allowed"


def test_api_calc_unsupported_expression():
    response = client.post("/api/calc", json={"expression": "__import__('os')"})
    assert response.status_code == 400
    assert "Unsupported expression" in response.json()["detail"] or "Only numeric constants are allowed" in response.json()["detail"]
