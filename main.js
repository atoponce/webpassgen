var cryptoObj = window.crypto || window.msCrypto;
var rand_arr = new Uint16Array(1);
var rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);

String.prototype.rtrim = function() {  
   return this.replace(/\s+$/g,"");  
}

function secureRandom(count) {
    // provided by `Sc00bz' at: https://www.reddit.com/r/crypto/comments/4xe21s/
    var rand = new Uint32Array(1);
    var skip = 0x7fffffff - 0x7fffffff % count;
    var result;
    if (((count - 1) & count) === 0) {
        cryptoObj.getRandomValues(rand);
        return rand[0] & (count - 1);
    }
    do {
        cryptoObj.getRandomValues(rand);
        result = rand[0] & 0x7fffffff;
    } while (result >= skip);
    return result % count;
}

function gen_pass(len, chars) {
    var pass = "";
    var pass_arr = chars.split("");
    for(i=len; i--;) {
        rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);
        pass += pass_arr[secureRandom(chars.length)];
    }
    return pass
}


function generate_xkcd(len, wordlist) {
    var tmp = new Array(8);
    var pass = "";
    for (i=0; i<len; i++) {
        rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);
        tmp[i] = wordlist[secureRandom(wordlist.length)];
    }
    pass = tmp.join(" ");
    pass = pass.rtrim();
    return pass;
}

function generate_hex() {
    var len = 20;
    var s = "0123456789abcdef"
    document.getElementById("hex-pass").innerHTML = gen_pass(len, s);
}

function generate_base32() {
    var len = 16;
    var s = "0123456789abcdefghjkmnpqrstvwxyz";
    document.getElementById("base32-pass").innerHTML = gen_pass(len, s);
}

function generate_base64() {
    var len = 13;
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
    document.getElementById("base64-pass").innerHTML = gen_pass(len, s);
}

function generate_babble() {
    var vowels = "aeiouy";
    var consonants = "bcdfghklmnprstvzx";
    var pass = [];
    for (var i=0; i<5; i++) {
        for (var j=0; j<5; j++) {
            if (j % 2 == 0) pass[(5*i)+j] = gen_pass(1, consonants);
            else pass[(5*i)+j] = gen_pass(1, vowels);
        }
    }
    pass[0] = "x";
    pass[24] = "x";
    for (var i=20; i>0; i-=5) pass.splice(i, 0, "-");
    document.getElementById("babble-pass").innerHTML = pass.join("");
}

function generate_leetspeak() {
    var pass = generate_xkcd(8, eff_short);
    pass = pass.replace(/or/g, "r0");
    pass = pass.replace(/a/g, "4");
    pass = pass.replace(/e/g, "3");
    pass = pass.replace(/i/g, "!");
    pass = pass.replace(/n/g, "N");
    pass = pass.replace(/o/g, "0");
    pass = pass.replace(/r/g, "R");
    pass = pass.replace(/s/g, "$");
    pass = pass.replace(/t/g, "7");
    document.getElementById("leetspeak-pass").innerHTML = pass;
}

function generate_random() {
    var len = 12;
    var s = '';
    for (i=0; i<94; i++) s += String.fromCharCode(33+i);
    var pass = gen_pass(len, s);
    // fix HTML '&', '<', and '>'
    pass = pass.replace(/&/g, "&amp");
    pass = pass.replace(/</g, "&lt;");
    pass = pass.replace(/>/g, "&gt;");
    document.getElementById("random-pass").innerHTML = pass;
}
