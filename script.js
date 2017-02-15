/*
The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source.
*/

// http://stackoverflow.com/questions/14603205/how-to-convert-hex-string-into-a-bytes-array-and-a-bytes-array-in-the-hex-strin
// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}


function encrypt() {
  console.log("ENCRYPT");
  // get the text and convert it into bytes
  var text = document.getElementById("textarea_id0").value;
  console.log("original text:" + text);
  var textBytes = aesjs.utils.utf8.toBytes(text)
  console.log("original text in bytes:" + textBytes);

  // get the key and calculate the sha-256 hash, then convert it into bytes
  var key = document.getElementById("input_key").value;
  key = forge_sha256(key);
  console.log("keyhash:" + key);
  key = hexToBytes(key);
  console.log("key:" + key);

  // get the counter and instance the ctr operation mode
  // reference: https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Counter_.28CTR.29
  var aesCtr = parseInt(document.getElementById("input_counter").value);
  console.log("counter:" + aesCtr);
  aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(aesCtr));

  // encrypt the text, then encode it with base64 (btoa)
  // reference: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  var encryptedBytes = aesCtr.encrypt(textBytes);
  console.log("encryptedBytes:" + encryptedBytes);
  var encryptedText = btoa(encryptedBytes);

  document.getElementById("textarea_id1").value = encryptedText;
}

function decrypt() {
  console.log("DECRYPT");
  // get the text and convert it into bytes
  var text = document.getElementById("textarea_id0").value;
  console.log("original text:" + text);
  var encryptedText = atob(text);
  var encryptedBytes = JSON.parse("[" + encryptedText + "]");
  console.log("encryptedBytes:" + encryptedBytes);

  // get the key and calculate the sha-256 hash, then convert it into bytes
  var key = document.getElementById("input_key").value;
  key = forge_sha256(key);
  console.log("keyhash:" + key);
  key = hexToBytes(key);
  console.log("key:" + key);

  var aesCtr = parseInt(document.getElementById("input_counter").value);
  console.log("counter:" + aesCtr);
  aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(aesCtr));

  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  console.log("decryptedBytes:" + decryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

  document.getElementById("textarea_id1").value = decryptedText;
}
