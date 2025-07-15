# Base image
FROM node:18-alpine

# Cài một số gói build cần thiết (Alpine thiếu trình biên dịch mặc định)
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

# Copy trước package.json, package-lock.json và patches
COPY package*.json ./
COPY patches ./patches


# Cài đặt npm + áp dụng patch-package tự động sau install
RUN npm install

# Copy toàn bộ mã nguồn còn lại
COPY . .

EXPOSE 2207
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
