# Content

1. [Introduction](#introduction)
2. [Routes](#routes)
3. [Register route](#register-route)
4. [Login route](#login-route)
5. [Refresh token route](#refresh-token-route)
6. [Forgot password route](#forgot-password-route)
7. [Reset password route](#reset-password-route)
8. [Verify email route](#verify-email-route)
9. [Change password route](#change-password-route)
10. [Change email route](#change-email-route)
11. [Remove user route](#remove-user-route)
12. [Get all users route](#get-all-users-route)
13. [Pagination route](#pagination-route)
14. [Update email route](#update-email-route)
15. [Update email url route](#update-email-url-route)
16. [Verify email URL route](#verify-email-url-route)
17. [Create profile route](#create-profile-route)
18. [Update profile route](#update-profile-route)
19. [Disable account route](#disable-account-route)
20. [Delete account route](#delete-account-route)
21. [Get profile route](#get-profile-route)
22. [Download user data route](#download-user-data-route)
23. [Create profile picture route](#create-profile-picture-route)
24. [Update profile picture route](#update-profile-picture-route)
25. [Remove profile picutre route](#remove-profile-picture-route)
26. [TOTP verification test route](#totp-verification-test-route)
27. [Change role route](#change-role-route)
28. [Protected route](#protected-route)











# Documentation for MarketSeon API

## Introduction

This application is using express, Node.js framework.
It uses Prisma ORM with postreSQL. This makes using postgreSQL easier.

</br>
</br>

**npm install** - to download all dependencies

**npm run dev** - to start application

## 1. You should create .env file for application to work, and insert your data.

> This is an example of working .env:

- PORT=3000
- BASE_URL=http://localhost:3000/api

#TOKEN

- ACCESS_TOKEN_SECRET=mouse
- REFRESH_TOKEN_SECRET=mice
- ACCESS_TOKEN_LIFE=30000
- REFRESH_TOKEN_LIFE=1500000

#EMAIL

- USER=info@marketseon.com
- PASS=Z6Ckdh1gv4swy0Hn7rNU
- SERVICE=gmail
- CLIENT_ID=451273081809-b10201q3op39n33221l0658usg56muh0.apps.googleusercontent.com
  CLIENT_SECRET=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
- REDIRECT_URI=https://developers.google.com/oauthplayground
- REFRESH_TOKEN=1//04cSzdELKtwJYCgYIARAAGAQSNwF-L9IrJbmIUCTwZXyILmWcls3ByxHTf9iN3sNrKXR_XzQQAOksif9HJoKvXz3cNftWRXIBObY
- ORIGIN_URL=https://dolphin-app-l44b9.ondigitalocean.app
- AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1haGlyIE11bGFvbWVyb3ZpYyIsImlhdCI6MTUxNjIzOTAyMn0.ORFByVWnupwbEYng-cByZ2qaU8YreblFd6J-YwG3Y3o

#Verification Token

- SECRET_KEY=mouse

- DATABASE_URL="postgresql://myuser:512627@localhost:5432/marketseon"

## 2. You should run your postgreSQL database

## 2.1. You should run docker container minion

sudo docker run -it --name=miniotest -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
</br>
If container is already running use "docker container rm bc0ecf8cd9fc0c54a3d5e71b32d29bbb13ef6c79cc217722b7c5f59f052f3bed" to remove container and then run command above.

## 3. Folder structure

- Migrations
- src
  - controllers
    - admin.controllers
    - auth.controllers
    - user.controllers
  - entities
    - response
      - api.response
  - middlewares
  - auth.middleware
  - generic-error.handler
  - node-error.handler
  - not-found.handler
  - resources
    - consts
      - constants
    - enums
      - errors.json
  - routes
  - index
  - types
  - user.type
  - util
  - array
  - chechkrefreshtoken
  - context
  - logger
  - object
  - sendemails
  - string
  - validations
- app.ts
- config.ts

## Routes

### Authentication Routes:

base URL: "http://localhost:3000/api"

## Register route 
[|^|](#content)

> POST `/register`: This route allows a new user to register for the app using their email, password, and other required fields.
> </br>
> http://localhost:3000/api/register

</br>
Description:
</br>
<p>
<i>
To register new user you should send email, password and username in request body. Email should be unique, password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. Username should be unique. If you send wrong data you will get error message. 
</br>
Bycrypt will be used to hash password.</br>
Speakeasy will be used to generate secret key for OTP generation. (OTP - One-time password algorithm) </br>
When you register, your user will be "user" role. You can change your role to "admin" in database. With route for that. </br>
When you register email will be sent to your email address. You should click on link in email to verify your email address. If you don't verify your email address your account will be limited.</br>
When you register you will get <b>secret key </b> . It will be saved in your database. You will need this key to generate OTP.
It is planned to implement QR code for OTP generation. TOTP - Time-based One-time Password Algorithm will be used for OTP generation.</br>
<b>For testing purposes you can use Google Authenticator app to generate OTP.</b> It can be generated from "base32" key in your database. Google Authenticator app can be downloaded from Google Play Store. It will use base32 key and give you Token for 30 seconds. You should use this token to login.</br>
JWT token will be generated with email, id and SECRET from .env file. This token will be used for email verification. It will be sent to your email address. You should click on link in email to verify your email address. If you don't verify your email address your account will be limited.</br>
Function that sends emails sendEmail(email, "Verify your email", null, emailContent); can send text and html.
If you want to send html you should use last parameter in function. If you want to send text you should use null as last parameter and write text as third parameter.
</i>
</p>
</br>
Request:
request body:

```json
{
  "email": "joe@hotmail.com",
  "password": "Mahir12345!",
  "username": "mahE"
}
```

</br>
Response:</br>

```json
{
  "message": "User registered successfully and email sent to your email address",
  "user": {
    "id": 28,
    "username": "bake",
    "email": "joe@hotmail.com",
    "emailVerified": false,
    "verificationToken": null, //possibly usless
    "password": "$2b$10$nrfE/z321XhbGIqOM2B4Bexf7cdeDz846dbohKpVP/GCdxCjyNpke",
    "role": "user",
    "profileStatus": "active",
    "secret": {
      "hex": "6b2445744d69324e737d5b295e6b342e21497d75",
      "ascii": "k$EtMi2Ns}[)^k4.!I}u",
      "base32": "NMSEK5CNNEZE4435LMUV42ZUFYQUS7LV",
      "otpauth_url": "otpauth://totp/SecretKey?secret=NMSEK5CNNEZE4435LMUV42ZUFYQUS7LV"
    }
  }
}
```

</br>

## Login route
[|^|](#content)

> POST `/login`: This route allows a user to log in to the app using their email and password.
> </br>
> http://localhost:3000/api/login
> </br>

Description:
To login you should send email, password and token in request body. If you send wrong data you will get error message.</br>
Token(TOTP) is generated with speakeasy. It is generated with secret key from your database. You can generate token with Google Authenticator app. It can be downloaded from Google Play Store. It will use base32 key and give you Token for 30 seconds. You should use this token to login.</br>
If your credentials are correct you will get JWT token access and refresh token. You should use access token to access protected routes. You should use refresh token to get new access token.</br>
Access token will expire in 30 minutes. Refresh token will expire in 25 hours. If you want to change expiration time you should change it in .env file.</br>

</br>

Request:
request body:

```json
{
  "email": "joe@hotmail.com",
  "password": "Mahir12345!",
  "token": "335954"
}
```

</br>
Response:
</br>

```json
{
  "username": "bake",
  "status": "Logged in",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGlyLmNzQGhvdG1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NzMwMTIyMzYsImV4cCI6MTY3MzAxMjI2Nn0.1hMOa5ASYgdp9Tk86Y_QYXIxh9862UULErZX5U293gU",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGlyLmNzQGhvdG1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NzMwMTIyMzYsImV4cCI6MTY3MzAxMzczNn0.FaCEwKsamAiFn0w0ttBSP691_27X8wnUXdbYShOCsnc"
}
```

</br>

## Refresh Token route
[|^|](#content)

> GET `/refreshtoken`: This route allows a user to refresh their access token, which is required for authenticated requests.
> </br>
> http://localhost:3000/api/refreshtoken
> </br>

Description:
To refresh your access token you should send refresh token in request headers. If you send wrong data you will get error message.</br>
You will get new access token and refresh token. You should use new access token to access protected routes. You should use new refresh token to get new access token.</br>
To change expiration time you should change it in .env file.</br>
Access token and refresh token can be aquired from login route.</br>

</br>

Request:
request headers:

```json
GET http://localhost:3000/api/refreshtoken
Host: http://localhost:3000
Content-Type: application/json
refresh-token: eyJhbGciOi..
access-token: eyJhbGciOi..

```

</br>
Response:
</br>

```json
{
  "status": "Logged in, new token generated",
  "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGlyLmNzQGhvdG1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NzMwMTM0NzIsImV4cCI6MTY3MzAxMzUwMn0.2r-RXEg5HkmvaDKy7S10ZCIBOgEFxPISWrvXT5RX_qk",
  "refresh-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGlyLmNzQGhvdG1haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2NzMwMTM0NzIsImV4cCI6MTY3MzAxNDk3Mn0.DtwwK6SObyxXlz2--M562LXc9jp1Ujh-08bHif3QzC0"
}
```

## Forgot password route:
[|^|](#content)

> POST `/forgotpassword`: This route allows a user to request a password reset by providing their email address.
> </br>
> http://localhost:3000/api/forgotpassword
> </br>

Description:
If you forgot your password you can reset your password with this route.</br>
You should send email and newpassword in request body.</br>
When you send email it will check if your email is in database. If it is in database it will then validate newpassword. If email is in database, and new password pass validation, the email will be sent to your address.</br>
When you click on the lin in the email it will change your password.</br>
Link is created with JWT token. JWT token contains your email and newpassword.</br>
It uses resetpassword route to verify email and change password.</br>

</br>

Request:
request body:

```json
{
  "email": "joe@hotmail.com",
  "newpassword": "Nahir12345!"
}
```

</br>
Response:
</br>

```json
{
  "message": "Email sent successfully, please confirm your new password"
}
```

## Reset Password route
[|^|](#content)

> POST `/resetpassword/:id/:token`: This route allows a user to reset their password using a unique user ID and token that were sent to their email address.
> </br>
> http://localhost:3000/api/refreshtoken
> </br>

Description:
This route is used to reset passoword. It will be sent to your email. You should click on the link to reset your password.</br>
When you click, it will verify that email address is in database and it will validate new password. If it is in database and new password pass validation it will change your password.</br>

</br>
</br>

</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/resetpassword/:id/:token
Host: http://localhost:3000
Content-Type: application/json

```

</br>
Response:
</br>

```json
{
  "message": "Password changed successfuly"
}
```

## Change Password route
[|^|](#content)

> POST `/changepassword`: This route allows a user to change their password after successfully logging in.
> </br>
> http://localhost:3000/api/refreshtoken
> </br>

Description:
This route is used to change your password. You should send old password and new password in request body.</br>
It will check if your old password is correct. If it is correct it will validate new password. If old password is correct and new password pass validation it will send an email to your address containg your id and JWT token. </br>
JWT token contains your new password.
If you click on the link in the email it will change your password.</br>

</br>

Request:
request body:

```json
{
  "email": "joe@hotmail.com",
  "oldpassword": "Nahir12345!",
  "newpassword": "Oahir12345!"
}
```

</br>
Response:
</br>

```json
{
  "message": "Email sent successfully, click on the link to verify your action."
}
```

## Remove User route
[|^|](#content)

> GET `/removeuser/:id/` This route allows an admin to remove a user from the database.
> </br>
> http://localhost:3000/api/removeuser/:id/
> </br>

Description:
This route is used to remove user from database. You should send user id in request body.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/removeuser/:id/
Host: http://localhost:3000
Content-Type: application/json

```

</br>
Response:
</br>

```json
{
  "message": "User deleted successfully"
}
```

## Get All Users route
[|^|](#content)

> GET `/getallusers` This route allows an admin to get all users from the database.
> </br>
> http://localhost:3000/api/getallusers
> </br>

Description:
This route is used to get all users from database.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/getallusers
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
[
  {
    "id": 1,
    "username": "mahe",
    "email": "mahir.cs@gmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$yggSRTjelNlsApuUCCdjNOLBXw3iYoVWz9J5DcQmHdgjaUzODf30y",
    "role": "user",
    "profileStatus": "active",
    "secret": null
  },
  {
    "id": 4,
    "username": "kemo",
    "email": "kemo@gmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$.sMvuQ0UnKLsg/1hmuHWPeCAL4q6ac6jY5na5EuK0hyYtfw34Mfl2",
    "role": "user",
    "profileStatus": "active",
    "secret": null
  },
  {
    "id": 9,
    "username": "Iah",
    "email": "iahir.cs@gmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$n68IKyOrePcTCwCvQEcAx.XT3pNUVCByXNGfB6fdhghYgbRnKKrom",
    "role": "user",
    "profileStatus": "active",
    "secret": {
      "hex": "5b3b614c3057557447553972333c442a352c7b72",
      "ascii": "[;aL0WUtGU9r3<D*5,{r",
      "base32": "LM5WCTBQK5KXIR2VHFZDGPCEFI2SY63S",
      "otpauth_url": "otpauth://totp/SecretKey?secret=LM5WCTBQK5KXIR2VHFZDGPCEFI2SY63S"
    }
  },
  {
    "id": 30,
    "username": "Make",
    "email": "joe@hotmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$lfHX1wkdmJV6.O.BZQ92sum8POOcViLNMYYLNsEPpqSgd2qR0Vnvq",
    "role": "user",
    "profileStatus": "active",
    "secret": {
      "hex": "3c4633294b4d556e3f773846382a256c2c29792c",
      "ascii": "<F3)KMUn?w8F8*%l,)y,",
      "base32": "HRDDGKKLJVKW4P3XHBDDQKRFNQWCS6JM",
      "otpauth_url": "otpauth://totp/SecretKey?secret=HRDDGKKLJVKW4P3XHBDDQKRFNQWCS6JM"
    }
  }
]
```

## Pagination route
[|^|](#content)

> GET `/pagination/:pageNumber/:limitNumber` This route allows an admin to get all users from the database.
> </br>
> http://localhost:3000/api/getallusers
> </br>

Description:
This route is used to get all users from database.</br>
You should send page number and limit number in request body.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/pagination/1/5
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
[
  {
    "id": 4,
    "username": "kemo",
    "email": "kemo@gmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$.sMvuQ0UnKLsg/1hmuHWPeCAL4q6ac6jY5na5EuK0hyYtfw34Mfl2",
    "role": "user",
    "profileStatus": "active",
    "secret": null
  },
  {
    "id": 9,
    "username": "Iah",
    "email": "iahir.cs@gmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$n68IKyOrePcTCwCvQEcAx.XT3pNUVCByXNGfB6fdhghYgbRnKKrom",
    "role": "user",
    "profileStatus": "active",
    "secret": {
      "hex": "5b3b614c3057557447553972333c442a352c7b72",
      "ascii": "[;aL0WUtGU9r3<D*5,{r",
      "base32": "LM5WCTBQK5KXIR2VHFZDGPCEFI2SY63S",
      "otpauth_url": "otpauth://totp/SecretKey?secret=LM5WCTBQK5KXIR2VHFZDGPCEFI2SY63S"
    }
  },
  {
    "id": 30,
    "username": "Make",
    "email": "joe@hotmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$lfHX1wkdmJV6.O.BZQ92sum8POOcViLNMYYLNsEPpqSgd2qR0Vnvq",
    "role": "user",
    "profileStatus": "active",
    "secret": {
      "hex": "3c4633294b4d556e3f773846382a256c2c29792c",
      "ascii": "<F3)KMUn?w8F8*%l,)y,",
      "base32": "HRDDGKKLJVKW4P3XHBDDQKRFNQWCS6JM",
      "otpauth_url": "otpauth://totp/SecretKey?secret=HRDDGKKLJVKW4P3XHBDDQKRFNQWCS6JM"
    }
  }
]
```

## Update email route
[|^|](#content)

> GET `/updateemail/:id` This route allows a user to update his email address.

> http://localhost:3000/api/updateemail/:id
> </br>

Description:
This route is used to update email address.</br>
You should send email address and password in request body. Your id should be in params.</br
It will check password if it is correct, then it will check if email address is already in use or not.</br>
If email address is not in use, it will send an email to your new email address with a link to verify your new email address.</br>
When you click on the link, your new email address will be changed and verified.</br>
You can not use your old email address anymore.</br>

</br>

Request:
request body:

```json
{
  "email": "joe@hotmail.com",
  "password": "Oahir12345!"
}
```

</br>
Response:
</br>

```json
{
  "message": "Email sent successfully, your new email address is joe@hotmail.com, you can not use your old email mustafa99284@outlook.com anymore!"
}
```

## Update Email URL route
[|^|](#content)

> GET `/updateemailurl/:id/:token` This route allows a user to update his email address by clicking on the link in the email.
> </br>
> http://localhost:3000/api//updateemailurl/:id/:token
> </br>

Description:
This route is used to update email address by clicking on the link in the email.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/updateemailurl/:id/:token
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{
  "message": "Email changed successfully, your new email is joe@hotmail.com"
}
```

## Verify Email route
[|^|](#content)

> GET `/verifyemail/:id"` This route allows a user to verify his email address by clicking on the link in the email.
> </br>
> http://localhost:3000/api/verifyemail/:id"
> </br>

Description:
This route is used to verify email address by clicking on the link in the email.</br>
You should send id in params, it will check if your email address is in database or not.</br>
If your email address is in database, it will check if your email address is verified or not.</br>
If your email address is not verified, it will send you a link on your email address to click on it.</br>
When you click on the link, your email address will be verified.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/verifyemail/:id
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{
  "message": "Email sent successfully"
}
```

## Verify Email URL route
[|^|](#content)

> GET `/verifyemailurl/:id/:token` This route allows a user to verify his email address by clicking on the link in the email.
> </br>
> http://localhost:3000/api/verifyemailurl/:id/:token
> </br>

Description:
This route is used to verify email address by clicking on the link in the email.</br>
This link will be sent by sending request to /verifyemail/:id route.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/verifyemailurl/:id/:token
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{ "message": "Email verified successfully" }
```

## Create Profile route
[|^|](#content)

> GET `/createprofile` This route allows a user to create his profile.
> </br>
> http://localhost:3000/api/getallusers
> </br>

Description:
This route is used to create profile.</br>
It will check if user exists in database or not.</br>
Then if the user has profile or not.</br>
If the user has profile, it will not allow you to create profile.</br>
It will create profile if user has no profile.</br>
Then, it will change hasProfile to true.</br>

</br>

Request:
request body:

```json
{
  "id": 37,
  "firstname": "Mahiraga",
  "lastname": "Mahiragic",
  "phonenumber": "123-456-7890",
  "country": "United States",
  "state": "California",
  "city": "Los Angeles",
  "address": "123 Main St",
  "zipcode": "90001"
}
```

</br>
Response:
</br>

```json
{ "message": "Profile created successfully",  {
        "id": 5,
        "firstname": "Mahiraga",
        "lastname": "Mahiragic",
        "phoneNumber": "123-456-7890",
        "country": "United States",
        "state": "California",
        "city": "Los Angeles",
        "address": "123 Main St",
        "zipCode": "90001",
        "profileId": 37
    }
}

```

## Update Profile route
[|^|](#content)

> GET `/updatepersonalinfo/:id` This route allows a user to update his personal info.

> http://localhost:3000/api/updatepersonalinfo/:id
> </br>

Description:
This route is used to update personal info.</br>
You can update firstname, lastname, phonenumber, country, state, city, address, zipcode.</br>
It will check if user exists in database or not.</br>
Then if the user has profile or not.</br>
If the user has no profile, it will not allow you to update personal info.</br>

</br>

Request:
request body:

```json
{
  "lastname": "Mulaosmanovic"
}
```

</br>
Response:
</br>

```json
{
  "message": "Personal information updated successfully",
  "user": {
    "id": 35,
    "username": "dedo",
    "email": "dedo.cs@hotmail.com",
    "emailVerified": false,
    "verificationToken": null,
    "password": "$2b$10$Y2dv.3R7Sa91vxoOa7czQuV6AsmbKmzAUzKydROxW5.dNwoLjtVLq",
    "role": "user",
    "profileStatus": "active",
    "hasProfile": false,
    "secret": {
      "hex": "6c71562367484d544e31383c414372754f77763b",
      "ascii": "lqV#gHMTN18<ACruOwv;",
      "base32": "NRYVMI3HJBGVITRRHA6ECQ3SOVHXO5R3",
      "otpauth_url": "otpauth://totp/SecretKey?secret=NRYVMI3HJBGVITRRHA6ECQ3SOVHXO5R3"
    }
  },
  "profile": {
    "id": 5,
    "firstname": "Mahiraga",
    "lastname": "Mulaosmanovic",
    "phoneNumber": "123-456-7890",
    "country": "United States",
    "state": "California",
    "city": "Los Angeles",
    "address": "123 Main St",
    "zipCode": "90001",
    "profileId": 35
  }
}
```

## Disable Account route
[|^|](#content)

> GET `/disableaccount` This route allows a user to disable his account.
> </br>
> http://localhost:3000/api/disableaccount
> </br>

Description:
This route is used to disable account.</br>
You need to send username and password in request body.</br>

</br>

Request:
request body:

```json
{
  "username": "fuke",
  "password": "Mahir12345!"
}
```

</br>
Response:
</br>

```json
{
  "message": "Account disabled successfully"
}
```

## Delete Account route
[|^|](#content)

> GET `/deleteaccount` This route allows a user to delete his account, his profile.
> </br>
> http://localhost:3000/api/deleteaccount
> </br>

Description:
This route is used to delete account.</br>
You need to send username and password in request body.</br>

</br>

Request:
request body:

```json
{
  "username": "fuke",
  "password": "Mahir12345!"
}
```

</br>
Response:
</br>

```json
{
  "message": "Account deleted successfully",
  "deleteProfile": {
    "id": 8,
    "firstname": "Mahiraga",
    "lastname": "Mahiragic",
    "phoneNumber": "123-456-7890",
    "country": "United States",
    "state": "California",
    "city": "Los Angeles",
    "address": "123 Main St",
    "zipCode": "90001",
    "profileId": 37
  }
}
```

## Get Profile route
[|^|](#content)

> GET `/getallprofiles` This route allows a user to get all profiles.
> </br>
> http://localhost:3000/api/getallprofiles
> </br>

Description:
This route is used to get all profiles.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/getallprofiles
Host: http://localhost:3000
Content-Type: application/json

```

</br>
Response:
</br>

```json
[
  {
    "id": 1,
    "firstname": "John",
    "lastname": "Bimbo",
    "phoneNumber": "123-456-7890",
    "country": "United States",
    "state": "California",
    "city": "Los Angeles",
    "address": "123 Main St",
    "zipCode": "90001",
    "profileId": 9
  },
  {
    "id": 2,
    "firstname": "Mustafa",
    "lastname": "Mustafic",
    "phoneNumber": "123-456-7890",
    "country": "United States",
    "state": "California",
    "city": "Los Angeles",
    "address": "123 Main St",
    "zipCode": "90001",
    "profileId": 30
  }
]
```

## Download User Data route
[|^|](#content)

> GET `/downloaduserdata/:id` This route allows a user to download his data.
> </br>
> http://localhost:3000/api/downloaduserdata/34
> </br>

Description:
This route is used to download user data.</br>
You need to send user id in request params.</br>
It sill send you PDF file with user and profile data.</br>

</br>

Request:
request body:

```json
GET http://localhost:3000/api/downloaduserdata/:id
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
PDF
user-data.pdf
```

## Create Profile Picture route
[|^|](#content)

> GET `/createprofilepicture/:id` This route allows a user to create profile picture.
> </br>
> http://localhost:3000/api/createprofilepicture/:id
> </br>

Description:
This route is used to create profile picture.</br>
You need to send user id in request params and in body, form-data, KEY = profilPicture, VALUE = image.</br>
If you have error in Node, that usually means that bucket in minIO is not created.</br>
You need to create bucket in minIO with name of your user id.</br>

</br>

Request:
request body:

```json
POST http://localhost:3000/api/createprofilepicture/:id
Host: http://localhost:3000
Content-Type: application/json

```

</br>
Response:
</br>

```json
{
  "message": "Successfully uploaded image to testbucket/image.jpg with ETag [object Object]"
}
```

## Update Profile Picture route
[|^|](#content)

> GET `/updateprofilepicture/:id` This route allows a user to update profile picture.
> </br>
> http://localhost:3000/api/updateprofilepicture/:id
> </br>

Description:
This route is used to update profile picture.</br>
You need to send user id in request params and in body, form-data, KEY = profilPicture, VALUE = image.</br>

</br>

Request:
request body:

```json
POST http://localhost:3000/api/updateprofilepicutre/:id
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{
  "message": "Successfully updated image to testbucket/image.jpg with ETag [object Object]"
}
```

## Remove Profile Picture route
[|^|](#content)

> GET `/removeprofilepicture/:id` This route allows a user to remove profile picture.
> </br>
> http://localhost:3000/api/removeprofilepicture/:id
> </br>

Description:
This route is used to remove profile picture.</br>
You need to send user id in request params.</br>

</br>

Request:
request body:

```json
POST http://localhost:3000/api/removeprofilepicture/:id
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{
  "message": "Successfully removed image from testbucket/image.jpg"
}
```

## TOTP verification test route
[|^|](#content)

> GET `/verifyusertwofactor/:id/:token` This route allows a user to test TOTP verification.
> </br>
> http://localhost:3000/api/verifyusertwofactor/:id/:token
> </br>

Description:
Goal of this route is to test verification function, how to verify with two factor authentication.</br>
You should send your id and token in params.</br>
Token should be generated with Authenticator app.</br>
Use ID from user (using getallusers route) and base32 from secret field.</br>
 

</br>

Request:
request body:

```json
GET http://localhost:3000/api//verifyusertwofactor/:id/:token
Host: http://localhost:3000
Content-Type: application/json
```

</br>
Response:
</br>

```json
{
    "message": "Token is valid"
}

```
## Change role route
[|^|](#content)

> GET `/changerole` This route allows a user to change role.
> </br>
> http://localhost:3000/api/changerole
> </br>

Description:
For this route to work you need to send email of user you want to change role and new role in request body.</br>
In headers you need to send token of user that is admin.</br>
This token can be acquired by logging in with admin account.</br>
This route is using auth-middleware, so you need to send token in headers. This can be found in middleware folder.</br>

</br>

Request:
Headers:
access-token: token of admin user
refresh-token: token of admin user
request body:

```json
{
    "role":"admin",
    "email":"dedo.cs@hotmail.com"
}
```

</br>
Response:
</br>

```json
{
    "message": "Role changed successfully"
}
```

## Protected route
[|^|](#content)

> GET `/dashboard/:id` This route is an example of protected route.
> </br>
> http://localhost:3000/api//dashboard/:id
> </br>

Description:
This route is an example of protected route.</br>
First login as user using autheticator app to get token. This will give you access token and refresh token.</br>
Then you send request and you will get new refresh token.</br>
You send an id in params.
This route is using auth-middleware, so you need to send token in headers. This can be found in middleware folder.</br>

</br>

Request:
Headers:
access-token: token of user, login as user to get token
refresh-token: token of user
request body:

```json

GET http://localhost:3000/api/dashboard/:id
Host: http://localhost:3000
Content-Type: application/json

```

</br>
Response:
</br>

```json
{
    "message": "New access-token generated",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haGlyLmNzQGhvdG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjczMzM3MDQ3LCJleHAiOjE2NzMzMzcwNzd9.KNxjg1JNVPiGkc3-V_0_AVXJtFGRDu_3sQnqz8NWA0o"
}
```

### Email Update Routes:
[|^|](#content)

> POST `/updateemail/:id:` This route allows a user to update their email address after successfully logging in.

> GET `/updateemailurl/:id/:token:` This route allows a user to access the email update page using a unique user ID and token that were sent to their current email address.

> POST `/verifyemail/:id:` This route allows a user to verify their new email address by sending a verification email to the new address.

> GET `/verifyemailurl/:id/:token:` This route allows a user to verify their new email address by clicking on a unique verification link sent to their new email address.

> GET `/verifyusertwofactor/:userId/:token:` This route allows a user to verify their two-factor authentication using a unique user ID and token that were sent to their email address.

### Personal Information Update Routes:

> POST `/updateprofilepicture/:id:` This route allows a user to update their profile picture after successfully logging in.

> POST `/createprofilepicture/:id:` This route allows a user to create a profile picture after successfully logging in.

> POST `/removeprofilepicture/:id:` This route allows a user to remove their profile picture after successfully logging in.

> POST `/createprofile` This route allows a user to create a profile after successfully logging in.

> POST `/updatepersonalinfo/:id:` This route allows a user to update their personal information after successfully logging in.

### Account Management Routes:

> POST `/disableaccount:` This route allows a user to disable their account after successfully logging in.

> POST `/deleteaccount:` This route allows a user to delete their account after successfully logging in.

> GET `/downloaduserdata/:id:` This route allows a user to download all of their user data after successfully logging in.

### Admin Routes:

> POST `/changerole:` This route allows an admin to change the role of another user.

> GET `/getallusers:` This route allows an admin to retrieve a list of all users.

> GET `/getallprofiles`: This route allows an admin to retrieve a list of all profiles.
