## Temporary S3 Credentials

The Cumulus API can provide temporary credentials that provide read-only, same-region, direct access to s3 objects.


For NGAP (NASA-compliant General Application Platform) deployments, the `s3credentials` endpoint is configured to request temporary credentials from an NGAP lambda function `gsfc-ngap-sh-s3-sts-get-keys`.


GET requests with a valid cookie to the endpoint return a credentials object that can be used to make direct s3 requests.  The easiest way to get a set of credentials is to visit the endpoint in a browser to handle the authorization and redirects.

```endpoint
GET /s3credentials
```

#### Example Request
```http
https://example.com/s3credentials
```

#### Example Response
```json
{
  "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
  "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "sessionToken": "LONGSTRINGOFCHARACTERSnBeoImkYlERDDHhmwZivcKPd63LUp1uhuZ9bhhIHUjvt++hgRSk9HIMZDEHH9crnukckEZ+FGYrSiwndzjBQ==",
  "expiration": "2019-02-27 23:26:56+00:00"
}
```

### Command line credentials request

In order to script the request for credentials you must provide an `accessToken` cookie in your curl request. This is how the distribution api determines if you are authenticated with Earthdata Login.  If no cookie is provided the authentication workflow is begun.  Here is a sample script to get credentials from the command line.

#### Sample script to recieve credentials.

```curl
#! /bin/sh

COOKIEJAR=cookie.txt
rm -f $COOKIEJAR

ORIGIN=$(dirname $CUMULUS_DISTRIBUTION_URL)
CREDENTIALS_URL="$CUMULUS_DISTRIBUTION_URL/s3credentials"

# create a base64 hash of your login credentials
AUTH=$(printf "$EARTHDATA_USERNAME:$EARTHDATA_PASSWORD" | base64)

# Request the Earthdata url with client id and redirect uri to use with Cumulus
AUTHORIZE_URL=$(curl -s -i ${CREDENTIALS_URL} | grep location | sed -e "s/^location: //");

# Request an authorization grant code
REDIRECT_URL=$(curl -s -i -X POST \
  -F "credentials=${AUTH}" \
  -H "Origin: ${ORIGIN}" \
  ${AUTHORIZE_URL%$'\r'} | grep Location | sed -e "s/^Location: //")

# Set the correct cookie via the redirect endpoint with grant code.
curl -i -c ${COOKIEJAR} -s ${REDIRECT_URL%$'\r'} | grep location | sed -e "s/^location: //"

# Call the s3credentials endpoint with correct cookies
CREDS=$(curl -i -b ${COOKIEJAR} -s $CREDENTIALS_URL)

echo $CREDS
```

### Non-NGAP deployments

For non-NGAP deployments that wish to provide temporary credentials, you must provide the name of a lambda available to your stack either by overriding the default `sts_credentials_lambda` or by setting the environment variable STSCredentialsLambda on your API.  Your lambda function must take an payload object as described below and return [AWS.Credentials](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html) appropriate to your use case probably via the [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html).

#### sample `sts_credentials_lambda` payload:
```json
{
 accesstype: 'sameregion',
 duration: '3600', // one hour max allowed by AWS.
 rolesession: username,
 userid: username
}
```
