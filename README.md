[![](https://img.shields.io/npm/v/@whi/magicauth-sdk/latest?style=flat-square)](http://npmjs.com/package/@whi/magicauth-sdk)

# MagicAuth SDK
The Javascript standard development kit for MagicAuth services.

![](https://img.shields.io/github/issues-raw/mjbrisebois/magicauth-sdk?style=flat-square)
![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/magicauth-sdk?style=flat-square)
![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/magicauth-sdk?style=flat-square)

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

```javascript
let credential = await magicauth.user( password );

// Example response
{
    "id": "Auth_U1-ZYkmQi66wrerQ7UgkorBwquhQF0G9EAFzz8="
}
```

### Sign In

```javascript
let session = await magicauth.session( credential.id, password, ip_address, user_agent );

// Example response
{
    "id": "5Vx5aVjL8twCcuhnzOfo4bmGTpb-l8UexFXE305ITdQ="
}
```

### Session validation

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
