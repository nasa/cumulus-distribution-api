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

### Supported Headers
Name | Value | Passed to HeadObject | Example Usage
---|---|---|---
`Cookie` | (optional) bytes=(min byte)-(max byte) | `false` | `curl --location --head 'https://example.com/path/to/science-file.hdf' --header --header 'Cookie: accessToken=<access-token>'`
`Range` | (optional) bytes=(min byte)-(max byte) | `true` | `curl --location --head 'https://example.com/path/to/science-file.hdf' --header 'Cookie: accessToken=<access-token>' --header 'Range: bytes=0-1023'`

<!-- The full list of supported headers can be found [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html) -->