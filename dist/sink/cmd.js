#!/usr/bin/env node
// (c) Copyright 2016, Sean Connelly (@voidqk), http://syntheti.cc
// MIT License
// Project Home: https://github.com/voidqk/sink

var Sink = require('./sink');
var SinkShell = require('./sink_shell');
var fs = require('fs');
var path = require('path');
var readline = require('readline');

function replPrompt(){
	var line = 1;
	return function(levels){
		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return new Promise(function(resolve, reject){
			var p = ': ';
			if (levels > 0)
				p = (new Array(levels + 1)).join('..') + '. ';
			if (line < 10)
				p = ' ' + line + p;
			else
				p = line + p;
			rl.question(p, function(ans){
				line++;
				rl.close();
				resolve(ans + '\n');
			});
		});
	};
}

function sinkExit(pass){
	if (typeof pass === 'string')
		warn(pass);
	process.exit(pass === true ? 0 : 1);
}

function fstype(file){ // must return 'file', 'dir', or 'none'
	return new Promise(function(resolve, reject){
		fs.stat(file, function(err, st){
			if (err){
				if (err.code == 'ENOENT')
					return resolve('none');
				return reject(err);
			}
			if (st.isFile())
				return resolve('file');
			else if (st.isDirectory())
				return resolve('dir');
			resolve('none');
		});
	});
}

function fsread(file){
	return new Promise(function(resolve, reject){
		fs.readFile(file, 'utf8', function(err, data){
			if (err)
				return reject(err);
			resolve(data);
		});
	});
}

function getpaths(repl){
	// TODO: read from SINK_PATH environment variable
	return [repl ? process.cwd() : '.'];
}

function say(str){
	console.log(str);
}

function warn(str){
	console.error(str);
}

function ask(str){
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise(function(resolve, reject){
		rl.question(str, function(ans){
			rl.close();
			resolve(ans);
		});
	});
}

function printVersion(){
	console.log(
		'Sink v1.0\n' +
		'Copyright (c) 2016 Sean Connelly (@voidqk), MIT License\n' +
		'https://github.com/voidqk/sink  http://syntheti.cc');

}

function printHelp(){
	printVersion();
	console.log(
		'\nUsage:\n' +
		'  sink                           Read-eval-print loop\n' +
		'  sink <file> [arguments]        Run file with arguments\n' +
		'  sink -e \'<code>\' [arguments]   Run \'<code>\' with arguments\n' +
		'  sink -c <file>                 Compile file to bytecode\n' +
		'  sink -v                        Print version information');
}

var mode = 'repl';
var evalLine = false;
var inFile = false;
var args = [];

for (var i = 2; i < process.argv.length; i++){
	var ar = process.argv[i];
	switch (mode){
		case 'repl':
			if (ar == '-v')
				mode = 'version';
			else if (ar == '-c')
				mode = 'compile';
			else if (ar == '-e')
				mode = 'eval';
			else if (ar == '--')
				mode = 'rest';
			else if (ar == '-h' || ar == '--help')
				return printHelp();
			else{
				mode = 'run';
				inFile = ar;
			}
			break;
		case 'version':
			return printHelp();
		case 'compile':
			if (inFile === false)
				inFile = ar;
			else
				return printHelp();
			break;
		case 'eval':
			if (evalLine === false)
				evalLine = ar;
			else
				args.push(ar);
			break;
		case 'rest':
			mode = 'run';
			inFile = ar;
			break;
		case 'run':
			args.push(ar);
			break;
	}
}

function makeabs(file){
	if (file.charAt(0) == '/')
		return file;
	return path.join(process.cwd(), file);
}

function fsreadEval(line){
	return function(file){
		if (file.substr(-6) === '<eval>')
			return line;
		return fsread(file);
	};
}

switch (mode){
	case 'repl':
	case 'rest':
		return Sink.repl(
			replPrompt(),
			fstype, fsread,
			say, warn, ask,
			[SinkShell(args)],
			getpaths(true)
		).then(sinkExit);
	case 'version':
		return printVersion();
	case 'compile':
		if (inFile == false)
			return printHelp();
		throw 'TODO: compile ' + inFile;
	case 'eval':
		if (evalLine === false)
			return printHelp();
		return Sink.run(
			makeabs('<eval>'),
			fstype, fsreadEval(evalLine),
			say, warn, ask,
			[SinkShell(args)],
			getpaths(false)
		).then(sinkExit);
	case 'run':
		if (inFile === false)
			return printHelp();
		return Sink.run(
			makeabs(inFile),
			fstype, fsread,
			say, warn, ask,
			[SinkShell(args)],
			getpaths(false)
		).then(sinkExit);
}
