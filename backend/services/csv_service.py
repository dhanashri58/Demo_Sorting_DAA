import pandas as pd
import io
from typing import List, Dict, Any

def process_csv(file_content: bytes) -> Dict[str, Any]:
    df = pd.read_csv(io.BytesIO(file_content))
    
    # Get basic info
    num_rows = len(df)
    num_cols = len(df.columns)
    missing_values = int(df.isna().sum().sum())
    
    # Detect numeric columns
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    
    # Prepare preview data (first 20 rows)
    preview_data = df.head(20).fillna("").to_dict(orient="records")
    columns = df.columns.tolist()
    
    return {
        "num_rows": num_rows,
        "num_cols": num_cols,
        "numeric_cols": numeric_cols,
        "missing_values": missing_values,
        "preview_data": preview_data,
        "columns": columns
    }

def get_column_data(file_content: bytes, column_name: str) -> List[float]:
    df = pd.read_csv(io.BytesIO(file_content))
    # Drop NaNs before sorting
    return df[column_name].dropna().tolist()
