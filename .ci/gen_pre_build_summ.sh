#!/bin/bash

# Function to calculate code coverage
codeCoverage() {
  local covSummary=$(cat ./coverage/coverage-summary.json)
  local covPct=$(echo $covSummary | jq '.total.statements.pct')
  local covPctRounded=$(printf "%.0f" "$covPct")
  local message="Coverage percentage: ${covPctRounded}%"
  echo $message
  export COVERAGE_SUMMARY="$message"
  if (( covPctRounded < 70 )); then
    echo "Error: Coverage is below threshold of 70 pct"
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
    echo "Error: There are failed unit tests"
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
    "Error: There are lint errors/warnings"
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
    echo "Error: Dependency vulnerabilities found"
    return 1
  else
    return 0
  fi
}

# Function to check copyleft licenses
checkCopyleftLicenses() {
  local strongCopyleft=("GPL" "AGPL" "EUPL" "OSL" "SSPL" "GFDL")
  local weakCopyleft=("LGPL" "MPL" "CCDL" "EPL" "CC-BY-SA" "CPL")
  local text=$(cat ./license-report.txt)
  local foundStrong=()
  local foundWeak=()

  # Check for weak copyleft licenses first
  for lic in "${weakCopyleft[@]}"; do
    if [[ $text =~ $lic ]]; then
      foundWeak+=($lic)
    fi
  done

  # Check for strong copyleft licenses, excluding any weak copyleft matches
  local textWithoutWeak=$text
  for lic in "${foundWeak[@]}"; do
    textWithoutWeak=${textWithoutWeak//$lic/}
  done

  for lic in "${strongCopyleft[@]}"; do
    if [[ $textWithoutWeak =~ $lic ]]; then
      foundStrong+=($lic)
    fi
  done

  local numStrongCopyleft=${#foundStrong[@]}
  local numWeakCopyleft=${#foundWeak[@]}
  local totalCopyleft=$((numStrongCopyleft + numWeakCopyleft))

  # Display the found licenses
  echo "Strong copyleft licenses found (${numStrongCopyleft}):"
  if (( numStrongCopyleft > 0 )); then
    printf "  - %s\n" "${foundStrong[@]}"
  else
    echo "  None"
  fi

  echo "Weak copyleft licenses found (${numWeakCopyleft}):"
  if (( numWeakCopyleft > 0 )); then
    printf "  - %s\n" "${foundWeak[@]}"
  else
    echo "  None"
  fi

  local message="Copyleft licenses found: ${totalCopyleft} (${numStrongCopyleft} strong, ${numWeakCopyleft} weak)"
  echo $message
  export LICENSE_SUMMARY="$message"

  if (( numStrongCopyleft > 0 )); then
    echo "Error: Strong copyleft licenses found"
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