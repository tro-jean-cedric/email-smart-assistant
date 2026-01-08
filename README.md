# Smart Email Assistant

A web-based intelligent email management system that connects to Outlook via win32com, analyzes emails using AI, and presents actionable insights.

## Setup

1.  **Database**:
    ```bash
    docker-compose up -d
    ```

2.  **Backend**:
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
