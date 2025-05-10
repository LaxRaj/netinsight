# NetInsight

**Full-stack traffic anomaly detection & clustering dashboard**

- **Backend:** FastAPI, Uvicorn, MongoDB (or PostgreSQL)
- **Frontend:** React, Vite, Chart.js
- **Dev:** Python 3.10+, Node 18+, Docker

## Local setup

### Backend
\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
