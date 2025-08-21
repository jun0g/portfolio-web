cd ./api
go mod vendor

cd ../web
npm ci
npm run build