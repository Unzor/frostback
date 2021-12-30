#!/usr/bin/env node
function arrayFindIncludes(key, arr) {
var result;
var none = null;
arr.forEach(function(k){
if (k.includes(key)) {
result = k;
none = k;
} else {
result = none;
}
})
return result;
}

var parser = require("cli2json");
var cli_parsed = parser.parse(process.argv.slice(2).join(" "), {
  readCommandAfter: ["-o", "--output"]
});
var fs = require('fs');
var browserify = require('browserify');
var findImports = require('find-imports');

function pack(module, o){
  return new Promise((resolve, reject) => {
    global.status = "Waiting..."
    if (!fs.existsSync('node_modules')){
    fs.mkdirSync('node_modules');
  }
  var { exec } = require('child_process');
exec(`npm list | grep ${module}`, function(err, stdout, stderr){
global.status = "Checking if module exists..."
if (stdout == ""){
exec('npm install ' + module, function(err, out, stderr){
  global.status = "Installing module " + module + "..."
  console.log(err, out, stderr);
   var b = browserify();
  
b.require(module.split('@').shift());
  global.status = "Bundling..."
b.bundle()
     .on('error', err => { throw err; })
    .pipe(o);
      setTimeout(function(){
        global.status = "Finished!"
            }, 2000);
})
} else {
 var b = browserify();
  
b.require(module);
    global.status = "Bundling..."
b.bundle()
 .on('error', err => { throw err; })
  .pipe(o);
    setTimeout(function(){
      global.status = "Finished!"
    }, 2000);
}
});
  });
}

(async () => {
  var c = cli_parsed.commands[0];
  var f;
 if (c) { 
if (fs.existsSync("frostback")) {
f = pack(c, fs.createWriteStream("frostback/" + c));
}
   else {
     fs.mkdirSync("frostback");
     f = pack(c, fs.createWriteStream("frostback/" + c));
   }
 } else {
   throw new Error("frostback error: no module declared! Declare an NPM module to fetch and integrate into your website!")
 }
var lines = ["-", "/", "|", "\\"]
var i = 0;  // dots counter
global.int = setInterval(function() {
var message = global.status + " "
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line
  i = (i + 1) % 4;
  var dots = new Array(i + 1).join(".");
  if (message !== "Finished! ") {
  process.stdout.write(message + lines[i]);  // write text
  }
  else {
    console.log("Finished!");
    clearInterval(int);
  }
}, 100);
})();