## Distribution

File downloads through the Cumulus Distribution API are available to the authenticated users via the configured OAuth provider.  Links to these protected files can be found in the metadata from the Common Metadata Repository (CMR).  Protected URLs look like: https://cumulus-distribution-api/path/to/science-file.hdf. For any request of protected files, the distribution API ensures the user is authenticated with the OAuth provider then redirects the user to a signed S3 url that will download the requested science file.


```endpoint
GET /some-protected-bucket/some-key
```