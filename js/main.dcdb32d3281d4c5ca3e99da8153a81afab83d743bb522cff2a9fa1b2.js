var spaces=false;

String.prototype.rtrim = function() { return this.replace(/\s+$/g,""); }

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
        case "bitcoin":
            var s_list = document.querySelector('option[name="bitcoin_list"]:checked').value;
            break;
    }
    return s_list;
}

function generate_passphrase(source) {
    var s_list = get_source_list(source);
    switch(source) {
        case 'diceware': generate_diceware(s_list); break;
        case 'eff': generate_eff(s_list); break;
        case 'alternate': generate_alternate(s_list); break;
        case 'bitcoin': generate_bitcoin(s_list); break;
    }
}

/* Uniform, unbiased, secure, random number generator */
function sec_rand(count) {
    var min;
    var rand_array = new Uint32Array(1);

    const my_crypto = window.crypto || window.msCrypto;

    // ensure `count' is a 32-bit integer
    count >>>= 0;

    // force the range of [`min', 2**32] to be a multiple of `count'
    min = (-count >>> 0) % count;

    do {
        my_crypto.getRandomValues(rand_array);
    } while (rand_array[0] < min);

    return rand_array[0] % count;
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

function generate_diceware(selection) {
    var wordlist = [];
    switch(selection) {
        case "Basque": wordlist = diceware_eu; break;
        case "Beale": wordlist = diceware_beale; break;
        case "Bulgarian": wordlist = diceware_bg; break;
        case "Catalan": wordlist = diceware_ca; break;
        case "Chinese": wordlist = diceware_cn; break;
        case "Czech": wordlist = diceware_cz; break;
        case "Danish": wordlist = diceware_da; break;
        case "Dutch": wordlist = diceware_nl; break;
        case "English": wordlist = diceware_en; break;
        case "Esperanto": wordlist = diceware_eo; break;
        case "Finnish": wordlist = diceware_fi; break;
        case "French": wordlist = diceware_fr; break;
        case "German": wordlist = diceware_de; break;
        case "Hungarian": wordlist = diceware_hu; break;
        case "Italian": wordlist = diceware_it; break;
        case "Japanese": wordlist = diceware_jp; break;
        case "Maori": wordlist = diceware_mi; break;
        case "Norwegian": wordlist = diceware_no; break;
        case "Polish": wordlist = diceware_pl; break;
        case "Portuguese": wordlist = diceware_pt; break;
        case "Russian": wordlist = diceware_ru; break;
        case "Slovenian": wordlist = diceware_sl; break;
        case "Spanish": wordlist = diceware_es; break;
        case "Swedish": wordlist = diceware_sv; break;
        case "Turkish": wordlist = diceware_tr; break;
    }

    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('diceware-pass');
    var pass_length = document.getElementById('diceware-length');
    var pass_entropy = document.getElementById('diceware-entropy');

    pass = generate_pass(len, wordlist, true);
    pass_id.innerText = pass;

    pass_length.innerHTML = "<span>" + pass.replace(/\s/g, '').length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function generate_eff(selection) {
    var wordlist = [];
    switch(selection) {
        case "Distant Words": wordlist = eff_distant; break;
        case "Short Words": wordlist = eff_short; break;
        case "Long Words": wordlist = eff_long; break;
    }

    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('eff-pass');
    var pass_length = document.getElementById('eff-length');
    var pass_entropy = document.getElementById('eff-entropy');

    pass = generate_pass(len, wordlist, true);
    pass_id.innerText = pass;

    pass_length.innerHTML = "<span>" + pass.replace(/\s/g, '').length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function generate_alternate(selection) {
    var wordlist = [];
    switch(selection) {
        case "Colors": return generate_colors(); break;
        case "Elvish": wordlist = alternate_elvish; break;
        case "Klingon": wordlist = alternate_klingon; break;
        case "PGP": wordlist = alternate_pgp; break;
        case "RockYou": wordlist = alternate_rockyou; break;
        case "Simpsons": wordlist = alternate_simpsons; break;
        case "Trump": wordlist = alternate_trump; break;
    }

    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('alt-pass');
    var pass_length = document.getElementById('alt-length');
    var pass_entropy = document.getElementById('alt-entropy');

    pass = generate_pass(len, wordlist, true);
    pass_id.innerText = pass;

    pass_length.innerHTML = "<span>" + pass.replace(/\s/g, '').length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function is_too_light(hex) {
    var rgb = parseInt(hex, 16);
    var r = (rgb >> 16) &0xff;
    var g = (rgb >> 8) &0xff;
    var b = (rgb >> 0) &0xff;
    var l = (0.299*r) + (0.587*g) + (0.114*b);
    if (l<176) {return false;} return true;
}

function generate_colors() {
    var tmp = "";
    var color_keys = Object.keys(alternate_colors);
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(color_keys.length));
    var pass_id = document.getElementById('alt-pass');
    var pass_length = document.getElementById('alt-length');
    var pass_entropy = document.getElementById('alt-entropy');
    var pass = generate_pass(len, color_keys, true).split(" ");


    for (var i=0; i<len; i++) {
        var hex = alternate_colors[pass[i]];
        if (is_too_light(hex)) {
            tmp += "<span class='bold contrast' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
        }
        else {
            tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
        }
    }

    pass_id.innerHTML = tmp;
    tmp = "";
    for (var i=0; i<len; i++) { tmp += pass[i] }
    pass = tmp;

    pass_length.innerHTML = "<span>" + pass.replace(/\s/g, '').length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(color_keys.length)) + "-bits.";
}

function generate_bitcoin(selection) {
    var wordlist = [];
    switch(selection) {
        case "Chinese (Simp)": wordlist = bitcoin_cn_simp; break;
        case "Chinese (Trad)": wordlist = bitcoin_cn_trad; break;
        case "English": wordlist = bitcoin_en; break;
        case "French": wordlist = bitcoin_fr; break;
        case "Italian": wordlist = bitcoin_it; break;
        case "Japanese": wordlist = bitcoin_jp; break;
        case "Korean": wordlist = bitcoin_kr; break;
        case "Spanish": wordlist = bitcoin_es; break;
    }

    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(wordlist.length));
    var pass_id = document.getElementById('btc-pass');
    var pass_length = document.getElementById('btc-length');
    var pass_entropy = document.getElementById('btc-entropy');

    pass = generate_pass(len, wordlist, true);
    pass_id.innerText = pass;

    pass_length.innerHTML = "<span>" + pass.replace(/\s/g, '').length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
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

function generate_cosby() {
    // 32 unique words = 5 bits of entropy per word
    var cosby = ['Bada','Badum','Bee','Bloo','Bop','Caw','Derp','Dip','Doo','Dub','Hip','Ka','Loo','Meep','Mim','Moom','Na','Naw','Nerp','Nup','Pa','Papa','Spee','Squee','Squoo','Woobly','Wop','Yee','Zap','Zip','Zop','Zoop','Zow'];
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(cosby.length));
    var pass = "";
    
    for (i=0; i<len; i++) {
        pass += cosby[sec_rand(len)];
        if (i%3 == 2 && i!=len-1) pass += "-";
    }
    return [pass, cosby.length, Math.floor(len*Math.log2(cosby.length))];
}

function generate_kpop() {
    // 64 unique words = 6 bits of entropy per word
    var kpop = ['A','Ah','Bae','Bin','Bo','Choi','Chul','Da','Do','Dong','Eun','Gi','Gun','Ha','Hae','Hee','Ho','Hu','Hwa','Hwan','Hye','Hyo','Hyun','Il','In','Ja','Jae','Ji','Jin','Jong','Joo','Joon','Ju','Jun','Jung','Ki','Kun','Kyu','Lee','Mi','Min','Moon','Nam','Ok','Park','Rin','Seo','Seul','Shi','Sik','So','Song','Soo','Su','Sun','Sung','Won','Woo','Ye','Yeon','Yoo','Yu','Yul','Yun'];
    var entropy = get_entropy();
    var len = Math.ceil(entropy/Math.log2(kpop.length));
    var pass = "";
    
    for (i=0; i<len; i++) {
        pass += kpop[sec_rand(len)];
        if (i%2 == 1 && i!=len-1) pass += "-";
    }
    return [pass, kpop.length, Math.floor(len*Math.log2(kpop.length))];
}

function generate_pseudowords() {
    var pseudo = document.querySelector('option[name="pseudowords"]:checked').value;
    if (pseudo == "Bubble Babble") var ret = generate_babble();
    else if (pseudo == "Secret Ninja") var ret = generate_ninja();
    else if (pseudo == "Cosby Bebop") var ret = generate_cosby();
    else if (pseudo == "Korean K-pop") var ret = generate_kpop();
    var pass = ret[0];
    var len = ret[1];
    var ent = ret[2];
    var pass_id = document.getElementById('pseudo-pass');
    var pass_length = document.getElementById('pseudo-length');
    var pass_entropy = document.getElementById('pseudo-entropy');
    pass_id.innerText = pass;
    pass_length.innerHTML = pass.replace(/-/g, '').length + " characters.";
    pass_entropy.innerHTML = "~" + ent + "-bits.";
}

function generate_random() {
    var s = '';
    var entropy = get_entropy();
    var pass_id = document.getElementById('random-pass');
    var pass_length = document.getElementById('random-length');
    var pass_entropy = document.getElementById('random-entropy');
    var option = document.querySelector('option[name="random"]:checked').value;

    if (option == "Base-94") { for (i=0; i<94; i++) s += String.fromCharCode(33+i); }
    else if (option == "Base-64") { var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/"; }
    else if (option == "Base-32") { var s = "0123456789abcdefghjkmnpqrstvwxyz"; }
    else if (option == "Base-16") { var s = "0123456789abcdef"; }
    else if (option == "Base-10") { var s = "0123456789"; }
    else if (option == "Emoji") { return generate_emoji(); }

    var len = Math.ceil(entropy/Math.log2(s.length));
    var pass = generate_pass(len, s);
    pass_length.innerHTML = len + " characters.";

    pass_id.removeAttribute("style"); // from emoji
    pass_id.innerText = pass;
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_emoji() {
    var entropy = get_entropy();
    var pass_id = document.getElementById('random-pass');
    var pass_length = document.getElementById('random-length');
    var pass_entropy = document.getElementById('random-entropy');

    var len = Math.ceil(entropy/Math.log2(random_emoji.length));
    var pass = generate_pass(len, random_emoji);
    pass_length.innerHTML = len + " characters.";

    pass_id.style.fontFamily = "Noto Emoji";
    pass_id.innerText = pass;
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(random_emoji.length)) + "-bits.";
}
