## HEAD

The Cumulus API wraps the S3 HeadObject method

```endpoint
HEAD /path/to/science-file.hdf
```

#### Example Request
```http
https://example.com/path/to/science-file.hdf
```

#### Example Response
```curl
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

### Options:
Headers sent with the request will be passed to the HEAD S3 request
| Header | Value | Example Request |
| ------ | ----- | --------------- |
| Range  | bytes=(min byte)-(max byte) | ```curl --location --head 'https://example.com/path/to/science-file.hdf' --header 'Range: bytes=0-1023' --header 'Cookie: accessToken=<access-token>'``` |

The full list of supported headers can be found [here](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadObject.html)
diff --git a/content/distribution.md b/content/distribution.md
