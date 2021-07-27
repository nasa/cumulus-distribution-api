## Bucket Map

The Cumulus Distribution API supports bucket map, and you can get bucket map paths for a given bucket.

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
["bucketpath1", "bucketpath2"]
```
