Using the test reporter
-----------------------

The test reporter will dump it's output into out.  You can then copy
the results into the directory base.

const { start_baseline, end_baseline } = require('./test-report');

describe('foo',() => {
before (async() => {
  start_baseline('filename')
});
after(async() => {
  end_baseline()
});
});

Use the "report" function output to generate compare amounts.

This will generate out/filename.json if you move that file into
base/filename.json, the system will compare the base with the
baseline.

