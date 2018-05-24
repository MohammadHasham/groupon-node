const Keygrip = require("keygrip");
const Buffer = require('safe-buffer').Buffer;
const keygrip = new Keygrip(['abc123random']);
module.exports = (user)=>{
  console.log(user)
  const sessionObject = {
    passport:{
      user: user._id.toString()
    }
  };
const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
const sig = keygrip.sign('session='+sessionString);
console.log(sessionString)
return {session:sessionString,sig:sig};
};
