## Temporary S3 Credentials

The Cumulus API can provide temporary credentials that provide read-only, same-region, direct access to S3 objects.


For Cumulus deployments in NGAP[^ngap] , the `/s3credentials` endpoint can be configured to request temporary credentials from the NGAP lambda function: `gsfc-ngap-sh-s3-sts-get-keys`.  Additionally, these deployments may be configured to limit the scope of the dispensed credentials only to bucket/keypaths that match the user's [CMR](https://cmr.earthdata.nasa.gov/search)[^cmr] ACL[^acl] permissions.  Check with your Cumulus deployer to discover what types of credentials are dispensed by this endpoint.

GET requests with a valid cookie to the endpoint return a credentials object that can be used to make direct S3 requests.  The easiest way to get a set of credentials is to visit the endpoint in a browser to handle authentication and redirects.  If you wish to use temporary credentals in AWS, you can find examples on the `/s3credentialsREADME` endpoint in both javascript and python.

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

## Command line credentials request

### AccessToken

In order to script the request for credentials, you can provide an `accessToken` cookie in your curl request. This is how the distribution api determines if you are authenticated with Earthdata Login.  If no cookie is provided, the authentication workflow is begun.  Here is a sample script to get credentials from the command line.

##### Sample script to receive credentials.

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


```python
import argparse
import base64
import boto3
import json
import requests

def retrieve_credentials(event):
    """Makes the Oauth calls to authenticate with EDS and return a set of s3
    same-region, read-only credntials.
    """
    login_resp = requests.get(
        event['s3_endpoint'], allow_redirects=False
    )
    login_resp.raise_for_status()

    auth = f"{event['edl_username']}:{event['edl_password']}"
    encoded_auth  = base64.b64encode(auth.encode('ascii'))

    auth_redirect = requests.post(
        login_resp.headers['location'],
        data = {"credentials": encoded_auth},
        headers= { "Origin": event['s3_endpoint'] },
        allow_redirects=False
    )
    auth_redirect.raise_for_status()

    final = requests.get(auth_redirect.headers['location'], allow_redirects=False)

    results = requests.get(event['s3_endpoint'], cookies={'accessToken': final.cookies['accessToken']})
    results.raise_for_status()

    return json.loads(results.content)



def lambda_handler(event, context):
    """Sample lambda handler to show how to use in AWS environment"""

    creds = retrieve_credentials(event)
    bucket = event['bucket_name']

    # create client with temporary credentials
    client = boto3.client(
        's3',
        aws_access_key_id=creds["accessKeyId"],
        aws_secret_access_key=creds["secretAccessKey"],
        aws_session_token=creds["sessionToken"]
    )
    # use the client for readonly access.
    response = client.list_objects_v2(Bucket=bucket, Prefix="")

    return {
        'statusCode': 200,
        'body': json.dumps([r["Key"] for r in response['Contents']])
    }

```

```javascript
const { S3 } = require('aws-sdk');
const { promisify } = require('util');
const { Cookie, CookieJar } = require('tough-cookie');
const base64 = require('base-64');
const got = require('got');

/**
 * Makes the Oauth calls to authenticate with EDL and returns a set of s3
 * same-region, read-only credentials
 *
 * @param {Object} authInfo
 * @param {string} authInfo.edlUsername - Earthdata Login username
 * @param {string} authInfo.edlPassword - Earthdata Login password
 * @param {string} authInfo.s3Endpoint - s3credentials endpoint url
 *
 * @returns {Object} ngap's AWS sts credentials object
 */
async function retrieveCredentials(authInfo) {
  const cookieJar = new CookieJar();
  const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));

  // Call to the s3credentials endpoint
  const response = await got.get(authInfo.s3Endpoint, {
    followRedirect: false,
  });

  // grant access via Post to EDL with your base64 encoded credentials
  const authRedirect = await got.post(response.headers.location, {
    form: { credentials: base64.encode(`${authInfo.edlUsername}:${authInfo.edlPassword}`) },
    headers: { Origin: authInfo.s3Endpoint },
    followRedirect: false,
  });

  // follow redirect with code to get access token
  const withAccessToken = await got.get(authRedirect.headers.location, {
    followRedirect: false,
  });

  // set accessToken into cookie jar.
  const cookies = withAccessToken.headers['set-cookie'].map(Cookie.parse);
  await Promise.all([cookies.map((c) => setCookie(c, authInfo.s3Endpoint))]);

  // authorized call to the s3credential endpoint
  const results = await got(authInfo.s3Endpoint, {
    cookieJar,
    responseType: 'json',
  });
  return results.body;
}

/**
 * Sample routine to show how sts credentials can be used
 *
 * @param {Object} credentials - sts credential object returned from s3credential endpoint
 * @param {any} bucketName - Name of bucket to list objects from.
 * @returns {Array<string>} - List of Keys in bucket.
 */
async function listObjects(credentials, bucketName) {
  // Create the S3 service using your temporary credentials.
  const s3 = new S3({ credentials });

  // Get a list of object Keys from the bucket
  try {
    const returnValue = await s3.listObjectsV2({ Bucket: bucketName, Prefix: '' }).promise();
    return returnValue.Contents.map((obj) => obj.Key);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function handler(event) {
  const authInfo = {
    s3Endpoint: process.env.S3_CREDENTIAL_ENDPOINT,
    edlUsername: process.env.EARTHDATA_USERNAME,
    edlPassword: process.env.EARTHDATA_PASSWORD,
    ...event,
  };
  const { bucketName } = { bucketName: 'pass-bucket-name-in-event', ...event };

  let credentials;
  try {
    credentials = await retrieveCredentials(authInfo);
  } catch (error) {
    console.error(error);
    throw error;
  }

  const foundKeys = await listObjects(credentials, bucketName);
  return foundKeys;
}

exports.handler = handler;


```

### Bearer token

You can provide an EDL (Earthdata Login) bearer token in your curl request, and the distribution API determines if you are authenticated with Earthdata Login.  If no bearer token is provided, the authentication workflow is begun.

#### Example Request

```curl
$ curl https://example.com/s3credentials --header 'Authorization: Bearer ReplaceWithTheEDLToken'
```

## Non-NGAP deployments

For non-NGAP deployments that wish to provide temporary credentials, you must provide the name of a lambda available to your stack either by overriding the default `sts_credentials_lambda` in your Cumulus deployment configuration or by setting the environment variable STSCredentialsLambda on your API.  Your lambda function must take an payload object as described below and return [AWS.Credentials](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Credentials.html) appropriate to your use case probably via the [AWS Security Token Service](https://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html).

#### sample `sts_credentials_lambda` payload:
```json
{
 accesstype: 'sameregion',
 duration: '3600', // one hour max allowed by AWS.
 rolesession: username,
 userid: username
}
```

[^ngap]: NASA-compliant General Application Platform
[^cmr]: Common Metadata Repository
[^acl]: Access Control List
