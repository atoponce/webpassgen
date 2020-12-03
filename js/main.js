let spaces = false;
String.prototype.rtrim = function() {
    return this.replace(/\s+$/g,"");
};

function unicode_warn() {
    if (localStorage.getItem("unicode_warned") === null) {
        document.getElementById("overlay").style.display = "block";
        localStorage.setItem("unicode_warned", true);
    }
}

const pageContainer = document.getElementsByTagName("body")[0];
const prefersDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
const theme_switcher = document.getElementById("theme_switcher");

function set_dark_theme() {
    pageContainer.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    theme_switcher.innerText = "Light Theme";
}

function set_light_theme() {
    pageContainer.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    theme_switcher.innerText = "Dark Theme";
}

function init_theme() {
    if (localStorage.getItem("theme") === "dark") {
        set_dark_theme(); // Dark Theme was set on page load because of previously set preference.
    } else if (!localStorage.getItem("theme") && prefersDarkTheme && prefersDarkTheme.matches == true) {
        set_dark_theme(); // Dark Theme was set on page load because of OS preference.
    } else {
        // Light Theme was assumed due to page default or user preference or OS preference.
    }
}

function toggle_theme() {
    if (pageContainer.classList.contains("dark-theme")) {
        set_light_theme();
    } else {
        set_dark_theme();
    }
}

function get_entropy() {
    return parseInt(document.querySelector("input[name='entropy']:checked").value);
}

function get_source_list(source) {
    let s_list;

    switch (source) {
        case "diceware":
            s_list = document.getElementById("diceware-options").value;
            break;
        case "eff":
            s_list = document.getElementById("eff-options").value;
            break;
        case "alternate":
            s_list = document.getElementById("alt-options").value;
            break;
        case "bitcoin":
            s_list = document.getElementById("bitcoin-options").value;
            break;
    }

    return s_list;
}

function generate_passphrase(source) {
    let s_list = get_source_list(source);

    switch (source) {
        case "diceware":
            generate_diceware(s_list);
            break;
        case "eff":
            generate_eff(s_list);
            break;
        case "alternate":
            generate_alternate(s_list);
            break;
        case "bitcoin":
            generate_bitcoin(s_list);
            break;
    }
}

function sec_rand(count) {
    let min = (-count >>> 0) % count;
    let rand = new Uint32Array(1);
    const crypto = window.crypto || window.msCrypto;

    do {
        crypto.getRandomValues(rand);
    } while (rand[0] < min);

    return rand[0] % count;
}

function generate_pass(len, set, spaces) {
    let pass = "";
    let pass_arr = "";

    if (typeof set == "string") {
        pass_arr = set.split("");
    } else {
        pass_arr = set;
    }

    pass_arr = [...new Set(pass_arr)]; // enforce unique elements in array

    for (let i = len; i > 0; i--) {
        if (spaces) {
            pass += pass_arr[sec_rand(set.length)];
            pass += " ";
        } else {
            pass += pass_arr[sec_rand(set.length)];
        }
    }

    return pass.rtrim();
}

function generate_diceware(selection) {
    let pass = "";
    let wordlist = "";

    switch(selection) {
        case "Basque":
            wordlist = diceware_eu;
            break;
        case "Bulgarian":
            wordlist = diceware_bg;
            break;
        case "Catalan":
            wordlist = diceware_ca;
            break;
        case "Chinese":
            wordlist = diceware_cn;
            break;
        case "Czech":
            wordlist = diceware_cz;
            break;
        case "Danish":
            wordlist = diceware_da;
            break;
        case "Dutch":
            wordlist = diceware_nl;
            break;
        case "English":
            wordlist = diceware_en;
            break;
        case "English (Beale)":
            wordlist = diceware_beale;
            break;
        case "Esperanto":
            wordlist = diceware_eo;
            break;
        case "Estonian":
            wordlist = diceware_et;
            break;
        case "Finnish":
            wordlist = diceware_fi;
            break;
        case "French":
            wordlist = diceware_fr;
            break;
        case "German":
            wordlist = diceware_de;
            break;
        case "Hebrew":
            wordlist = diceware_iw;
            break;
        case "Hungarian":
            wordlist = diceware_hu;
            break;
        case "Italian":
            wordlist = diceware_it;
            break;
        case "Japanese":
            wordlist = diceware_jp;
            break;
        case "Latin":
            wordlist = diceware_la;
            break;
        case "Maori":
            wordlist = diceware_mi;
            break;
        case "Norwegian":
            wordlist = diceware_no;
            break;
        case "Polish":
            wordlist = diceware_pl;
            break;
        case "Portuguese":
            wordlist = diceware_pt;
            break;
        case "Romanian":
            wordlist = diceware_ro;
            break;
        case "Russian":
            wordlist = diceware_ru;
            break;
        case "Slovak":
            wordlist = diceware_sk;
            break;
        case "Slovenian":
            wordlist = diceware_sl;
            break;
        case "Spanish":
            wordlist = diceware_es;
            break;
        case "Swedish":
            wordlist = diceware_sv;
            break;
        case "Turkish":
            wordlist = diceware_tr;
            break;
    }

    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(wordlist.length));
    let pass_id = document.getElementById("diceware-pass");
    let pass_length = document.getElementById("diceware-length");
    let pass_entropy = document.getElementById("diceware-entropy");

    pass = generate_pass(len, wordlist, true);
    pass = pass.replace(/ /g,"-");
    pass_id.innerText = pass;
    pass_length.innerHTML = "<span>" + pass.length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function generate_eff(selection) {
    let pass = "";
    let wordlist = "";

    switch(selection) {
        case "Distant Words":
            wordlist = eff_distant;
            break;
        case "Short Words":
            wordlist = eff_short;
            break;
        case "Long Words":
            wordlist = eff_long;
            break;
        case "Game of Thrones":
            wordlist = eff_gameofthrones;
            break;
        case "Harry Potter":
            wordlist = eff_harrypotter;
            break;
        case "Star Trek":
            wordlist = eff_startrek;
            break;
        case "Star Wars":
            wordlist = eff_starwars;
            break;
    }

    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(wordlist.length));
    let pass_id = document.getElementById("eff-pass");
    let pass_length = document.getElementById("eff-length");
    let pass_entropy = document.getElementById("eff-entropy");

    pass = generate_pass(len, wordlist, true);
    pass = pass.replace(/ /g,"-");
    pass_id.innerText = pass;
    pass_length.innerHTML = "<span>" + pass.length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function generate_alternate(selection) {
    let pass = "";
    let wordlist = "";

    switch (selection) {
        case "Colors":
            return generate_colors();
        case "Elvish":
            wordlist = alternate_elvish;
            break;
        case "English (Deseret)":
            wordlist = alternate_deseret;
            break;
        case "English (Shavian)":
            wordlist = alternate_shavian;
            break;
        case "Klingon":
            wordlist = alternate_klingon;
            break;
        case "PGP":
            wordlist = alternate_pgp;
            break;
        case "RockYou":
            wordlist = alternate_rockyou;
            break;
        case "Simpsons":
            wordlist = alternate_simpsons;
            break;
        case "Trump":
            wordlist = alternate_trump;
            break;
    }

    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(wordlist.length));
    let pass_id = document.getElementById("alt-pass");
    let pass_length = document.getElementById("alt-length");
    let pass_entropy = document.getElementById("alt-entropy");

    pass = generate_pass(len, wordlist, true);
    pass = pass.replace(/ /g,"-");
    pass_id.innerText = pass;
    pass_length.innerHTML = "<span>" + [...pass].length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function is_too_dark(hex) {
    let rgb = parseInt(hex, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff;
    let l = (0.299 * r) + (0.587 * g) + (0.114 * b);

    if (l > 79) {
        return false;
    }

    return true;
}

function is_too_light(hex) {
    let rgb = parseInt(hex, 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >>  8) & 0xff;
    let b = (rgb >>  0) & 0xff;
    let l = (0.299 * r) + (0.587 * g) + (0.114 * b);

    if (l < 176) {
        return false;
    }

    return true;
}

function generate_colors() {
    let tmp = "";
    let total_len;
    let color_keys = Object.keys(alternate_colors);
    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(color_keys.length));
    let pass_id = document.getElementById("alt-pass");
    let pass_length = document.getElementById("alt-length");
    let pass_entropy = document.getElementById("alt-entropy");
    let pass = generate_pass(len, color_keys, true).split(" ");
    let chosen_theme = localStorage.theme;

    for (let i = 0; i < len; i++) {
        let hex = alternate_colors[pass[i]];

        if (chosen_theme === undefined || chosen_theme == "light") {
            if (is_too_light(hex)) {
                tmp += "<span class='bold light_contrast' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
            } else {
                tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
            }
        } else if (chosen_theme == "dark") {
            if (is_too_dark(hex)) {
                tmp += "<span class='bold dark_contrast' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
            } else {
                tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + "</span> ";
            }
        }
    }

    pass_id.innerHTML = tmp.replace(/> </g, ">-<").rtrim();
    tmp = "";

    for (let i = 0; i < len; i++) {
        tmp += pass[i];
    }

    pass = tmp;
    total_len = pass.length + (len - 1);
    pass_length.innerHTML = "<span>" + total_len + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(color_keys.length)) + "-bits.";
}

function generate_bitcoin(selection) {
    let pass = "";
    let wordlist = "";

    switch (selection) {
        case "Chinese (Simp)":
            wordlist = bitcoin_cn_simp;
            break;
        case "Chinese (Trad)":
            wordlist = bitcoin_cn_trad;
            break;
        case "Czech":
            wordlist = bitcoin_cz;
            break;
        case "English":
            wordlist = bitcoin_en;
            break;
        case "French":
            wordlist = bitcoin_fr;
            break;
        case "Italian":
            wordlist = bitcoin_it;
            break;
        case "Japanese":
            wordlist = bitcoin_jp;
            break;
        case "Korean":
            wordlist = bitcoin_kr;
            break;
        case "Spanish":
            wordlist = bitcoin_es;
            break;
    }

    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(wordlist.length));
    let pass_id = document.getElementById("btc-pass");
    let pass_length = document.getElementById("btc-length");
    let pass_entropy = document.getElementById("btc-entropy");

    pass = generate_pass(len, wordlist, true);
    pass = pass.replace(/ /g,"-");
    pass_id.innerText = pass;
    pass_length.innerHTML = "<span>" + pass.length + "</span>" + " characters.";
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(wordlist.length)) + "-bits.";
}

function generate_ninja() {
    let pass = "";
    let ninja = ["ka","zu","mi","te","ku","lu","ji","ri","ki","zu","me","ta","rin",
                 "to","mo","no","ke","shi","ari","chi","do","ru","mei","na","fu","zi"];
    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(ninja.length));

    for (let i = 0; i < len; i++) {
        pass += ninja[sec_rand(len)];

        if (i % 3 == 2 && i != len - 1) {
            pass += "-";
        }
    }

    return [pass, ninja.length, Math.floor(len * Math.log2(ninja.length))];
}

function generate_apple() {
    function _apple(n) {
        /*
            See the Twitter thread at https://twitter.com/AaronToponce/status/1131406726069084160 for full analysis.

            For n ≥ 1 blocks, the entropy in bits per block is:
                log2(
                    (6n-1) *    //  One lowercase alphabetic character is randomly capitalized
                    19^(4n-1) * //  The total possible combinations of consonants
                    6^(2n) *    //  The total possible combinations of vowels
                    10 * 2n     //  An "edge" character is a random digit
                )

            E.G.:
                DVccvc:                      log2( 5 * 19^3  * 6^2 * 10 * 2) ~=  24.558 bits
                cvCcvD-cvccvc:               log2(11 * 19^7  * 6^4 * 10 * 4) ~=  48.857 bits
                cvcCvc-Dvccvc-cvccvc:        log2(17 * 19^11 * 6^6 * 10 * 6) ~=  72.231 bits
                cvccVc-cvccvD-cvccvc-cvccvc: log2(23 * 19^15 * 6^8 * 10 * 8) ~=  95.244 bits
                et cetera, et cetera, et cetera.
        */
        return Math.floor(Math.log2((6*n-1) * 19**(4*n-1) * 6**(2*n) * 20 * n));
    }

    let pass = [];
    let digits = "0123456789";
    let vowels = "aeiouy";
    let consonants = "bcdfghjkmnpqrstvwxz";
    let entropy = get_entropy();
    let n = 1; // number of blocks

    while (_apple(n) <= entropy) {
        n++;
    }

    for (let i = 0; i < n; i++) {
        pass[6 * i]     = generate_pass(1, consonants);
        pass[6 * i + 1] = generate_pass(1, vowels);
        pass[6 * i + 2] = generate_pass(1, consonants);
        pass[6 * i + 3] = generate_pass(1, consonants);
        pass[6 * i + 4] = generate_pass(1, vowels);
        pass[6 * i + 5] = generate_pass(1, consonants);
    }

    let d_loc = 0;
    let c_loc = 0;
    let edge = sec_rand(2 * n); // [0, 2n)
    let digit = generate_pass(1, digits);

    if (edge % 2 == 0) {
        d_loc = 3 * edge;
    } else {
        d_loc = 3 * edge + 2;
    }

    pass[d_loc] = digit;

    do {
        c_loc = sec_rand(pass.length);
    } while (c_loc == d_loc);

    pass[c_loc] = pass[c_loc].toUpperCase();

    for (let i = n - 1; i > 0; i--) {
        pass.splice(6 * i, 0, "-");
    }

    return [pass.join(""), pass.length, _apple(n)];
}

function generate_babble() {
    let pass = [];
    let vowels = "aeiouy";
    let consonants = "bcdfghklmnprstvzx";
    let entropy = get_entropy();
    let v_ent = Math.log2(vowels.length);
    let c_ent = Math.log2(consonants.length);
    let out_ent = (2 * c_ent) + (2 * v_ent);
    let  in_ent = (3 * c_ent) + (2 * v_ent);

    entropy = entropy - (2 * out_ent);

    let len = Math.ceil(entropy / in_ent);
    let tot_ent = out_ent + (len * in_ent) + out_ent;

    for (let i = 0; i < len + 2; i++) {
        for (let j = 0; j < 5; j++) {
            if (j % 2 == 0) {
                pass[(5 * i) + j] = generate_pass(1, consonants);
            } else {
                pass[(5 * i) + j] = generate_pass(1, vowels);
            }
        }
    }

    pass[0] = "x";
    pass[pass.length - 1] = "x";

    for (let i = pass.length; i > 0; i -= 5) {
        pass.splice(i, 0, "-");
    }

    pass.pop(); // strip last "-"

    return [pass.join(""), (len + 2) * 5, Math.floor(tot_ent)];
}

function generate_kpop() {
    // 64 unique words = 6 bits of entropy per word
    let kpop = ["A","Ah","Bae","Bin","Bo","Choi","Chul","Da","Do","Dong","Eun","Gi","Gun","Ha","Hae","Hee",
                "Ho","Hu","Hwa","Hwan","Hye","Hyo","Hyun","Il","In","Ja","Jae","Ji","Jin","Jong","Joo","Joon",
                "Ju","Jun","Jung","Ki","Kun","Kyu","Lee","Mi","Min","Moon","Nam","Ok","Park","Rin","Seo","Seul",
                "Shi","Sik","So","Song","Soo","Su","Sun","Sung","Won","Woo","Ye","Yeon","Yoo","Yu","Yul","Yun"];
    let entropy = get_entropy();
    let len = Math.ceil(entropy / Math.log2(kpop.length));
    let pass = "";

    for (let i = 0; i < len; i++) {
        pass += kpop[sec_rand(len)];

        if (i % 2 == 1 && i != len - 1) {
            pass += "-";
        }
    }

    return [pass, kpop.length, Math.floor(len * Math.log2(kpop.length))];
}

function generate_pseudowords() {
    let ret = [];
    let pseudo = document.getElementById("pseudo-options").value;

    if (pseudo == "Apple, Inc.") {
        ret = generate_apple();
    } else if (pseudo == "Bubble Babble") {
        ret = generate_babble();
    } else if (pseudo == "Secret Ninja") {
        ret = generate_ninja();
    } else if (pseudo == "Korean K-pop") {
        ret = generate_kpop();
    }

    let pass = ret[0];
    let ent = ret[2];
    let pass_id = document.getElementById("pseudo-pass");
    let pass_length = document.getElementById("pseudo-length");
    let pass_entropy = document.getElementById("pseudo-entropy");

    pass_id.innerText = pass;
    pass_length.innerHTML = pass.length + " characters.";
    pass_entropy.innerHTML = "~" + ent + "-bits.";
}

function generate_random() {
    let s = "";
    let entropy = get_entropy();
    let pass_id = document.getElementById("random-pass");
    let pass_length = document.getElementById("random-length");
    let pass_entropy = document.getElementById("random-entropy");
    let option = document.getElementById("random-options").value;

    // ASCII optgroup
    if (option == "Base-94") {
        for (let i = 0; i < 94; i++) {
            s += String.fromCharCode(33 + i);
        }
    } else if (option == "Base-85") {
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+-;<=>?@^_`{|}~";
    } else if (option == "Base-64 (+/)") {
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
    } else if (option == "Base-64 (-_)") {
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    } else if (option == "Base-62") {
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    } else if (option == "Base-58 (Bitcoin)") {
        s = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    } else if (option == "Base-52") {
        s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    } else if (option == "Base-36") {
        s = "0123456789abcdefghijklmnopqrstuvwxyz";
    } else if (option == "Base-32") {
        s = "0123456789abcdefghjkmnpqrstvwxyz";
    } else if (option == "Base-26") {
        s = "abcdefghijklmnopqrstuvwxyz";
    } else if (option == "Base-16") {
        s = "0123456789abcdef";
    } else if (option == "Base-10") {
        s = "0123456789";
    } else if (option == "Base-8") {
        s = "01234567";
    } else if (option == "Base-2") {
        s = "01";
    } else if (option == "Coin Flips") {
        s = "HT";
    } else if (option == "DNA Sequence") {
        s = "ACGT";

    // Unicode optgroup
    } else if (option == "Base-256") {
        unicode_warn();

        s  = "ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿ";
        s += "ṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿ";
        s += "ẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾế";
        s += "ỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹỺỻỼỽỾỿ";
    } else if (option == "Base-256 (Braille)") {
        unicode_warn();

        // first character is not an ASCII space, but could still break lines
        s  = " ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿";
        s += "⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿";
        s += "⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿";
        s += "⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿";
    } else if (option == "Base-188 (ISO 8859-1)") {
        unicode_warn();

        for (let i = 0; i < 94; i++) {
            s += String.fromCharCode(33 + i);
        }
        for (let i = 0; i < 95; i++) {
            s += String.fromCharCode(161 + i);
        }

        s = s.replace(String.fromCharCode(173),""); // soft-hyphen isn't graphical
    } else if (option == "Emoji") {
        return generate_emoji();
    }

    let len = Math.ceil(entropy / Math.log2(s.length));
    let pass = generate_pass(len, s);

    pass_length.innerHTML = len + " characters.";
    pass_id.removeAttribute("style"); // from emoji
    pass_id.innerText = pass;
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(s.length)) + "-bits.";
}

function generate_emoji() {
    unicode_warn();

    let entropy = get_entropy();
    let pass_id = document.getElementById("random-pass");
    let pass_length = document.getElementById("random-length");
    let pass_entropy = document.getElementById("random-entropy");
    let len = Math.ceil(entropy / Math.log2(random_emoji.length));
    let pass = generate_pass(len, random_emoji);

    pass_length.innerHTML = len + " characters.";
    pass_id.style.fontFamily = "Emoji";
    pass_id.innerText = pass;
    pass_entropy.innerHTML = "~" + Math.floor(len * Math.log2(random_emoji.length)) + "-bits.";
}

// Dicekey functions
// I know that above, I'm using underscores as a separator, and here I'm using camelCase. I'll get around to a proper
// standard later. Right now, I'm just getting this into place.
function shuffleDice() {
    let chars = "ABCDEFGHIJKLMNOPRSTUVWXYZ".split("");
    for (let i=0; i<chars.length; i++) {
        let randInt = sec_rand(chars.length);
        let tmp = chars[randInt];
        chars[randInt] = chars[i];
        chars[i] = tmp;
    }
    return chars; // start with string, return array
}
function rotateDice() {
    for (let i=1; i<=25; i++) {
        let orientations = [];
        let cell = document.getElementById("cell" + i);
        let randInt = sec_rand(4);
        if (randInt === 1) {
            orientations.push("E");
            cell.classList.add("rotate90");
        }
        else if (randInt === 2) {
            orientations.push("S");
            cell.classList.add("rotate180");
        }
        else if (randInt === 3) {
            orientations.push("W");
            cell.classList.add("rotate270");
        }
        else orientations.push("N");
    }
}
function convertDecToBin(num) {
    let res = num.toString(2);
    return res.padStart(11, '0');
}
function opticalBits(res) {
    // black = 0, white = 1
    // [2^10, 2^9, 2^8, ..., 2^2, 2^1, 2^0]
    const topBits = {
        "A1":2002,"B1":1996,"C1":1946,"D1":1924,"E1":1954,"F1":1864,"G1":1878,"H1":1904,"I1":1844,"J1":1830,"K1":1846,"L1":1812,"M1":1798,"N1":1744,"O1":1762,"P1":1766,"R1":1698,"S1":1668,"T1":1710,"U1":1676,"V1":1694,"W1":1648,"X1":1622,"Y1":1642,"Z1":1656,
        "A2":2018,"B2":1926,"C2":1952,"D2":1968,"E2":1944,"F2":1892,"G2":1908,"H2":1884,"I2":1816,"J2":1820,"K2":1848,"L2":1818,"M2":1800,"N2":1778,"O2":1772,"P2":1768,"R2":1708,"S2":1674,"T2":1696,"U2":1666,"V2":1680,"W2":1604,"X2":1624,"Y2":1636,"Z2":1654,
        "A3":1984,"B3":1928,"C3":1938,"D3":1972,"E3":1942,"F3":1898,"G3":1870,"H3":1874,"I3":1814,"J3":1810,"K3":1794,"L3":1808,"M3":1842,"N3":1736,"O3":1750,"P3":1732,"R3":1678,"S3":1702,"T3":1690,"U3":1672,"V3":1706,"W3":1610,"X3":1634,"Y3":1608,"Z3":1612,
        "A4":2020,"B4":1932,"C4":1960,"D4":1934,"E4":1868,"F4":1872,"G4":1856,"H4":1896,"I4":1836,"J4":1840,"K4":1804,"L4":1822,"M4":1748,"N4":1734,"O4":1752,"P4":1738,"R4":1716,"S4":1704,"T4":1684,"U4":1670,"V4":1640,"W4":1614,"X4":1644,"Y4":1606,"Z4":1602,
        "A5":2004,"B5":1976,"C5":1958,"D5":1920,"E5":1912,"F5":1890,"G5":1866,"H5":1894,"I5":1826,"J5":1802,"K5":1824,"L5":1828,"M5":1760,"N5":1728,"O5":1746,"P5":1776,"R5":1722,"S5":1682,"T5":1720,"U5":1724,"V5":1618,"W5":1652,"X5":1630,"Y5":1660,"Z5":1646,
        "A6":1986,"B6":1940,"C6":1930,"D6":1964,"E6":1862,"F6":1880,"G6":1860,"H6":1850,"I6":1832,"J6":1796,"K6":1838,"L6":1834,"M6":1764,"N6":1742,"O6":1756,"P6":1688,"R6":1712,"S6":1692,"T6":1718,"U6":1714,"V6":1628,"W6":1658,"X6":1616,"Y6":1650,"Z6":1632
    };
    const bottomBits = {
        "A1":1038,"B1":1086,"C1":1114,"D1":1130,"E1":1146,"F1":1174,"G1":1190,"H1":1206,"I1":1222,"J1":1234,"K1":1248,"L1":1260,"M1":1272,"N1":1302,"O1":1320,"P1":1332,"R1":1348,"S1":1364,"T1":1376,"U1":1388,"V1":1400,"W1":1416,"X1":1432,"Y1":1444,"Z1":1456,
        "A2":1046,"B2":1100,"C2":1116,"D2":1134,"E2":1148,"F2":1176,"G2":1194,"H2":1208,"I2":1224,"J2":1236,"K2":1250,"L2":1262,"M2":1274,"N2":1306,"O2":1322,"P2":1334,"R2":1350,"S2":1366,"T2":1378,"U2":1390,"V2":1402,"W2":1420,"X2":1434,"Y2":1446,"Z2":1458,
        "A3":1050,"B3":1102,"C3":1122,"D3":1138,"E3":1150,"F3":1178,"G3":1196,"H3":1210,"I3":1226,"J3":1238,"K3":1252,"L3":1264,"M3":1276,"N3":1308,"O3":1324,"P3":1336,"R3":1354,"S3":1368,"T3":1380,"U3":1392,"V3":1404,"W3":1422,"X3":1436,"Y3":1448,"Z3":1460,
        "A4":1068,"B4":1106,"C4":1124,"D4":1140,"E4":1162,"F4":1180,"G4":1198,"H4":1212,"I4":1228,"J4":1242,"K4":1254,"L4":1266,"M4":1290,"N4":1310,"O4":1326,"P4":1338,"R4":1356,"S4":1370,"T4":1382,"U4":1394,"V4":1410,"W4":1426,"X4":1438,"Y4":1450,"Z4":1462,
        "A5":1076,"B5":1110,"C5":1126,"D5":1142,"E5":1166,"F5":1186,"G5":1200,"H5":1214,"I5":1230,"J5":1244,"K5":1256,"L5":1268,"M5":1294,"N5":1316,"O5":1328,"P5":1340,"R5":1358,"S5":1372,"T5":1384,"U5":1396,"V5":1412,"W5":1428,"X5":1440,"Y5":1452,"Z5":1464,
        "A6":1084,"B6":1112,"C6":1128,"D6":1144,"E6":1172,"F6":1188,"G6":1202,"H6":1220,"I6":1232,"J6":1246,"K6":1258,"L6":1270,"M6":1298,"N6":1318,"O6":1330,"P6":1346,"R6":1360,"S6":1374,"T6":1386,"U6":1398,"V6":1414,"W6":1430,"X6":1442,"Y6":1454,"Z6":1466
    };
    return [topBits[res], bottomBits[res]];
}
function generatePixels(bitString) {
    let divs = "";
    for (let i=0; i<11; i++) {
        if (bitString[i] == "0") divs += '<div class="black bit"></div>';
        else divs += '<div class="white bit"></div>';
    }
    return divs;
}
function populateCells() {
    let diceArray = shuffleDice();
    for (let i=1; i<=25; i++) {
        let cell = document.getElementById("cell" + i);
        let die = diceArray[i-1];
        let side = sec_rand(6) + 1;
        let res = die + side;

        let topBits = opticalBits(res)[0];
        let topDivs = generatePixels(convertDecToBin(topBits));
        let topDiv = document.createElement("div");
        topDiv.className = "bits";
        topDiv.innerHTML = topDivs;
        cell.appendChild(topDiv);

        let face = document.createElement("div");
        face.className = "text flex";
        face.innerText = res;
        cell.appendChild(face);

        let bottomBits = opticalBits(res)[1];
        let bottomDivs = generatePixels(convertDecToBin(bottomBits));
        let bottomDiv = document.createElement("div");
        bottomDiv.className = "bits";
        bottomDiv.innerHTML = bottomDivs;
        cell.appendChild(bottomDiv);
    }
    rotateDice();
}
function resetCells() {
    for (let i=1; i<=25; i++) {
        let cell = document.getElementById("cell" + i);
        cell.className = "tableCell";
        for (let i=2; i>=0; i--) cell.removeChild(cell.childNodes[i]);
    }
}
function getDiceKey() {
    let orientation = "";
    let dice = [];
    let dicekey = "";
    for (let i=1; i<=25; i++) {
        let cell = document.getElementById("cell" + i);
        if (cell.classList.contains("rotate90")) orientation = "E";
        else if (cell.classList.contains("rotate180")) orientation = "S";
        else if (cell.classList.contains("rotate270")) orientation = "W";
        else orientation = "N";
        dicekey += cell.children[1].innerText;
        dicekey += orientation;
        if (i < 25) dicekey += " ";
    }
    console.clear();
    console.log(dicekey);
}
