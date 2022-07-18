# Web-based Password Generator
This is a simple web-based password generator which uses 6-different styles
of passwords that can fit personal preferences, or restrictions from
websites that require the password in a certain format.

Everything is calculated in JavaScript locally, and the passwords are not
sent to the server for logging. You should be able to download this code,
and run it offline, if you're truly paranoid.

The project takes advantage of `localStorage` to save state across browser
sessions. This is needed to keep track of which security level you prefer when
generating and passwords, and if using the mouse entropy generator, saving the
debiased true random data. `localStorage` is not a cookie and is never
communicated with a web server.

## Desktop Screenshots
<table style="border-collapse: collapse; border: 1px solid black;">
<tr><td style="border: 1px solid black;">
<img alt="Desktop main generator screenshot" src="https://user-images.githubusercontent.com/699572/179521747-ea497985-a083-4744-985c-23a418a6a414.png" />
</td><td style="border: 1px solid black;">
<img alt="Desktop mouse entropy screenshot" src="https://user-images.githubusercontent.com/699572/127556854-71a053ec-5b91-4cce-aa61-7bf9c6e0860b.png" />
</td></tr></table>

## Mobile-Friendly Screenshots
<table style="border-collapse: collapse; border: 1px solid black;">
<tr><td style="border: 1px solid black;">
<img alt="Light theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/179523336-3dc18856-18c1-4c4e-ba43-f159689e04d7.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/179523337-f6f3cc5a-f48f-4274-94f8-de48fe1be3f4.png" />
</td></tr></table>

## Supported Languages
Here is the full breakdown of language support across the passphrase generators:

| ID | ISO | Language   | Unique | Alt. | Bit. | Mon. | Dice | EFF | Notes                              |
|:--:|:---:|:-----------|:------:|:----:|:----:|:----:|:----:|:---:|:-----------------------------------|
|  1 | --  | Elvish     | 7,776  |  ✔️   |      |      |      |     |                                    |
|  2 | --  | Klingon    | 2,604  |  ✔️   |      |      |      |     |                                    |
|  3 | AF  | Afrikaans  | 6,567  |  ✔️   |      |      |      |     |                                    | 
|  4 | BE  | Belrusian  | 5,676  |  ✔️   |      |      |      |     |                                    | 
|  5 | BG  | Bulgarian  | 7,776  |      |      |      |  ✔️   |     | List by Assen Vassilev             |
|  6 | CA  | Catalan    | 7,776  |      |      |      |  ✔️   |     |                                    |
|  7 | CN  | Chinese    |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
|  8 | CZ  | Czech      |  var.  |      |  ✔️   |      |  ✔️   |     |                                    |
|  9 | DA  | Danish     | 7,776  |      |      |      |  ✔️   |     |                                    |
| 10 | DE  | German     | 1,626  |      |      |  ✔️   |  ✔️   |     |                                    |
| 11 | EL  | Greek      | 7,776  |      |      |      |  ✔️   |     |                                    |
| 12 | EN  | English    |  var.  |  ✔️   |  ✔️   |  ✔️   |  ✔️   |  ✔️  |                                    |
| 13 | EO  | Esperanto  |  var.  |      |      |  ✔️   |  ✔️   |     |                                    |
| 14 | ES  | Spanish    |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
| 15 | ET  | Estonian   | 7,776  |      |      |      |  ✔️   |     |                                    |
| 16 | EU  | Basque     | 7,776  |      |      |      |  ✔️   |     |                                    |
| 17 | FI  | Finnish    | 7,776  |      |      |      |  ✔️   |     |                                    |
| 18 | FR  | French     |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
| 19 | HR  | Croatian   | 9,204  |  ✔️   |      |      |      |     |                                    | 
| 20 | HU  | Hungarian  | 7,776  |      |      |      |  ✔️   |     |                                    |
| 21 | IT  | Italian    |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
| 22 | IW  | Hebrew     | 7,776  |      |      |      |  ✔️   |     |                                    |
| 23 | JBO | Lojban     | 1,626  |      |      |  ✔️   |      |     |                                    |
| 24 | JP  | Japanese   |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
| 25 | KO  | Korean     | 2,048  |      |  ✔️   |      |      |     |                                    |
| 26 | LA  | Latin      | 7,776  |      |      |      |  ✔️   |     |                                    |
| 27 | MI  | Maori      | 7,776  |      |      |      |  ✔️   |     |                                    |
| 28 | MN  | Mongolian  | 4,124  |  ✔️   |      |      |      |     |                                    | 
| 29 | NL  | Dutch      |  var.  |      |      |  ✔️   |  ✔️   |     | Alternate composite                |
| 30 | NO  | Norwegian  | 7,776  |      |      |      |  ✔️   |     |                                    |
| 31 | PL  | Polish     | 7,776  |      |      |      |  ✔️   |     |                                    |
| 32 | PT  | Portuguese |  var.  |      |  ✔️   |  ✔️   |  ✔️   |     |                                    |
| 33 | RO  | Romanian   | 7,776  |      |      |      |  ✔️   |     |                                    |
| 34 | RU  | Russian    |  var.  |      |      |  ✔️   |  ✔️   |     |                                    |
| 35 | SK  | Slovak     | 7,776  |      |      |      |  ✔️   |     |                                    |
| 36 | SL  | Slovenian  | 7,776  |      |      |      |  ✔️   |     |                                    |
| 37 | SR  | Serbian    | 8,670  |  ✔️   |      |      |      |     |                                    | 
| 38 | SV  | Swedish    | 7,776  |      |      |      |  ✔️   |     | 7,775 unique at first. Added "2a". |
| 39 | TR  | Turkish    | 7,776  |      |      |      |  ✔️   |     | 7,775 unique at first. Added "2a". |
| 40 | UK  | Ukranian   | 7,000  |  ✔️   |      |      |      |     |                                    | 

Here is the Chinese breakdown:

| ID | Name            | Wordlist  | Unique | Notes                         |
|:--:|:----------------|:----------|:------:|:------------------------------|
| 7a | Chinese (Simp.) | Bitcoin   | 2,048  |                               |
| 7b | Chinese (Trad.) | Bitcoin   | 2,048  |                               |
| 7c | Chinese         | Diceware  | 8,192  | Pinyin 8k word list           |
| 7d | Chinese         | Monero    | 1,626  |                               |

Here is the Czech breakdown:

| ID | Name            | Wordlist  | Unique | Notes                         |
|:--:|:----------------|:----------|:------:|:------------------------------|
| 8a | Czech           | Bitcoin   | 2,048  |                               |
| 8b | Czech           | Diceware  | 7,776  |                               |
| 8c | Czech           | Monero    | 1,626  |                               |

Here is the English breakdown:

| ID  | Name            | Wordlist  | Unique | Notes                         |
|:---:|:----------------|:----------|:------:|:------------------------------|
| 12a | Colors          | Alternate | 1,029  | More available in the project |
| 12b | Deseret         | Alternate | 7,776  | Alternate English alphabet    |
| 12c | Distant         | EFF       | 1,296  |                               |
| 12d | English         | Bitcoin   | 2,048  |                               |
| 12e | English         | Diceware  | 8,192  | 8k word list                  |
| 12f | English         | Monero    | 1,626  |                               |
| 12g | English (Beale) | Diceware  | 7,776  |                               |
| 12h | English (NLP)   | Diceware  | 9,072  | 1,296 adjectives, 7,776 nouns |
| 12i | Game of Thrones | EFF       | 4,000  | Unofficial                    |
| 12j | Harry Potter    | EFF       | 4,000  | Unofficial                    |
| 12k | Long            | EFF       | 1,296  |                               |
| 12l | PGP             | Alternate |   512  |                               |
| 12m | Short           | EFF       | 1,296  |                               |
| 12n | Shavian         | Alternate | 7,776  | Alternate English alphabet    |
| 12o | Simpsons        | Alternate | 5,000  | From Peerio                   |
| 12p | Star Trek       | EFF       | 4,000  | Unofficial                    |
| 12q | Star Wars       | EFF       | 4,000  | Unofficial                    |
| 12r | Trump           | Alternate | 8,192  | From his Twitter account      |
| 12s | Wordle          | Alternate | 5,790  | See comment in word list      |

Here is the Spanish breakdown:

| ID  | Name    | Wordlist | Unique | Notes                                       |
|:---:|:--------|:---------|:------:|:--------------------------------------------|
| 14a | Spanish | Bitcoin  | 2,048  |                                             |
| 14b | Spanish | Diceware | 7,776  | 7,773 unique at first. Added ", "", and """ |
| 14c | Spanish | Monero   | 1,626  |                                             |

Here is the French breakdown:

| ID  | Name   | Wordlist | Unique | Notes                         |
|:---:|:-------|:---------|:------:|:------------------------------|
| 18a | French | Bitcoin  | 2,048  |                               |
| 18b | French | Diceware | 7,776  |                               |
| 18b | French | Monero   | 1,626  |                               |

Here is the Italian breakdown:

| ID  | Name    | Wordlist | Unique | Notes                         |
|:---:|:--------|:---------|:------:|:------------------------------|
| 21a | Italian | Bitcoin  | 2,048  |                               |
| 21b | Italian | Diceware | 7,776  |                               |
| 21c | Italian | Monero   | 1,626  |                               |

Here is the Japanese breakdown:

| ID  | Name     | Wordlist | Unique | Notes                         |
|:---:|:---------|:---------|:------:|:------------------------------|
| 24a | Japanese | Bitcoin  | 2,048  |                               |
| 24b | Japanese | Diceware | 7,776  |                               |
| 24c | Japanese | Monero   | 1,626  |                               |

Here is the Portuguese breakdown:

| ID  | Name       | Wordlist | Unique | Notes                         |
|:---:|:-----------|:---------|:------:|:------------------------------|
| 32a | Portuguese | Bitcoin  | 2,048  |                               |
| 32b | Portuguese | Diceware | 7,776  |                               |
| 32c | Portuguese | Moneroo  | 1,626  |                               |

Here is the Russian breakdown:

| ID  | Name    | Wordlist | Unique | Notes                         |
|:---:|:--------|:---------|:------:|:------------------------------|
| 34a | Russian | Diceware | 7,776  |                               |
| 34b | Russian | Moneroo  | 1,626  |                               |
