# Python 3.9 use karenge
FROM python:3.9

# Container mein folder banaya
WORKDIR /code

# Requirements file copy ki aur install ki
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Pura backend folder copy kiya
COPY backend /code/backend

# Server start kiya (Port 7860 par)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]