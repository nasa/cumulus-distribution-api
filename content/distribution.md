## Distribution

File downloads through the Cumulus Distribution API are available to the authenticated users via the configured OAuth provider.  Links to these protected files can be found in the metadata from the Common Metadata Repository (CMR).  Protected URLs look like: https://cumulus-distribution-api/path/to/science-file.hdf. For any request of protected files, the distribution API ensures the user is authenticated with the OAuth provider then redirects the user to a signed S3 url that will download the requested science file.


## HEAD
The Cumulus API wraps the S3 HeadObject method

```endpoint
HEAD /path/to/science-file.hdf
```

#### Example Request
```curl
curl --location --head 'https://example.com/path/to/science-file.hdf' \
--header 'Range: bytes=0-1023' \
--header 'Cookie: accessToken=<access-token>'
```

```python
import requests

url = "https://example.com/path/to/science-file.hdf"

payload={}
headers = {
  'Cookie': 'accessToken=<access-token>', 
  'Range': 'bytes=0-1023'
}

response = requests.request("HEAD", url, headers=headers, data=payload)

print(response.text)

```

```javascript
var request = require('request');
var options = {
  'method': 'HEAD',
  'url': 'https://example.com/path/to/science-file.hdf',
  'headers': {
    'Cookie': 'accessToken=<access-token>', 
    'Range': 'bytes=0-1023'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("https://example.com/path/to/science-file.hdf")
  .method("HEAD", null)
  .addHeader("Cookie", "accessToken=<access-token>")
  .build();
Response response = client.newCall(request).execute();

```
#### Example Response
```http
HTTP/1.1 200 OK
x-amz-id-2: uLwBLVcaGUv5mDgTQLJTSXrjqxNveiVJN5DRR2oHMIHLS6cLHT8q47UQeX2Y370KK+R7kafhmzE=
x-amz-request-id: 6QVAWF6HMTJ11FCK
Date: Wed, 16 Jun 2021 23:06:20 GMT
Last-Modified: Thu, 10 Jun 2021 18:23:19 GMT
ETag: "8d1ec5c0463e59d26adee87cdbbee816"
Accept-Ranges: bytes
Content-Type: binary/octet-stream
Server: AmazonS3
Content-Length: 1098034
```

#### Example Response Body
```http
No Response Body Returned
```

### Supported Headers
Name | Value | Passed to HeadObject | Example Usage
---|---|---|---
`Cookie` | (optional) bytes=(min byte)-(max byte) | `false` | `curl --location --head 'https://example.com/path/to/science-file.hdf' --header 'Cookie: accessToken=<access-token>'`
`Range` | (optional) bytes=(min byte)-(max byte) | `true` | `curl --location --head 'https://example.com/path/to/science-file.hdf' --header 'Range: bytes=0-1023'`

<!-- The full list of supported headers can be found [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html) -->

## GET
The Cumulus API wraps the S3 GetObject method

```endpoint
GET /path/to/science-file.hdf
```

#### Example Request
```curl
curl --location --request GET 'https://example.com/path/to/science-file.hdf' \
--header 'Cookie: accessToken=<access-token'
```

```python
import requests

url = "https://example.com/path/to/science-file.hdf"

payload={}
headers = {
  'Cookie': 'accessToken=<access-token>', 
  'Range': 'bytes=0-1023'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

```

```javascript
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://example.com/path/to/science-file.hdf',
  'headers': {
    'Cookie': 'accessToken=<access-token>', 
    'Range': 'bytes=0-1023'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

```

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("https://example.com/path/to/science-file.hdf")
  .method("GET", null)
  .addHeader("Cookie", "accessToken=<access-token>")
  .build();
Response response = client.newCall(request).execute();

```
#### Example Response
```http
HTTP/1.1 200 OK
x-amz-id-2: uLwBLVcaGUv5mDgTQLJTSXrjqxNveiVJN5DRR2oHMIHLS6cLHT8q47UQeX2Y370KK+R7kafhmzE=
x-amz-request-id: 6QVAWF6HMTJ11FCK
Date: Wed, 16 Jun 2021 23:06:20 GMT
Last-Modified: Thu, 10 Jun 2021 18:23:19 GMT
ETag: "8d1ec5c0463e59d26adee87cdbbee816"
Accept-Ranges: bytes
Content-Type: binary/octet-stream
Server: AmazonS3
Content-Length: 1098034
```
#### Example Response Body
```http
<binary>
```

### Supported Headers
Name | Value | Passed to HeadObject | Example Usage
---|---|---|---
`Cookie` | (optional) bytes=(min byte)-(max byte) | `false` | `curl --request GET 'https://example.com/path/to/science-file.hdf' --header 'Cookie: accessToken=<access-token>'`
`Range` | (optional) bytes=(min byte)-(max byte) | `true` | `curl --request GET 'https://example.com/path/to/science-file.hdf' --header 'Range: bytes=0-1023'`