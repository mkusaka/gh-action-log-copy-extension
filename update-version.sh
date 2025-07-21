#!/bin/bash

# Update version in all files
# Usage: ./update-version.sh <version>

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 0.2.0"
  exit 1
fi

VERSION=$1

# Update manifest.json
sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/" manifest.json

# Update package.json
sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/" package.json

echo "Updated version to $VERSION in:"
echo "  - manifest.json"
echo "  - package.json"
echo ""
echo "Next steps:"
echo "  1. git add -A"
echo "  2. git commit -m \"chore: bump version to v$VERSION\""
echo "  3. git push"
echo "  4. git tag v$VERSION"
echo "  5. git push origin v$VERSION"