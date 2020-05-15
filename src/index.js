require("@babel/register");
var totp = require("./totp");
var keyUtil = require("./keyUtil");

var args = process.argv.slice(2)

var ops = {
  "get": function () {
    totp.get(args[1]).then((rv) => {
      console.log(rv)
    })
  },
  "set": function () {
    keyUtil.set(args[1], args[2])
  },
  "del": function () {
    keyUtil.del(args[1])
  }
}

if (ops[args[0]]) {
  ops[args[0]]()
} else {
  console.log(`USAGE: otpcli set [service] [key]
       otpcli get [service]
       otpcli del [service]
`)
}

