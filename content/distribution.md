## Distribution

File downloads through the Cumulus Distribution API are available to the authenticated users via the configured OAuth provider.  Links to these protected files can be found in the metadata from the Common Metadata Repository (CMR).  Protected URLs look like: https://cumulus-distribution-api/path/to/science-file.hdf. For any request of protected files, the distribution API ensures the user is authenticated with the OAuth provider then redirects the user to a signed S3 url that will download the requested science file.


```endpoint
GET /some-protected-bucket/some-key
```

## HEAD
```endpoint
HEAD /path/to/science-file.hdf
```

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

