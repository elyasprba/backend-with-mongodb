# 📌  Example authentication and authorization backend

This is an example authentication and authorization of a backend project with Express and Mongodb


## ⛏️  Tech Stack

**Server:** express, mongodb, redis, nodemailer, zod, jsonwebtoken, bcrypt

## ✍️ Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
PORT = ""

MONGO_URI = ""

CLIENT_URL = ""

JWT_ACCESS_SECRET = ""
JWT_REFRESH_SECRET = ""
JWT_ACCESS_SECRET_CONFIRM = ""
JWT_ACCESS_EXPIRES_TIME = ""
JWT_REFRESH_EXPIRES_TIME = ""
JWT_ACCESS_EXPIRES_TIME_CONFIRM = ""

REDIS_PASSWORD = ""
REDIS_HOST = ""
REDIS_PORT = ""

OAUTH_TYPE = ""
OAUTH_EMAIL = ""
OAUTH_CLIENTID = ""
OAUTH_CLIENT_SECRET = ""
OAUTH_REFRESH_TOKEN = ""
```

## 📍 Run Locally

Clone the project

```bash
  git clone https://github.com/elyasprba/backend-with-mongodb.git
```

Go to the project directory

```bash
  cd backend-with-mongodb
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## 🖇 API Reference

#### Welcome Endpoint

```http
  GET /
```

| Parameter | Type  | Description                                    |
| :-------- | :---- | :--------------------------------------------- |
| `NONE`    | `N/A` | Returns a welcome message for the application. |

#### Ping Endpoint

```http
  GET /ping
```

| Parameter | Type  | Description                                                |
| :-------- | :---- | :--------------------------------------------------------- |
| `NONE`    | `N/A` | Returns a 'pong' message to confirm the server is running. |

#### Auth Routes

#### Register

```http
  POST /api/auth/register
```

| Parameter  | Type     | Description                                      |
| :--------- | :------- | :----------------------------------------------- |
| body       | `object` | Required. JSON object with the following fields: |
| `username` | `string` | Required. The username of the user.              |
| `email`    | `sting`  | Required. The email address of the user.         |
| `password` | `string` | Required. The password for the user account.     |

- `Description`: Registers a new user. Validates the request data, checks for duplicate users, and then creates a new user account.

#### Response :

```
    {
        "message": "Register Success, Please Check your email for verification"
    }
```

#### Confirm Email

```http
 GET /api/auth/confirm/:token
```

| Parameter | Type     | Description                                                   |
| :-------- | :------- | :------------------------------------------------------------ |
| token     | `string` | Required. The token used to confirm the user's email address. |

- `Description`: Confirms a user's email address using the provided token. Validates the token and activates the user account if the token is valid.

#### Response :

```
    {
        "message": "Confirm Success"
    }
```

#### Login

```http
  POST /api/auth/login
```

| Parameter  | Type     | Description                                      |
| :--------- | :------- | :----------------------------------------------- |
| body       | `object` | Required. JSON object with the following fields: |
| `email`    | `sting`  | Required. The email address of the user.         |
| `password` | `string` | Required. The password for the user account.     |

- `Description`: Logs in a user by validating credentials and generating an authentication token.

#### Response :

```
    {
        "message": "Login success",
        "data": {
            "id": "123abc456",
            "email": "email@gmail.com",
            "username": "username",
            "role": "user || admin"
            },
        "accessToken": "",
        "refreshToken": ""
    }
```

#### Logout

```http
 POST /api/auth/logout
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| body	 | `object` | Required. JSON object with the following field: |
| token	 | `string` | Required. The token to be invalidated. |

- `Description`: Logs out a user by invalidating the provided authentication token.

#### Response :

```
    {
        "message": "Logout success"
    }
```


## 📄 Documentation

[Link Deploy to Vercel](https://backend-mongodb-app.vercel.app/)

[Documentation Postman](https://documenter.getpostman.com/view/20120165/2sA3sAh7wM)

### Thank You !!!!
