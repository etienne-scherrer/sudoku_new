from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from .sudoku.board import Board
from .sudoku.solver import Solver
from .sudoku.generator import Generator
from .sudoku.importer import Importer, SudokuImportError

app = FastAPI()

API_KEY = os.getenv("API_KEY", "")


def require_api_key(request: Request):
    if not API_KEY:
        return  # auth disabled
    key = request.headers.get("X-API-Key", "")
    if key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/puzzle", dependencies=[Depends(require_api_key)])
def get_puzzle():
    board = Generator().generate()
    return board.to_array()


class SolveRequest(BaseModel):
    grid: list[list[dict]]


@app.post("/api/puzzle/solve", dependencies=[Depends(require_api_key)])
def solve_puzzle(body: SolveRequest):
    board = Board.from_array(body.grid)
    solver = Solver()
    if not solver.solve(board):
        return {"error": "This puzzle cannot be solved."}
    return {"result": board.to_array()}


@app.post("/api/puzzle/import", dependencies=[Depends(require_api_key)])
async def import_puzzle(image: UploadFile = File(...)):
    data = await image.read()
    try:
        board = Importer().import_image(data)
    except SudokuImportError as e:
        return {"error": str(e)}
    return {"grid": board.to_array()}
