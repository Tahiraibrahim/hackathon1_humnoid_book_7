# Node.js use kar rahe hain
FROM node:20

# App ka folder banaya
WORKDIR /app

# Files copy ki aur install kiya
COPY package*.json ./
RUN npm install

# Baqi code copy kiya
COPY . .

# Code ko build kiya
RUN npm run build

# Hugging Face port 7860 use karta hai
EXPOSE 7860

# Server start
CMD ["npm", "start"]