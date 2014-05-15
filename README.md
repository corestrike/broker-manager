# broker-manager
ユーザーIDとブローカーIDを紐付けるためのサーバー。  
## Requirements
* node.js : 0.10.x
* Redis : ~2.8.9
* infoScoop : 3.4.0

## Settings
サーバーを起動する前にapp.jsにOAuth2設定を記述します。  
infoScoopのプロファイルAPIを利用して、ユーザーIDを取得する必要があるため、この設定を必ず行ってください。  

```
var INFOSCOOP_HOST=<infoScoopのアドレス>
var CLIENT_ID=<クライアントID>
var CLIENT_SECRET=<クライアントシークレット>
```

クライアントIDとクライアントシークレットは、`infoScoop管理画面 - 外部アプリタブ`より取得してください。  
登録する際、`ネイティブアプリケーション`として登録してください。
## Run Up
```
$ npm install
$ npm start --production
```
## API
### ブローカーIDの登録／更新
```
PUT http://<host>:3000/users/<userId>
Body
   brokerId=<brokerId>
```
### ブローカーIDの一覧取得
```
GET http://<host>:3000/users
```
接続が切れているユーザーの場合、ブローカーIDは空になります。
### ブローカーIDの検索
```
GET http://<host>:3000/users/<userId>
```
### ブローカーIDの削除
```
DELETE http://<host>:3000/users/<userId>
```
**接続が切れた段階でこのAPIを呼び出してください**
