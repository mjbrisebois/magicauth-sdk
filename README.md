[![](https://img.shields.io/npm/v/@whi/magicauth-sdk/latest?style=flat-square)](http://npmjs.com/package/@whi/magicauth-sdk)

# MagicAuth SDK
The Javascript standard development kit for MagicAuth services.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/magicauth-sdk?style=flat-square)](https://github.com/mjbrisebois/magicauth-sdk/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/magicauth-sdk?style=flat-square)](https://github.com/mjbrisebois/magicauth-sdk/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/magicauth-sdk?style=flat-square)](https://github.com/mjbrisebois/magicauth-sdk/pulls)

## Usage

### Install

```bash
npm install magicauth-sdk
```

### Init

```javascript
const { Collection } = require('@whi/magicauth-sdk');

// Connect to a collection
const magicauth = new Collection( collection_id, access_key );

// Client credentials
const email = "testing@example.com";
const password = "Passw0rd!";

// Client context
const ip_address = "95.107.167.200";
const user_agent = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36";
```

### Sign Up

- Initialized with `email/password`
- Callback for `users.insert( email, Authentica.U1 )`.

```javascript
let credential = await magicauth.user( password );

// Example response
{
    "id": "Auth_U1-ZYkmQi66wrerQ7UgkorBwquhQF0G9EAFzz8="
}
```

### Sign In

- Initialized with `email/password`
- Callback for `users.select( email ) -> Authentica.U1`.
  - if 0 results, return invalid
- Callback for `sessions.insert( session_id, user.id, ...context )`.

```javascript
let session = await magicauth.session( credential.id, password, ip_address, user_agent );

// Example response
{
    "id": "5Vx5aVjL8twCcuhnzOfo4bmGTpb-l8UexFXE305ITdQ="
}
```

### Session validation

- Initialized by cookie `session ID`
- Callback for `sessions.select( session_id, ...context ) -> user.id`.
  - if expired, delete cookie
  - if 0 results, check origin
    - if exists, update local and restart this process
    - else, delete cookie

```javascript
let session = await magicauth.validate( session.id, ip_address, user_agent );

// Example response
{
    "id": "5Vx5aVjL8twCcuhnzOfo4bmGTpb-l8UexFXE305ITdQ=",
    "credential": {
        "id": "Auth_U1-ZYkmQi66wrerQ7UgkorBwquhQF0G9EAFzz8="
    }
}
```

### Sign Out

- Initialized with cookie `session ID`
- Callback for `sessions.archive( session_id, ...context )`.
  - delete cookie
