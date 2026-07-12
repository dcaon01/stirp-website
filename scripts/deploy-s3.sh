#!/usr/bin/env bash
# Deploy the prerendered site (dist/client) to S3 + invalidate CloudFront.
#
# Reads config from the repo-root .env (gitignored):
#   AWS_PROFILE                 AWS CLI profile (e.g. damiano-sephiro)
#   S3_BUCKET                   target bucket (e.g. sephiro-website)
#   AWS_REGION                  bucket region (e.g. eu-west-1)
#   CLOUDFRONT_DISTRIBUTION_ID  distribution to invalidate (optional)
#
# Cache strategy:
#   assets/**  → immutable, 1 year   (filenames are content-hashed)
#   everything else (*.html, *.json, robots.txt, sitemap.xml, images)
#              → no-cache             (must revalidate every request)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist/client"

# Load .env if present.
if [ -f "$ROOT_DIR/.env" ]; then
  set -a; . "$ROOT_DIR/.env"; set +a
fi

S3_BUCKET="${S3_BUCKET:-sephiro-website}"
AWS_REGION="${AWS_REGION:-eu-west-1}"

command -v aws >/dev/null 2>&1 || { echo "ERROR: aws CLI not found in PATH." >&2; exit 1; }
[ -d "$DIST_DIR" ] || { echo "ERROR: $DIST_DIR not found — run 'npm run build' first." >&2; exit 1; }

echo "→ Deploying $DIST_DIR to s3://$S3_BUCKET ($AWS_REGION)"

# Pass 1 — hashed assets: long-lived immutable cache, prune orphans.
aws s3 sync "$DIST_DIR/assets/" "s3://${S3_BUCKET}/assets/" \
  --region "$AWS_REGION" \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Pass 2 — everything else (html/json/txt/xml/images): always revalidate.
aws s3 sync "$DIST_DIR/" "s3://${S3_BUCKET}/" \
  --region "$AWS_REGION" \
  --delete \
  --exclude "assets/*" \
  --cache-control "no-cache, must-revalidate"

if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "→ Invalidating CloudFront $CLOUDFRONT_DISTRIBUTION_ID"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query "Invalidation.{Id:Id,Status:Status}" --output table
else
  echo "! CLOUDFRONT_DISTRIBUTION_ID not set — skipping invalidation."
fi

echo "✓ Deploy complete."
