#/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $SCRIPT_DIR/env.sh
exec ganache-cli --accounts 10 --hardfork istanbul --gasLimit 12000000 --mnemonic 42 --port 7545 $*

