FROM node:24.4-alpine3.21 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install @mui/material @emotion/react @emotion/styled @mui/lab @mui/icons-material

COPY . .
RUN npm run build

FROM node:24.4-alpine3.21
WORKDIR /app

# serve는 실행 스테이지에서 설치
RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
