var wordlists = {};
var script_obj='';
var spaces=false;

String.prototype.rtrim = function() { return this.replace(/\s+$/g,""); }

function toggle_info(def, fyi) {
    var div_default = document.getElementById(def);
    var div_fyi = document.getElementById(fyi);

    if (div_default.style.display == '') {
        div_default.style.display = 'none';
        div_fyi.style.display = 'table-cell';
    }
    else {
        div_default.style.display = '';
        div_fyi.style.display = '';
    }
    return false;
}

function toggle_hyphens(cbox, pass_div) {
    var pass_id = document.getElementById(pass_div);
    var pass = pass_id.innerHTML;
    var hyphens = document.getElementById(cbox);

    if (hyphens.checked) { pass_id.innerHTML = pass.replace(/ /g,'-'); }
    else {
        pass = pass.replace(/([^-])-/g, '$1 ');
        pass = pass.replace(/-([^-])/g, ' $1');
        pass_id.innerHTML = pass;
    }
}

function get_entropy() {
    return parseInt(document.querySelector('input[name="entropy"]:checked').value);
}

function get_source_list(source) {
    switch(source) {
        case "diceware":
            var s_list = document.querySelector('option[name="diceware_list"]:checked').value;
            break;
        case "eff":
            var s_list = document.querySelector('option[name="eff_list"]:checked').value;
            break;
        case "alternate":
            var s_list = document.querySelector('option[name="alternate_list"]:checked').value;
            break;
    }
    return s_list;
}

function generate_passphrase(source) {
    var s_list = get_source_list(source);

    if (s_list == "Distant Words") { file = "eff_distant"; }
    else if (s_list == "Long Words") { file = "eff_long"; }
    else if (s_list == "Short Words") { file = "eff_short"; }
    else file = s_list.toLowerCase();

    if (!wordlists.hasOwnProperty(s_list)) {
        var script_obj = document.createElement("script");
        script_obj.src = "lists/" + file + ".js";
        document.body.appendChild(script_obj);
        load_js(script_obj, source);
    }
    else {
        switch(source) {
            case 'diceware': generate_diceware(wordlists[s_list]); break;
            case 'eff': generate_eff(wordlists[s_list]); break;
            case 'alternate': generate_alternate(wordlists[s_list]); break;
        }
    }
}

function load_js(script_obj, source) {
    var file = "";
    var s_list = get_source_list(source);

    script_obj.onload = function () {
        switch(s_list) {
            case "Beale": wordlists[s_list] = beale_wordlist; break;
            case "Bitcoin": wordlists[s_list] = bitcoin_wordlist; break;
            case "Catalan": wordlists[s_list] = catalan_wordlist; break;
            case "Danish": wordlists[s_list] = danish_wordlist; break;
            case "Distant Words": wordlists[s_list] = eff_distant; break;
            case "Dutch": wordlists[s_list] = dutch_wordlist; break;
            case "Elvish": wordlists[s_list] = elvish_wordlist; break;
            case "English": wordlists[s_list] = english_wordlist; break;
            case "Esperanto": wordlists[s_list] = esperanto_wordlist; break;
            case "Finnish": wordlists[s_list] = finnish_wordlist; break;
            case "French": wordlists[s_list] = french_wordlist; break;
            case "German": wordlists[s_list] = german_wordlist; break;
            case "Italian": wordlists[s_list] = italian_wordlist; break;
            case "Japanese": wordlists[s_list] = japanese_wordlist; break;
            case "Klingon": wordlists[s_list] = klingon_wordlist; break;
            case "Long Words": wordlists[s_list] = eff_long; break;
            case "Maori": wordlists[s_list] = maori_wordlist; break;
            case "Norwegian": wordlists[s_list] = norwegian_wordlist; break;
            case "PGP": wordlists[s_list] = pgp_wordlist; break;
            case "Polish": wordlists[s_list] = polish_wordlist; break;
            case "RockYou": wordlists[s_list] = rockyou_wordlist; break;
            case "Short Words": wordlists[s_list] = eff_short; break;
            case "Simpsons": wordlists[s_list] = simpsons_wordlist; break;
            case "Spanish": wordlists[s_list] = spanish_wordlist; break;
            case "Swedish": wordlists[s_list] = swedish_wordlist; break;
            case "Turkish": wordlists[s_list] = turkish_wordlist; break;
        }
        generate_passphrase(source);
    };
}

function sec_rand(count) {
    // provided by `Sc00bz' at: https://www.reddit.com/r/crypto/comments/4xe21s/
    var skip = 0x7fffffff - 0x7fffffff % count;
    var result;
    var rand;
    if (((count - 1) & count) === 0) {
        rand = sjcl.random.randomWords(1);
        return rand[0] & (count - 1);
    }
    do {
        rand = sjcl.random.randomWords(1);
        result = rand[0] & 0x7fffffff;
    } while (result >= skip);
    return result % count;
}

function generate_pass(len, set, spaces) {
    var pass = "";
    if (typeof set == "string") var pass_arr = set.split("");
    else pass_arr = set;
    for(i=len; i--;) {
        if (spaces) {
            pass += pass_arr[sec_rand(set.length)];
            pass += " ";
            
        }
        else pass += pass_arr[sec_rand(set.length)];
    }
    return pass.rtrim();
}

function generate_diceware(wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('diceware-pass');
    var pass_length = document.getElementById('diceware-length');
    var pass_entropy = document.getElementById('diceware-entropy');
    var hyphens = document.getElementById('hyphen8_1');
    pass = generate_pass(len, wordlist, true);
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/\s/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
    if (hyphens.checked) pass_id.innerHTML = pass.split(' ').join('-');
}

function generate_eff(wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('eff-pass');
    var pass_length = document.getElementById('eff-length');
    var pass_entropy = document.getElementById('eff-entropy');
    var hyphens = document.getElementById('hyphen8_2');
    pass = generate_pass(len, wordlist, true);
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/\s/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
    if (hyphens.checked) pass_id.innerHTML = pass.split(' ').join('-');
}

function generate_alternate(wordlist) {
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('alt-pass');
    var pass_length = document.getElementById('alt-length');
    var pass_entropy = document.getElementById('alt-entropy');
    var hyphens = document.getElementById('hyphen8_3');
    pass = generate_pass(len, wordlist, true);
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/\s/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
    if (hyphens.checked) pass_id.innerHTML = pass.split(' ').join('-');
}

function generate_ninja() {
    var ninja = ['ka','zu','mi','te','ku','lu','ji','ri','ki','zu','me','ta','rin','to','mo','no','ke','shi','ari','chi','do','ru','mei','na','fu','zi'];
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(ninja.length));
    var pass = "";
    
    for (i=0; i<len; i++) {
        pass += ninja[sec_rand(len)];
        if (i%3 == 2 && i!=len-1) pass += "-";
    }
    return [pass, ninja.length, Math.floor(len*Math.log2(ninja.length))];
}

function generate_babble() {
    var pass = [];
    var vowels = "aeiouy";
    var consonants = "bcdfghklmnprstvzx";
    var entropy = get_entropy();
    var v_ent = Math.log2(vowels.length);
    var c_ent = Math.log2(consonants.length);
    var out_ent = (2*c_ent)+(2*v_ent);
    var in_ent = (3*c_ent)+(2*v_ent);

    entropy = entropy - (2*out_ent);

    var len = Math.ceil(entropy/in_ent);
    var tot_ent = out_ent + (len*in_ent) + out_ent;

    for (var i=0; i<len+2; i++) {
        for (var j=0; j<5; j++) {
            if (j % 2 == 0) pass[(5*i)+j] = generate_pass(1, consonants);
            else pass[(5*i)+j] = generate_pass(1, vowels);
        }
    }

    pass[0] = "x";
    pass[pass.length-1] = "x";

    for (var i=pass.length; i>0; i-=5) pass.splice(i, 0, "-");
    pass.pop() // strip last "-"
    return [pass.join(""), (len+2)*5, Math.floor(tot_ent)];
}

function generate_pseudowords() {
    var pseudo = document.querySelector('option[name="pseudowords"]:checked').value;
    if (pseudo == "Bubble Babble") var ret = generate_babble();
    else if (pseudo == "Secret Ninja") var ret = generate_ninja();
    var pass = ret[0];
    var len = ret[1];
    var ent = ret[2];
    var pass_id = document.getElementById('pseudo-pass');
    var pass_length = document.getElementById('pseudo-length');
    var pass_entropy = document.getElementById('pseudo-entropy');
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + ent + "-bits.";
}

function generate_base94() {
    var s = '';
    var entropy = get_entropy();
    var pass_id = document.getElementById('base94-pass');
    var pass_length = document.getElementById('base94-length');
    var pass_entropy = document.getElementById('base94-entropy');
    for (i=0; i<94; i++) s += String.fromCharCode(33+i);
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    pass_length.innerHTML = pass.length + " characters.";
    // fix HTML '&', '<', and '>'
    pass = pass.replace(/&/g, "&amp");
    pass = pass.replace(/</g, "&lt;");
    pass = pass.replace(/>/g, "&gt;");
    pass_id.innerHTML = pass;
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_base64() {
    var entropy = get_entropy();
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    var pass_id = document.getElementById('base64-pass');
    var pass_length = document.getElementById('base64-length');
    var pass_entropy = document.getElementById('base64-entropy');
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_base32() {
    var entropy = get_entropy();
    var s = "0123456789abcdefghjkmnpqrstvwxyz";
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    var pass_id = document.getElementById('base32-pass');
    var pass_length = document.getElementById('base32-length');
    var pass_entropy = document.getElementById('base32-entropy');
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_base16() {
    var entropy = get_entropy();
    var s = "0123456789abcdef"
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    var pass_id = document.getElementById('base16-pass');
    var pass_length = document.getElementById('base16-length');
    var pass_entropy = document.getElementById('base16-entropy');
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_base10() {
    var entropy = get_entropy();
    var s = "0123456789"
    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    var pass_id = document.getElementById('base10-pass');
    var pass_length = document.getElementById('base10-length');
    var pass_entropy = document.getElementById('base10-entropy');
    pass_id.innerHTML = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}
