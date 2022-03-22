# 不動産サイトの restapi

## Description

nestjs の勉強のために作成しました。
気が向いたらフロントエンドも実装します。
Bearer 認証を採用しているのでトークンを送信する際はヘッダーに`Authorization: Bearer token`を乗せて送信してください。

## Endpoint

userType = `ADMIN` | `REALTOR` | `BUYER`

`ADMIN`: `REALTORアカウントを作成するための鍵を作れます`

`REALTOR`: `物件の登録や更新、削除が出来ます`

`BUYER`: `気になった物件はお問い合わせすることが出来ます`

| mehtods | url                    | userType              | Overview                                                                 | Option                                      |
| ------- | ---------------------- | --------------------- | ------------------------------------------------------------------------ | ------------------------------------------- |
| GET     | /home                  |                       | 全ての物件を取得する                                                     |                                             |
| GET     | /home/:id              |                       | 単一の物件を取得する                                                     | クエリパラメーターで絞り込みが出来ます`[1]` |
| POST    | /home                  | REALTOR               | 物件を登録する                                                           |                                             |
| PUT     | /home/:id              | REALTOR               | 物件の情報を更新する                                                     |                                             |
| DELETE  | /home/:id              | REALTOR               | 物件を削除する                                                           |                                             |
| POST    | /home/:id/inquire      | BUYER                 | 物件にお問い合わせをする                                                 |                                             |
| DELETE  | /home/:id/messages     | REALTOR               | お問い合わせをしたユーザー情報と内容を取得する                           |                                             |
| POST    | /auth/signup/:userType |                       | ユーザーを新規作成する。ADMIN, REALTOR の場合は productKey が必要        |                                             |
| POST    | /auth/signin           |                       | 既存のユーザーにログインし jwt を返却する                                |                                             |
| POST    | /auth/key              | ADMIN                 | userType と email を受け取り signup に必要な productKey を生成し返却する |                                             |
| GET     | /auth/me               | ADMIN, REALTOR, BUYER | jwt からユーザー情報を取得し返却する                                     |                                             |

`[1]`
city = 都道府県
minPrice = 最小価格
maxPrice = 最大価格
propertyType = 住宅のタイプ (`RESIDENTIAL` | `CONDO`)

## Installation

```bash
cp .env.example .env
```

```bash
docker-compose up
```

```bash
docker container exec -it nest bash
npx prisma db push
```
