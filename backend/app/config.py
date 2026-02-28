import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "120"))
FRONTEND_ORIGINS = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

FRONTEND_ORIGINS_LIST = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is not set. Please add it to your environment.")

client = MongoClient(MONGO_URI)
db = client["mock_interview_db"]
