#!/bin/bash

# Default values
REPO="aiverify-foundation/moonshot-ui"
OUTPUT_FILE=".codeql-alerts.json"

# Set GH CLI auth token
export GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN}}"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
      -r|--repo) REPO="$2"; shift ;;
      -o|--output) OUTPUT_FILE="$2"; shift ;;
      -h|--help)
          echo "Usage: $0 [-r|--repo <repository>] [-o|--output <output_file>]"
          return 0
          ;;
      *) echo "Unknown parameter passed: $1"; return 1 ;;
  esac
  shift
done

OUTPUT_MESSAGES=""

# Check if gh command is available
if ! command -v gh &> /dev/null
then
  OUTPUT_MESSAGES+="gh command could not be found. Please install GitHub CLI.\n"
  return 1
fi

# Fetch CodeQL alerts
gh api -X GET "repos/$REPO/code-scanning/alerts" > "$OUTPUT_FILE"
if [ $? -ne 0 ]; then
  OUTPUT_MESSAGES+="Failed to fetch CodeQL alerts.\n"
  return 1
fi

# Filter only open alerts
open_alerts=$(jq '[.[] | select(.state == "open")]' "$OUTPUT_FILE")
open_alerts_count=$(echo "$open_alerts" | jq 'length')
OUTPUT_MESSAGES+="Open CodeQL alerts: $open_alerts_count\n"

# Display alerts by severity if there are any open alerts
if [ "$open_alerts_count" -gt 0 ]; then
  OUTPUT_MESSAGES+="Open alerts by severity:\n"
  OUTPUT_MESSAGES+="$(echo "$open_alerts" | jq -r '.[] | .rule.severity' | sort | uniq -c)\n"
  rm "$OUTPUT_FILE"
  echo "There are CodeQL alerts, please check Security>Code Scanning tab in the repository for more details."
  export CODEQL_SUMMARY="$OUTPUT_MESSAGES"
  return 2
else
  rm "$OUTPUT_FILE"
  echo -e "$OUTPUT_MESSAGES"
  export CODEQL_SUMMARY="$OUTPUT_MESSAGES"
  return 0
fi
