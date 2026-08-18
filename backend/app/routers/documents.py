import shutil
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Document, Project


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# ALLOWED FILE TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
}


# ============================================================
# FILE EXTENSION
# ============================================================

def get_file_extension(
    filename: str,
) -> str:
    return Path(filename).suffix.lower()


# ============================================================
# EXTRACT TEXT
# ============================================================

def extract_document_text(
    file_path: Path,
) -> str:

    extension = (
        file_path.suffix.lower()
    )

    # ========================================================
    # TXT
    # ========================================================

    if extension == ".txt":
        try:
            return file_path.read_text(
                encoding="utf-8"
            )
        except UnicodeDecodeError:
            return file_path.read_text(
                encoding="latin-1"
            )

    # ========================================================
    # PDF
    # ========================================================

    if extension == ".pdf":

        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise HTTPException(
                status_code=500,
                detail=(
                    "pypdf is not installed. "
                    "Run: pip install pypdf"
                ),
            ) from exc

        try:
            reader = PdfReader(
                str(file_path)
            )

            pages = []

            for page in reader.pages:
                page_text = (
                    page.extract_text()
                    or ""
                )

                if page_text.strip():
                    pages.append(
                        page_text
                    )

            return "\n\n".join(
                pages
            )

        except Exception as exc:
            print(
                "PDF TEXT EXTRACTION ERROR:",
                exc,
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Could not extract PDF text."
                ),
            ) from exc

    # ========================================================
    # DOCX
    # ========================================================

    if extension == ".docx":

        try:
            from docx import (
                Document as DocxDocument,
            )
        except ImportError as exc:
            raise HTTPException(
                status_code=500,
                detail=(
                    "python-docx is not installed. "
                    "Run: pip install python-docx"
                ),
            ) from exc

        try:
            docx_document = (
                DocxDocument(
                    str(file_path)
                )
            )

            paragraphs = []

            for paragraph in (
                docx_document.paragraphs
            ):
                text = (
                    paragraph.text.strip()
                )

                if text:
                    paragraphs.append(
                        text
                    )

            return "\n\n".join(
                paragraphs
            )

        except Exception as exc:
            print(
                "DOCX TEXT EXTRACTION ERROR:",
                exc,
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "Could not extract DOCX text."
                ),
            ) from exc

    raise HTTPException(
        status_code=400,
        detail=(
            "Unsupported document type."
        ),
    )


# ============================================================
# UPLOAD DOCUMENT
# ============================================================

@router.post("/upload")
def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    print(
        f"[DOCUMENT] Upload request "
        f"project_id={project_id}, "
        f"filename={file.filename}"
    )

    # ========================================================
    # CHECK PROJECT
    # ========================================================

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    # ========================================================
    # UPLOADED BY
    # ========================================================

    uploaded_by = getattr(
        project,
        "user_id",
        None,
    )

    if uploaded_by is None:
        raise HTTPException(
            status_code=500,
            detail=(
                "Project does not have "
                "a valid user_id."
            ),
        )

    try:
        uploaded_by = int(
            uploaded_by
        )
    except (
        TypeError,
        ValueError,
    ) as exc:
        raise HTTPException(
            status_code=500,
            detail="Invalid project user_id.",
        ) from exc

    if uploaded_by <= 0:
        raise HTTPException(
            status_code=500,
            detail="Invalid uploaded_by user ID.",
        )

    # ========================================================
    # CHECK FILE
    # ========================================================

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    original_filename = Path(
        file.filename
    ).name

    if not original_filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid file name.",
        )

    extension = (
        get_file_extension(
            original_filename
        )
    )

    if (
        extension not in
        ALLOWED_EXTENSIONS
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF, DOCX and TXT "
                "files are supported."
            ),
        )

    # ========================================================
    # PROJECT DIRECTORY
    # ========================================================

    project_dir = (
        UPLOAD_DIR /
        str(project_id)
    )

    project_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    # ========================================================
    # UNIQUE FILE PATH
    # ========================================================

    file_path = (
        project_dir /
        original_filename
    )

    counter = 1

    while file_path.exists():

        file_path = (
            project_dir /
            (
                f"{Path(original_filename).stem}"
                f"_{counter}"
                f"{Path(original_filename).suffix}"
            )
        )

        counter += 1

    # ========================================================
    # SAVE FILE
    # ========================================================

    try:

        with file_path.open(
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except Exception as exc:

        print(
            "DOCUMENT FILE SAVE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not save uploaded document."
            ),
        ) from exc

    finally:

        try:
            file.file.close()
        except Exception:
            pass

    # ========================================================
    # DATABASE RECORD
    # ========================================================

    document = Document(
        project_id=project_id,

        filename=original_filename,

        file_path=str(
            file_path
        ),

        document_type=extension.replace(
            ".",
            "",
        ).upper(),

        uploaded_by=uploaded_by,
    )

    try:

        db.add(document)

        db.commit()

        db.refresh(document)

    except Exception as exc:

        db.rollback()

        try:
            if file_path.exists():
                file_path.unlink()
        except Exception as cleanup_error:
            print(
                "FILE CLEANUP ERROR:",
                cleanup_error,
            )

        print(
            "DOCUMENT DATABASE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not save document information."
            ),
        ) from exc

    return {
        "message":
            "Document uploaded successfully",

        "id":
            document.id,

        "document_id":
            document.id,

        "filename":
            document.filename,

        "file_path":
            document.file_path,

        "document_type":
            document.document_type,

        "project_id":
            document.project_id,

        "uploaded_by":
            document.uploaded_by,

        "created_at":
            document.created_at,
    }


# ============================================================
# GET PROJECT DOCUMENTS
# ============================================================

@router.get(
    "/project/{project_id}"
)
def get_project_documents(
    project_id: int,
    db: Session = Depends(get_db),
):

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    documents = (
        db.query(Document)
        .filter(
            Document.project_id ==
            project_id
        )
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id":
                document.id,

            "filename":
                document.filename,

            "file_path":
                document.file_path,

            "document_type":
                document.document_type,

            "project_id":
                document.project_id,

            "uploaded_by":
                document.uploaded_by,

            "created_at":
                document.created_at,
        }
        for document in documents
    ]


# ============================================================
# GET DOCUMENT
# ============================================================

@router.get(
    "/{document_id}"
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
):

    document = (
        db.query(Document)
        .filter(
            Document.id ==
            document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    return {
        "id":
            document.id,

        "filename":
            document.filename,

        "file_path":
            document.file_path,

        "document_type":
            document.document_type,

        "project_id":
            document.project_id,

        "uploaded_by":
            document.uploaded_by,

        "created_at":
            document.created_at,
    }


# ============================================================
# GET DOCUMENT TEXT
# ============================================================

@router.get(
    "/{document_id}/text"
)
def get_document_text(
    document_id: int,
    db: Session = Depends(get_db),
):

    document = (
        db.query(Document)
        .filter(
            Document.id ==
            document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    if not document.file_path:
        raise HTTPException(
            status_code=404,
            detail=(
                "Document file path "
                "not available."
            ),
        )

    file_path = Path(
        document.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found.",
        )

    text = extract_document_text(
        file_path
    )

    return {
        "document_id":
            document.id,

        "filename":
            document.filename,

        "text":
            text,
    }


# ============================================================
# DELETE DOCUMENT
# ============================================================

@router.delete(
    "/{document_id}"
)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
):

    document = (
        db.query(Document)
        .filter(
            Document.id ==
            document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    if document.file_path:

        file_path = Path(
            document.file_path
        )

        try:

            if file_path.exists():
                file_path.unlink()

        except Exception as exc:

            print(
                "FILE DELETE ERROR:",
                exc,
            )

    try:

        db.delete(document)

        db.commit()

    except Exception as exc:

        db.rollback()

        print(
            "DOCUMENT DELETE ERROR:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Could not delete document."
            ),
        ) from exc

    return {
        "message":
            "Document deleted successfully",

        "document_id":
            document_id,
    }


# ============================================================
# RISK ANALYSIS
# ============================================================

@router.get(
    "/{document_id}/risks"
)
def analyze_document_risks(
    document_id: int,
    db: Session = Depends(get_db),
):

    print(
        f"[RISK] Starting analysis "
        f"for document_id={document_id}"
    )

    # ========================================================
    # GET DOCUMENT
    # ========================================================

    document = (
        db.query(Document)
        .filter(
            Document.id ==
            document_id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    # ========================================================
    # CHECK FILE
    # ========================================================

    if not document.file_path:
        raise HTTPException(
            status_code=404,
            detail=(
                "Document file path "
                "not available."
            ),
        )

    file_path = Path(
        document.file_path
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found.",
        )

    # ========================================================
    # EXTRACT TEXT
    # ========================================================

    text = extract_document_text(
        file_path
    )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail=(
                "The uploaded document "
                "does not contain readable text."
            ),
        )

    lower_text = text.lower()

    risks = []

    # ========================================================
    # FINANCIAL
    # ========================================================

    if (
        "budget" not in lower_text
        and "cost" not in lower_text
        and "capital cost" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Financial",

                "severity":
                    "HIGH",

                "keywords": [
                    "budget",
                    "cost",
                    "financial",
                ],

                "points":
                    70,

                "title":
                    "Budget information missing",

                "description":
                    (
                        "The DPR does not clearly "
                        "contain budget or cost "
                        "information."
                    ),

                "recommendation":
                    (
                        "Include detailed project "
                        "cost and approved budget "
                        "information."
                    ),
            }
        )

    # ========================================================
    # SCHEDULE
    # ========================================================

    if (
        "duration" not in lower_text
        and "timeline" not in lower_text
        and "schedule" not in lower_text
        and "month" not in lower_text
        and "milestone" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Schedule",

                "severity":
                    "MEDIUM",

                "keywords": [
                    "duration",
                    "timeline",
                    "schedule",
                    "milestone",
                ],

                "points":
                    50,

                "title":
                    "Project timeline information missing",

                "description":
                    (
                        "The DPR does not clearly "
                        "specify the project "
                        "implementation timeline."
                    ),

                "recommendation":
                    (
                        "Include milestones and "
                        "an implementation schedule."
                    ),
            }
        )

    # ========================================================
    # ENVIRONMENT
    # ========================================================

    if (
        "environment" not in lower_text
        and "environmental" not in lower_text
        and "clearance" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Environmental",

                "severity":
                    "MEDIUM",

                "keywords": [
                    "environment",
                    "environmental",
                    "clearance",
                ],

                "points":
                    50,

                "title":
                    "Environmental assessment not identified",

                "description":
                    (
                        "No clear environmental "
                        "assessment was identified "
                        "in the document."
                    ),

                "recommendation":
                    (
                        "Include applicable "
                        "environmental clearances "
                        "and impact assessment."
                    ),
            }
        )

    # ========================================================
    # LAND
    # ========================================================

    if (
        "land acquisition" not in lower_text
        and "land requirement" not in lower_text
        and "land acquisition plan" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Land",

                "severity":
                    "MEDIUM",

                "keywords": [
                    "land acquisition",
                    "land requirement",
                    "land",
                ],

                "points":
                    45,

                "title":
                    "Land acquisition information missing",

                "description":
                    (
                        "The DPR does not clearly "
                        "describe land acquisition "
                        "requirements."
                    ),

                "recommendation":
                    (
                        "Provide land requirement "
                        "and acquisition status."
                    ),
            }
        )

    # ========================================================
    # TECHNICAL
    # ========================================================

    if (
        "technical" not in lower_text
        and "engineering" not in lower_text
        and "design" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Technical",

                "severity":
                    "MEDIUM",

                "keywords": [
                    "technical",
                    "engineering",
                    "design",
                ],

                "points":
                    45,

                "title":
                    "Technical information not clearly identified",

                "description":
                    (
                        "The DPR does not clearly "
                        "identify technical or "
                        "engineering information."
                    ),

                "recommendation":
                    (
                        "Include technical "
                        "specifications, design "
                        "assumptions and "
                        "engineering details."
                    ),
            }
        )

    # ========================================================
    # COMPLIANCE
    # ========================================================

    if (
        "approval" not in lower_text
        and "regulatory" not in lower_text
        and "compliance" not in lower_text
        and "statutory" not in lower_text
    ):

        risks.append(
            {
                "category":
                    "Compliance",

                "severity":
                    "MEDIUM",

                "keywords": [
                    "approval",
                    "regulatory",
                    "compliance",
                    "statutory",
                ],

                "points":
                    45,

                "title":
                    "Regulatory compliance information missing",

                "description":
                    (
                        "The DPR does not clearly "
                        "identify regulatory or "
                        "statutory compliance "
                        "requirements."
                    ),

                "recommendation":
                    (
                        "Document applicable "
                        "approvals, statutory "
                        "requirements and "
                        "compliance status."
                    ),
            }
        )

    # ========================================================
    # SCORE
    # ========================================================

    risk_count = len(
        risks
    )

    if risk_count == 0:

        score = 0
        overall_level = "LOW"

    else:

        total_points = sum(
            int(
                risk.get(
                    "points",
                    0,
                )
            )
            for risk in risks
        )

        score = min(
            100,
            round(
                total_points /
                risk_count
            ),
        )

        if score >= 80:
            overall_level = "CRITICAL"

        elif score >= 60:
            overall_level = "HIGH"

        elif score >= 35:
            overall_level = "MEDIUM"

        else:
            overall_level = "LOW"

    print(
        f"[RISK] Analysis completed: "
        f"score={score}, "
        f"level={overall_level}, "
        f"count={risk_count}"
    )

    return {
        "document_id":
            document.id,

        "project_id":
            document.project_id,

        "filename":
            document.filename,

        "score":
            score,

        "overall_level":
            overall_level,

        "risk_count":
            risk_count,

        "risks":
            risks,
    }