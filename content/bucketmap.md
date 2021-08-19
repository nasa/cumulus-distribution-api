## Bucket Map

The Cumulus Distribution API supports an S3 bucket map. The `/locate` endpoint fetches bucket map paths for a given bucket.
Information about S3 bucket map is available [here](https://nasa.github.io/cumulus/docs/deployment/cumulus_distribution#s3-bucket-mapping)


```
GET /locate
```
### Query Parameters

| query string parameter | description |
| -----  | ----------- |
| `bucket_name={string}`  | The s3 bucket name |

#### Example Request
```curl
$ curl https://example.com/locate?bucket_name={bucket}
```

#### Example Response
```json
["/path1/to/bucket", "/path2/to/bucket"]
```
