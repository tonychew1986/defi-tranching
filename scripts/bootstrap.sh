#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $SCRIPT_DIR/..
npm install --save-dev chai chai-as-promised solidity-coverage @openzeppelin/test-helpers
popd
