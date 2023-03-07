#/bin/bash
# This is a demo script that shows how to use mainnet forking 
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Saving ganache output in $SCRIPT_DIR/fork.txt"
$SCRIPT_DIR/ganache-fork.sh >> $SCRIPT_DIR/fork.txt &
sleep 1
truffle test --network ganache $*

#kill processes
pkill -P $$
wait


