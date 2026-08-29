from pathlib import Path
from typing import List

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATASET_PATH = BASE_DIR / "projects.csv"

MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "project_cost_model.pkl"


# ============================================================
# FEATURES
# ============================================================

FEATURE_COLUMNS: List[str] = [
    "duration_months",
    "length_km",
    "width_m",
    "population",
    "adt",
    "structures",
    "cbr",
    "right_of_way_m",
]

TARGET_COLUMN = "actual_cost_cr"


# ============================================================
# LOAD DATA
# ============================================================

if not DATASET_PATH.exists():

    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}"
    )


df = pd.read_csv(
    DATASET_PATH
)


print(
    "Dataset loaded:"
)

print(
    df.head()
)


# ============================================================
# VALIDATE COLUMNS
# ============================================================

required_columns = (
    FEATURE_COLUMNS +
    [TARGET_COLUMN]
)


missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]


if missing_columns:

    raise ValueError(
        "Missing required columns: "
        + ", ".join(
            missing_columns
        )
    )


# ============================================================
# CLEAN DATA
# ============================================================

df = df[
    required_columns
].copy()


for column in required_columns:

    df[column] = pd.to_numeric(
        df[column],
        errors="coerce",
    )


df = df.dropna()


# ============================================================
# REMOVE INVALID VALUES
# ============================================================

df = df[
    df[TARGET_COLUMN] > 0
]


if len(df) < 5:

    raise ValueError(
        "At least 5 historical projects "
        "are required for this demo model."
    )


if len(df) < 15:

    print(
        "[WARNING] Only",
        len(df),
        "training rows are available."
    )

    print(
        "[WARNING] Add more historical projects "
        "for a more reliable model."
    )


# ============================================================
# FEATURES + TARGET
# ============================================================

X = df[
    FEATURE_COLUMNS
]

y = df[
    TARGET_COLUMN
]


# ============================================================
# SPLIT
# ============================================================

if len(df) >= 10:

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.20,
            random_state=42,
        )
    )

else:

    X_train = X
    X_test = X
    y_train = y
    y_test = y


# ============================================================
# MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1,
)


# ============================================================
# TRAIN
# ============================================================

model.fit(
    X_train,
    y_train,
)


# ============================================================
# EVALUATE
# ============================================================

predictions = model.predict(
    X_test
)


mae = mean_absolute_error(
    y_test,
    predictions,
)


if len(y_test) >= 2:

    r2 = r2_score(
        y_test,
        predictions,
    )

else:

    r2 = None


print(
    "============================================"
)

print(
    "PROJECT COST MODEL TRAINED"
)

print(
    "Rows:",
    len(df),
)

print(
    "MAE:",
    round(
        float(mae),
        3,
    ),
)

print(
    "R2:",
    None
    if r2 is None
    else round(
        float(r2),
        3,
    ),
)

print(
    "============================================"
)


# ============================================================
# SAVE MODEL
# ============================================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


joblib.dump(
    model,
    MODEL_PATH,
)


print(
    "Model saved to:"
)

print(
    MODEL_PATH
)