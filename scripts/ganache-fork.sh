#/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
source $SCRIPT_DIR/env.sh
exec ganache-cli --accounts 10 --hardfork istanbul --fork https://mainnet.infura.io/v3/$WEB3_INFURA_PROJECT_ID --gasLimit 12000000 --mnemonic 42 --port 8545 --chainId 1 $*

