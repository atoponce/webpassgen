# Web-based Password Generator
This is a simple web-based password generator which uses 6-different styles
of passwords that can fit personal preferences, or restrictions from
websites that require the password in a certain format.

Everything is calculated in JavaScript locally, and the passwords are not
sent to the server for logging. You should be able to download this code,
and run it offline, if you're truly paranoid.

## Desktop Screenshots
<table style="border-collapse: collapse; border: 1px solid black;">
<tr><td style="border: 1px solid black;">
<img alt="Light theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/102729250-304d8080-42ed-11eb-8559-56da890f1688.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/102729248-2fb4ea00-42ed-11eb-9a3b-437bd16ce8fb.png" />
</td></tr></table>

## Mobile-Friendly Screenshots
<table style="border-collapse: collapse; border: 1px solid black;">
<tr><td style="border: 1px solid black;">
<img alt="Light theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/102729253-317ead80-42ed-11eb-88d2-36b94480255d.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/102729252-30e61700-42ed-11eb-8f08-73d07c752fcb.png" />
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
|  9 | EL  | Greek      | 7,776  |      |      |  ✔️   |     |                                                 |
| 10 | EN  | English    |  var.  |  ✔️   |  ✔️   |  ✔️   |  ✔️  |                                                 |
| 11 | EO  | Esperanto  | 7,776  |      |      |  ✔️   |     |                                                 |
| 12 | ES  | Spanish    |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 13 | ET  | Estonian   | 7,776  |      |      |  ✔️   |     |                                                 |
| 14 | EU  | Basque     | 7,776  |      |      |  ✔️   |     |                                                 |
| 15 | FI  | Finnish    | 7,776  |      |      |  ✔️   |     |                                                 |
| 16 | FR  | French     |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 17 | HU  | Hungarian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 18 | IT  | Italian    |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 19 | IW  | Hebrew     | 7,776  |      |      |  ✔️   |     |                                                 |
| 20 | JP  | Japanese   |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 21 | KO  | Korean     | 2,048  |      |  ✔️   |      |     |                                                 |
| 22 | LA  | Latin      | 7,776  |      |      |  ✔️   |     |                                                 |
| 23 | MI  | Maori      | 7,776  |      |      |  ✔️   |     |                                                 |
| 24 | NL  | Dutch      | 7,776  |      |      |  ✔️   |     | Alternate composite                             |
| 25 | NO  | Norwegian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 26 | PL  | Polish     | 7,776  |      |      |  ✔️   |     |                                                 |
| 27 | PT  | Portuguese |  var.  |      |  ✔️   |  ✔️   |     |                                                 |
| 28 | RO  | Romanian   | 7,776  |      |      |  ✔️   |     |                                                 |
| 29 | RU  | Russian    | 7,776  |      |      |  ✔️   |     |                                                 |
| 30 | SK  | Slovak     | 7,776  |      |      |  ✔️   |     |                                                 |
| 31 | SL  | Slovenian  | 7,776  |      |      |  ✔️   |     |                                                 |
| 32 | SV  | Swedish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a".              |
| 33 | TR  | Turkish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a".              |

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

| ID  | Name    | Wordlist | Unique | Notes                                        |
|:---:|:--------|:---------|:------:|:---------------------------------------------|
| 12a | Spanish | Bitcoin  | 2,048  |                                              |
| 12b | Spanish | Diceware | 7,776  |  7,773 unique at first. Added ", "", and """ |

Here is the French breakdown:

| ID  | Name   | Wordlist | Unique | Notes                         |
|:---:|:-------|:---------|:------:|:------------------------------|
| 16a | French | Bitcoin  | 2,048  |                               |
| 16b | French | Diceware | 7,776  |                               |

Here is the Italian breakdown:

| ID  | Name    | Wordlist | Unique | Notes                         |
|:---:|:--------|:---------|:------:|:------------------------------|
| 18a | Italian | Bitcoin  | 2,048  |                               |
| 18b | Italian | Diceware | 7,776  |                               |

Here is the Japanese breakdown:

| ID  | Name     | Wordlist | Unique | Notes                         |
|:---:|:---------|:---------|:------:|:------------------------------|
| 20a | Japanese | Bitcoin  | 2,048  |                               |
| 20b | Japanese | Diceware | 7,776  |                               |

Here is the Portuguese breakdown:

| ID  | Name       | Wordlist | Unique | Notes                         |
|:---:|:-----------|:---------|:------:|:------------------------------|
| 27a | Portuguese | Bitcoin  | 2,048  |                               |
| 27b | Portuguese | Diceware | 7,776  |                               |
