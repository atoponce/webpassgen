# Web-based Password Generator
This is a simple web-based password generator which uses 6-different styles
of passwords that can fit personal preferences, or restrictions from
websites that require the password in a certain format.

Everything is calculated in JavaScript locally, and the passwords are not
sent to the server for logging. You should be able to download this code,
and run it offline, if you're truly paranoid.

## Desktop Screenshots
<table style="border-collapse: collapse; border: 1px solid black;"><tr><td style="border: 1px solid black;">
<img alt="Light theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/58374448-a44e5980-7efb-11e9-93f8-46b20237b7ca.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/58374449-a44e5980-7efb-11e9-985a-76048f3ddd8a.png" />
</td></tr></table>


## Mobile-Friendly Screenshots
<table style="border-collapse: collapse; border: 1px solid black;"><tr><td style="border: 1px solid black;">
<img alt="First light theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/58374450-a44e5980-7efb-11e9-99e7-1120f8981cd2.png" />
</td><td style="border: 1px solid black;">
<img alt="Second light theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/58374451-a4e6f000-7efb-11e9-9ee5-2dc0bc4560cc.png" />
</td><td style="border: 1px solid black;">
<img alt="First dark theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/58374452-a4e6f000-7efb-11e9-8d45-2c86947946ab.png" />
</td><td style="border: 1px solid black;">
<img alt="Second dark theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/58374453-a4e6f000-7efb-11e9-922f-7874b593f32d.png" />
</td></tr></table>

## Supported Languages
Here is the full breakdown of language support across the passphrase generators:

| ID | Iso | Language   | Unique | Alt. | Bit. | Dice | EFF | Notes                                           |
|:--:|:---:|:-----------|:------:|:----:|:----:|:----:|:---:|:------------------------------------------------|
|  1 | --  | Elvish     | 7,776  |  ✔️   |      |      |     |                                                 |
|  2 | --  | Klingon    | 2,604  |  ✔️   |      |      |     |                                                 |
|  3 | BG  | Bulgarian  | 7,596  |      |      |  ✔️   |     | https://github.com/atoponce/webpassgen/issues/4 |
|  4 | CA  | Catalan    | 7,776  |      |      |  ✔️   |     |                                                 |
|  5 | CN  | Chinese    |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
|  6 | CZ  | Czech      |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
|  7 | DA  | Danish     | 7,776  |      |      |  ✔️   |     |                                                 |
|  8 | DE  | German     | 7,776  |      |      |  ✔️   |     |                                                 |
|  9 | EN  | English    |  var.  |  ✔️   |  ✔️   |  ✔️   |  ✔️  |                                                 |
| 10 | EO  | Esperanto  | 7,776  |      |      |  ✔️   |     |                                                 |
| 11 | ES  | Spanish    |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 12 | ET  | Estonian   | 7,776  |      |      |  ✔️   |     |                                                 |
| 13 | EU  | Basque     | 7,776  |      |      |  ✔️   |     |                                                 |
| 14 | FI  | Finnish    | 7,776  |      |      |  ✔️   |     |                                                 |
| 15 | FR  | French     |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 16 | HU  | Hungarian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 17 | IT  | Italian    |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 18 | IW  | Hebrew     | 7,776  |      |      |  ✔️   |     |                                                 |
| 19 | JP  | Japanese   |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 20 | KO  | Korean     | 2,048  |      |  ✔️   |      |     |                                                 |
| 21 | LA  | Latin      | 7,776  |      |      |  ✔️   |     |                                                 |
| 22 | MI  | Maori      | 7,776  |      |      |  ✔️   |     |                                                 |
| 23 | NL  | Dutch      | 7,776  |      |      |  ✔️   |     | Alternate composite                             |
| 24 | NO  | Norwegian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 25 | PL  | Polish     | 7,776  |      |      |  ✔️   |     |                                                 |
| 26 | PT  | Portuguese | 7,776  |      |      |  ✔️   |     |                                                 |
| 27 | RO  | Romanian   | 7,776  |      |      |  ✔️   |     |                                                 |
| 28 | RU  | Russian    | 7,776  |      |      |  ✔️   |     |                                                 |
| 29 | SK  | Slovak     | 7,776  |      |      |  ✔️   |     |                                                 |
| 30 | SL  | Slovenian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 31 | SV  | Swedish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a".              |
| 32 | TR  | Turkish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a".              |

Here is the Chinese breakdown:

| ID | Name            | Wordlist  | Unique | Notes                         |
|:--:|:----------------|:----------|:------:|:------------------------------|
| 5a | Chinese (Simp.) | Bitcoin   | 2,048  |                               |
| 5b | Chinese (Trad.) | Bitcoin   | 2,048  |                               |
| 5c | Chinese         | Diceware  | 8,192  | Pinyin 8k word list           |

Here is the Czech breakdown:

| ID | Name            | Wordlist  | Unique | Notes                         |
|:--:|:----------------|:----------|:------:|:------------------------------|
| 6a | Czech           | Bitcoin   | 2,048  |                               |
| 6b | Czech           | Diceware  | 7,776  |                               |

Here is the English breakdown:

| ID | Name            | Wordlist  | Unique | Notes                         |
|:--:|:----------------|:----------|:------:|:------------------------------|
| 9a | Colors          | Alternate | 1,029  | More available in the project |
| 9b | Deseret         | Alternate | 7,776  | Alternate English alphabet    |
| 9c | Distant         | EFF       | 1,296  |                               |
| 9d | English         | Bitcoin   | 2,048  |                               |
| 9e | English         | Diceware  | 8,192  | 8k word list                  |
| 9f | English (Beale) | Diceware  | 7,776  |                               |
| 9g | Game of Thrones | EFF       | 4,000  | Unofficial                    |
| 9h | Harry Potter    | EFF       | 4,000  | Unofficial                    |
| 9i | Long            | EFF       | 1,296  |                               |
| 9j | PGP             | Alternate |   512  |                               |
| 9k | Short           | EFF       | 1,296  |                               |
| 9l | Shavian         | Alternate | 7,776  | Alternate English alphabet    |
| 9m | Simpsons        | Alternate | 5,000  | From Peerio                   |
| 9n | Star Trek       | EFF       | 4,000  | Unofficial                    |
| 9o | Star Wars       | EFF       | 4,000  | Unofficial                    |
| 9p | Trump           | Alternate | 8,192  | From his Twitter account      |

Here is the Spanish breakdown:

| ID  | Name            | Wordlist  | Unique | Notes                                        |
|:---:|:----------------|:----------|:------:|:---------------------------------------------|
| 11a | Spanish         | Bitcoin   | 2,048  |                                              |
| 11b | Spanish         | Diceware  | 7,776  |  7,773 unique at first. Added ", "", and """ |

Here is the French breakdown:

| ID  | Name            | Wordlist  | Unique | Notes                         |
|:---:|:----------------|:----------|:------:|:------------------------------|
| 15a | French          | Bitcoin   | 2,048  |                               |
| 15b | French          | Diceware  | 7,776  |                               |

Here is the Italian breakdown:

| ID  | Name            | Wordlist  | Unique | Notes                         |
|:---:|:----------------|:----------|:------:|:------------------------------|
| 17a | Italian         | Bitcoin   | 2,048  |                               |
| 17b | Italian         | Diceware  | 7,776  |                               |

Here is the Japanese breakdown:

| ID  | Name            | Wordlist  | Unique | Notes                         |
|:---:|:----------------|:----------|:------:|:------------------------------|
| 19a | Japanese        | Bitcoin   | 2,048  |                               |
| 19b | Japanese        | Diceware  | 7,776  |                               |
