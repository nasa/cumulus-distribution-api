## Distribution

File downloads through the Cumulus Distribution API are available to authenticated Earthdata Login users.  Cumulus normally provides this access via links in metadata from Common Metadata Repository (CMR).  Protected URLs look like: https://cumulus-distribution-api/path/to/science-file.hdf. The Distribution API ensures the user is authenticated with Earthdata Login then redirects the user to a signed s3 url that will download the requested science file.


```endpoint
GET /path/to/cumulus/protected/file
```
