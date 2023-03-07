'use strict';

let counter, base_data, result_data = {}, name;

const fs = require('fs');
const fsPromises = require('fs/promises');
const basedir = __dirname + "/base";
const outdir = __dirname + "/out";
if (!fs.existsSync(basedir)){ 
    fs.mkdirSync(basedir);
}
if (!fs.existsSync(outdir)){ 
    fs.mkdirSync(outdir);
}
function start_baseline(s) {
    let basefilename = basedir + "/" + s + ".json";
    if (fs.existsSync(basefilename)) {
        let basefile = fs.readFileSync(basefilename);
        base_data = JSON.parse(basefile);
        console.log('loading baseline data ' + s);
    } else {
        base_data = undefined;
    }
    counter = 0;
    name = s;
    result_data = {};
}

function end_baseline() {
    let data = JSON.stringify(result_data, null, ' ');
    fs.writeFileSync(outdir + "/" + name + ".json", data);
    result_data = {};
}

async function report(f, header, compare) {
    const result = (await Promise.all(f())).map(r => r.toString());
    result_data[counter] = result;
    var c = result.map(function(e, i) {
	return [e,
		header != undefined ? header[i] : null,
	       ];
    });
    for (const i of c) {
	if (i[1]) {
	    console.log('    ', i[1], i[0]);
	}
    }

    if (compare != undefined) {
	const compare_result = compare.map((r, i) => r ? r : result[i]);
	assert.deepEqual(result.slice(0, compare_result.length),
                         compare_result);
    } else if (base_data != undefined &&
        base_data[counter] != undefined) {
        assert.deepEqual(result, base_data[counter]);
    }
    counter = counter + 1;   
}

exports.report = report;
exports.start_baseline = start_baseline;
exports.end_baseline = end_baseline;
