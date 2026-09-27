from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

from services.csv_service import process_csv, get_column_data
from services.benchmark_service import run_benchmark

router = APIRouter()

# In-memory store for demo. In a real app we would use distributed cache or blob storage
uploaded_file_content: bytes = b""

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    global uploaded_file_content
    try:
        content = await file.read()
        uploaded_file_content = content
        result = process_csv(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/dataset/generate")
async def generate_dataset(size: int = Form(...)):
    global uploaded_file_content
    import pandas as pd
    import io
    
    # Generate synthetic data
    data = {
        "ID": range(1, size + 1),
        "SyntheticValue1": [random.randint(1, 1000000) for _ in range(size)],
        "SyntheticValue2": [random.uniform(0.0, 100.0) for _ in range(size)]
    }
    df = pd.DataFrame(data)
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    uploaded_file_content = csv_buffer.getvalue()
    
    result = process_csv(uploaded_file_content)
    result["is_synthetic"] = True
    return result

@router.post("/benchmark")
async def benchmark(column: str = Form(...), input_type: str = Form(...), algorithm: str = Form(...)):
    global uploaded_file_content
    if not uploaded_file_content:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
        
    try:
        data = get_column_data(uploaded_file_content, column)
        
        results = {}
        if algorithm in ["quick", "both"]:
            results["quick"] = run_benchmark(data, "quick", input_type)
        if algorithm in ["merge", "both"]:
            results["merge"] = run_benchmark(data, "merge", input_type)
            
        return {
            "size": len(data),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
