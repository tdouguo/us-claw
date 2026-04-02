from fastapi import FastAPI


app = FastAPI(title="US Claw Control Plane", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "us-claw-control-plane"
    }
