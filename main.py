from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Welcome to CleanIQ AI Data Cleaning Platform!"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Read CSV
    df = pd.read_csv(file_path)

    # Count duplicate rows
    duplicate_rows = int(df.duplicated().sum())

    # Remove duplicates
    df = df.drop_duplicates()

    # Missing values before cleaning
    missing_values = df.isnull().sum().to_dict()
    original_missing = int(df.isnull().sum().sum())

    # Fill numeric columns with median
    numeric_cols = df.select_dtypes(include="number").columns

    for col in numeric_cols:
        df[col] = df[col].fillna(df[col].median())

    # Fill text columns with mode
    text_cols = df.select_dtypes(include="object").columns

    for col in text_cols:
        if not df[col].mode().empty:
            df[col] = df[col].fillna(df[col].mode()[0])

    # Missing values after cleaning
    remaining_missing = int(df.isnull().sum().sum())
    fixed_missing = original_missing - remaining_missing

    # Save cleaned file
    cleaned_file = f"cleaned_{file.filename}"
    cleaned_path = os.path.join(UPLOAD_FOLDER, cleaned_file)

    df.to_csv(cleaned_path, index=False)

    # Data types
    data_types = df.dtypes.astype(str).to_dict()

    # Quality Score
    total_cells = len(df) * len(df.columns)

    if total_cells > 0:
        quality_score = max(
            0,
            round(
                100
                - (
                    (remaining_missing / total_cells) * 50
                    + (duplicate_rows / max(len(df), 1)) * 50
                ),
                2,
            ),
        )
    else:
        quality_score = 100

    # AI Suggestions
    suggestions = []

    if duplicate_rows > 0:
        suggestions.append(
            f"Removed {duplicate_rows} duplicate rows"
        )

    if fixed_missing > 0:
        suggestions.append(
            f"Filled {fixed_missing} missing values automatically"
        )

    if quality_score < 80:
        suggestions.append(
            "Dataset quality is low. Review columns carefully."
        )

    before_duplicates = duplicate_rows
    after_duplicates = 0

    before_missing = original_missing
    after_missing = remaining_missing

    return {
        "filename": file.filename,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "fixed_missing": fixed_missing,
        "preview": df.head(5).to_dict(orient="records"),
        "data_types": data_types,
        "download_file": cleaned_file,
        "quality_score": quality_score,
        "suggestions": suggestions,
        "before_duplicates": before_duplicates,
        "after_duplicates": after_duplicates,
        "before_missing": before_missing,
        "after_missing": after_missing
    }


@app.get("/download/{filename}")
def download_file(filename: str):

    file_path = os.path.join(UPLOAD_FOLDER, filename)

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="text/csv"
    )