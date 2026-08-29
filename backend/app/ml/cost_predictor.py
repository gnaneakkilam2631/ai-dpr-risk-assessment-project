from pathlib import Path
from typing import Any, Dict, Optional

import joblib
import numpy as np


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "project_cost_model.pkl"


# ============================================================
# FEATURES
# ============================================================

FEATURE_NAMES = [
    "duration_months",
    "length_km",
    "width_m",
    "population",
    "adt",
    "structures",
    "cbr",
    "right_of_way_m",
]


# ============================================================
# MODEL CACHE
# ============================================================

_model = None


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():
    global _model

    if _model is not None:
        return _model

    if not MODEL_PATH.exists():
        print(
            f"[ML] Model file not found: {MODEL_PATH}"
        )
        return None

    try:
        _model = joblib.load(
            MODEL_PATH
        )

        print(
            f"[ML] Model loaded: {MODEL_PATH}"
        )

        return _model

    except Exception as exc:
        print(
            "[ML] MODEL LOAD ERROR:",
            exc,
        )

        _model = None

        return None


# ============================================================
# MODEL AVAILABLE
# ============================================================

def model_available() -> bool:
    return load_model() is not None


# ============================================================
# SAFE NUMBER
# ============================================================

def safe_number(
    value: Any,
    default: float = 0.0,
) -> float:

    try:
        number = float(value)

        if np.isfinite(number):
            return number

    except (
        TypeError,
        ValueError,
    ):
        pass

    return default


# ============================================================
# BUILD FEATURES
# ============================================================

def build_feature_vector(
    features: Dict[str, Any],
) -> np.ndarray:

    values = []

    for name in FEATURE_NAMES:

        values.append(
            safe_number(
                features.get(name)
            )
        )

    return np.array(
        [values],
        dtype=float,
    )


# ============================================================
# PREDICT PROJECT COST
# ============================================================

def predict_project_cost(
    features: Dict[str, Any],
) -> Optional[Dict[str, Any]]:

    model = load_model()

    if model is None:
        return None

    try:

        vector = build_feature_vector(
            features
        )

        prediction = float(
            model.predict(
                vector
            )[0]
        )

        prediction = max(
            0.01,
            prediction,
        )

        return {
            "prediction": round(
                prediction,
                2,
            ),
            "confidence": None,
            "features": {
                name: safe_number(
                    features.get(name)
                )
                for name in FEATURE_NAMES
            },
            "model_path": str(
                MODEL_PATH
            ),
        }

    except Exception as exc:

        print(
            "[ML] PREDICTION ERROR:",
            exc,
        )

        return None


# ============================================================
# BACKWARD-COMPATIBLE FUNCTION
#
# Your documents.py was previously trying to import:
# get_project_cost_prediction
#
# Keep this function so old imports do not break.
# ============================================================

def get_project_cost_prediction(
    features: Dict[str, Any],
) -> Optional[Dict[str, Any]]:

    return predict_project_cost(
        features
    )