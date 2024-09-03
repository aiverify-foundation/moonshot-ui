#!/bin/bash

# Function to calculate code coverage
codeCoverage() {
  local covSummary=$(cat ./coverage/coverage-summary.json)
  local covPct=$(echo $covSummary | jq '.total.statements.pct')
  local covPctRounded=$(printf "%.0f" "$covPct")
  local message="Coverage percentage: ${covPctRounded}%"
  echo $message
  export COVERAGE_SUMMARY="$message"
  if (( covPctRounded < 50 )); then
    return 1
  else
    return 0
  fi
}

# Function to get test results
testResults() {
  local testSummary=$(cat ./test-results.json)
  local numPassedTests=$(echo $testSummary | jq '.numPassedTests')
  local numFailedTests=$(echo $testSummary | jq '.numFailedTests')
  local message="Unit tests: ${numPassedTests} passed, ${numFailedTests} failed"
  echo $message
  export UNITTEST_SUMMARY="$message"
  if (( numFailedTests > 0 )); then
    return 1
  else
    return 0
  fi
}

# Function to check lint errors
checkLintErrors() {
  local lintResults=$(cat ./eslint-report.json)
  local numErrors=$(echo $lintResults | jq 'map(.errorCount + .fatalErrorCount) | add // 0')
  local numWarnings=$(echo $lintResults | jq 'map(.warningCount) | add // 0')
  local message="Lint: ${numErrors} errors, ${numWarnings} warnings"
  echo $message
  export LINT_SUMMARY="$message"
  if (( numErrors > 0 || numWarnings > 0 )); then
    return 1
  else
    return 0
  fi
}

# Function to check dependencies
checkDependencies() {
  local text=$(cat ./npm-audit-report.md)
  local pattern="Found \*\*\([0-9]\+\)\*\* vulnerabilities within"
  local num=0
  if [[ $text =~ $pattern ]]; then
    num=${BASH_REMATCH[1]}
  fi
  local message="Dependency vulnerabilities found: ${num}"
  echo $message
  export DEPENDENCY_SUMMARY="$message"
  if (( num > 0 )); then
    return 1
  else
    return 0
  fi
}

# Function to check copyleft licenses
checkCopyleftLicenses() {
  local copyleftLic=("GPL" "LGPL" "MPL" "AGPL" "EUPL" "CCDL" "EPL" "CC-BY-SA" "OSL" "CPL")
  local text=$(cat ./license-report.txt)
  local foundLic=()
  for lic in "${copyleftLic[@]}"; do
    if [[ $text =~ $lic ]]; then
      foundLic+=($lic)
    fi
  done
  local numCopyleftLic=${#foundLic[@]}
  local message="Copyleft licenses found: ${numCopyleftLic}"
  echo $message
  export LICENSE_SUMMARY="$message"
  if (( numCopyleftLic > 0 )); then
    return 1
  else
    return 0
  fi
}

# Main script
if [ $# -lt 1 ]; then
  echo "summaryToGen arg not provided"
  exit -1
fi

summaryToGen=$1

case $summaryToGen in
  "coverage")
    codeCoverage
    ;;
  "test")
    testResults
    ;;
  "lint")
    checkLintErrors
    ;;
  "dependency")
    checkDependencies
    ;;
  "license")
    checkCopyleftLicenses
    ;;
  *)
    echo "Unknown summary type: $summaryToGen"
    exit -1
    ;;
esac