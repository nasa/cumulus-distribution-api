## Root

Displays a basic welcome page with login or logout link.

```endpoint
GET /
```

## Login

Validates code against OAuth provider's API, adds an entry to the access tokens table, and redirects to the URI as specified by `state` parameter or `/` endpoint.  It is used as a redirect_uri to pass into OAuth provider's authentication service API.

```endpoint
GET /login
```

### Query Parameters

| query string parameter | description |
| -----  | ----------- |
| `code={string}`  | The authentication code from OAuth provider |
| `state={string}` | The URI to redirect to after if authentication was successful |


#### Example request

```curl
$ GET https://example.com/login?code=somecode&state=somestate
```

## Logout

Logs out the API, and removes the access token from the access tokens table.

```endpoint
GET /logout
```

#### Example request

```curl
$ GET https://example.com/logout
```