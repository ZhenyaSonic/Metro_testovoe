from fastapi import FastAPI

app = FastAPI(
    title="Test Task API",
    description="API для тестового задания",
    version="1.0.0",
)


@app.get("/")
def read_root():
    return {"message": "Welcome to Test Task API"}
