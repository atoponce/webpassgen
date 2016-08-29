var cryptoObj = window.crypto || window.msCrypto;
var rand_arr = new Uint16Array(1);
var rand_num = cryptoObj.getRandomValues(rand_arr)[0]/Math.pow(2,16);

String.prototype.rtrim = function() {  
   return this.replace(/\s+$/g,"");  
}

function get_entropy() {
    return parseInt(document.querySelector('input[name="entropy"]:checked').value);
}

function load_js(source) {
    switch(source) {
        case "eff":
            var s_list = document.querySelector('option[name="eff_list"]:checked').value;
            break;
        case "diceware":
            var s_list = document.querySelector('option[name="diceware_list"]:checked').value;
            break;
        case "alternate":
            var s_list = document.querySelector('option[name="alternate_list"]:checked').value;
            break;
    }

    if (s_list == "Distant Words") { s_list = "eff_distant"; }
    else if (s_list == "Long Words") { s_list = "eff_long"; }
    else if (s_list == "Short Words") { s_list = "eff_short"; }

    var script_obj = document.createElement("script");
    script_obj.src = "lists/" + s_list.toLowerCase() + ".js";
    document.body.appendChild(script_obj);

    script_obj.onload = function () {
        switch(s_list) {
            case "eff_distant": wordlist = eff_distant; break;
            case "eff_long": wordlist = eff_long; break;
            case "eff_short": wordlist = eff_short; break;
            case "Beale": wordlist = beale_wordlist; break;
            case "Bitcoin": wordlist = bitcoin_wordlist; break;
            case "Catalan": wordlist = catalan_wordlist; break;
            case "Danish": wordlist = danish_wordlist; break;
            case "Dutch": wordlist = dutch_wordlist; break;
            case "English": wordlist = english_wordlist; break;
            case "Esperanto": wordlist = esperanto_wordlist; break;
            case "Finnish": wordlist = finnish_wordlist; break;
            case "French": wordlist = french_wordlist; break;
            case "German": wordlist = german_wordlist; break;
            case "Italian": wordlist = italian_wordlist; break;
            case "Klingon": wordlist = klingon_wordlist; break;
            case "Japanese": wordlist = japanese_wordlist; break;
            case "Maori": wordlist = maori_wordlist; break;
            case "Norwegian": wordlist = norwegian_wordlist; break;
            case "PGP": wordlist = pgp_wordlist; break;
            case "Polish": wordlist = polish_wordlist; break;
            case "Simpsons": wordlist = simpsons_wordlist; break;
            case "Spanish": wordlist = spanish_wordlist; break;
            case "Swedish": wordlist = swedish_wordlist; break;
            case "Turkish": wordlist = turkish_wordlist; break;
        }
        switch(source) {
            case "eff": generate_eff(wordlist); break;
            case "diceware": generate_diceware(wordlist); break;
            case "alternate": generate_alternate(wordlist); break;
        }
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

function generate_eff(wordlist=eff_short) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('eff-pass');
    pass_id.innerHTML = gen_pass(len, wordlist, true);
}

function generate_diceware(wordlist=english_wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('diceware-pass');
    pass_id.innerHTML = gen_pass(len, wordlist, true);
}

function generate_alternate(wordlist=klingon_wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('alt-pass');
    pass_id.innerHTML = gen_pass(len, wordlist, true);
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

function generate_decimal() {
    var entropy = get_entropy();
    var s = "0123456789"
    var len = Math.ceil(entropy/Math.log2(s.length));
    document.getElementById("decimal-pass").innerHTML = gen_pass(len, s);
}
