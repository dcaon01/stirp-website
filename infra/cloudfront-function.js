// CloudFront Function (viewer-request) for the Sephiro static site.
// Rewrites clean URLs to the prerendered index.html files:
//   /            -> /index.html
//   /privacy     -> /privacy/index.html
//   /it/privacy  -> /it/privacy/index.html
// Real asset requests (containing a ".") pass through unchanged.
// The apex -> www redirect is handled by Aruba domain forwarding, not here.
function handler(event) {
  var req = event.request;
  var uri = req.uri;
  if (uri.endsWith('/')) {
    req.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    req.uri = uri + '/index.html';
  }
  return req;
}
