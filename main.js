var cryptoObj = window.crypto || window.msCrypto;
var rand_arr = new Uint16Array(1);
var rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);

String.prototype.rtrim = function() {  
   return this.replace(/\s+$/g,"");  
}

function get_entropy() {
    return parseInt(document.querySelector('input[name="entropy"]:checked').value);
}

function load_js() {
    var language = document.querySelector('option[name="language"]:checked').value;
    var language_id = language.toLowerCase() + "_id";
    var script_obj = document.createElement("script");
    script_obj.src = "lists/" + language.toLowerCase() + ".js";
    script_obj.id = language_id;
    document.body.appendChild(script_obj);
    script_obj.onload = function () {
        switch(language) {
            case "Catalan": wordlist = catalan_wordlist; break;
            case "Danish": wordlist = danish_wordlist; break;
            case "Dutch": wordlist = dutch_wordlist; break;
            case "English": wordlist = english_wordlist; break;
            case "Esperanto": wordlist = esperanto_wordlist; break;
            case "Finnish": wordlist = finnish_wordlist; break;
            case "French": wordlist = french_wordlist; break;
            case "German": wordlist = german_wordlist; break;
            case "Italian": wordlist = italian_wordlist; break;
            case "Japanese": wordlist = japanese_wordlist; break;
            case "Klingon": wordlist = klingon_wordlist; break;
            case "Maori": wordlist = maori_wordlist; break;
            case "Norwegian": wordlist = norwegian_wordlist; break;
            case "Polish": wordlist = polish_wordlist; break;
            case "Russian": wordlist = russian_wordlist; break;
            case "Spanish": wordlist = spanish_wordlist; break;
            case "Swedish": wordlist = swedish_wordlist; break;
            case "Turkish": wordlist = turkish_wordlist; break;
        }
        generate_diceware(wordlist);
    };
    document.body.removeChild(script_obj);
}

function sec_rand(count) {
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

function gen_pass(len, set, spaces=false) {
    var pass = "";
    if (typeof set == "string") var pass_arr = set.split("");
    else pass_arr = set;
    for(i=len; i--;) {
        rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);
        if (spaces) {
            pass += pass_arr[sec_rand(set.length)];
            pass += " ";
            
        }
        else pass += pass_arr[sec_rand(set.length)];
    }
    return pass.rtrim();
}

function generate_eff() {
    var option = document.querySelector('input[name="wordlist"]:checked').value;
    var entropy = get_entropy();
    if (option == "long") var eff_wordlist = eff_long;
    else var eff_wordlist = eff_short;
    var len = Math.ceil(entropy/Math.log2(eff_wordlist.length));
    var pass_id = document.getElementById('eff-pass');
    pass_id.innerHTML = gen_pass(len, eff_wordlist, true);
}

function generate_diceware(wordlist=english_wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('diceware-pass');
    pass_id.innerHTML = gen_pass(len, wordlist, true);
}

function generate_beale() {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(beale_wordlist.length));
    var pass_id = document.getElementById('beale-pass');
    pass_id.innerHTML = gen_pass(len, beale_wordlist, true);
}

function generate_babble() {
    var tmp = [];
    var pass = [];
    var vowels = "aeiouy";
    var consonants = "bcdfghklmnprstvzx";
    var entropy = get_entropy();

    // remove the entropy from the first and last pseudowords
    entropy = entropy - 2*(2*Math.log2(consonants.length)+2*Math.log2(vowels.length));

    // get number of inner pseudowords
    var len = Math.ceil(entropy/(3*Math.log2(consonants.length)+2*Math.log2(vowels.length)));

    // generate first pseudoword (~13.34485068394299 bits entropy)
    for (var i=0; i<5; i++) {
        if (i % 2 == 0) tmp[i] = gen_pass(1, consonants);
        else tmp[i] = gen_pass(1, vowels);
    }
    pass = pass.concat(tmp);
    pass[0] = "x";

    var tmp = [];
    // generate additional pseudowords (~17.43231352519333 bits entropy)
    for (var i=0; i<len; i++) {
        for (var j=0; j<5; j++) {
            if (j % 2 == 0) tmp[(5*i)+j] = gen_pass(1, consonants);
            else tmp[(5*i)+j] = gen_pass(1, vowels);
        }
    }

    pass = pass.concat(tmp);
    tmp = [];

    // generate final pseudoword (~13.34485068394299 bits entropy)
    for (var i=0; i<5; i++) {
        if (i % 2 == 0) tmp[i] = gen_pass(1, consonants);
        else tmp[i] = gen_pass(1, vowels);
    }

    pass = pass.concat(tmp);
    pass[pass.length-1] = "x";

    for (var i=pass.length; i>0; i-=5) pass.splice(i, 0, "-");
    pass.pop() // strip last "-"
    document.getElementById("babble-pass").innerHTML = pass.join("");
}

function generate_leetspeak() {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(eff_short.length));
    var pass = gen_pass(len, eff_short, true);
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
    var entropy = get_entropy();
    var s = '';
    for (i=0; i<94; i++) s += String.fromCharCode(33+i);
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = gen_pass(len, s);
    // fix HTML '&', '<', and '>'
    pass = pass.replace(/&/g, "&amp");
    pass = pass.replace(/</g, "&lt;");
    pass = pass.replace(/>/g, "&gt;");
    document.getElementById("random-pass").innerHTML = pass;
}

function generate_base64() {
    var entropy = get_entropy();
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
    var len = Math.ceil(entropy/Math.log2(s.length));
    document.getElementById("base64-pass").innerHTML = gen_pass(len, s);
}

function generate_base32() {
    var entropy = get_entropy();
    var s = "0123456789abcdefghjkmnpqrstvwxyz";
    var len = Math.ceil(entropy/Math.log2(s.length));
    document.getElementById("base32-pass").innerHTML = gen_pass(len, s);
}

function generate_hex() {
    var entropy = get_entropy();
    var s = "0123456789abcdef"
    var len = Math.ceil(entropy/Math.log2(s.length));
    document.getElementById("hex-pass").innerHTML = gen_pass(len, s);
}
