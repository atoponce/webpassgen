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
<img alt="Light theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/127556853-20914ceb-ea69-419a-8c52-10c33db7064b.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme desktop screenshot" src="https://user-images.githubusercontent.com/699572/127556854-71a053ec-5b91-4cce-aa61-7bf9c6e0860b.png" />
</td></tr></table>

## Mobile-Friendly Screenshots
<table style="border-collapse: collapse; border: 1px solid black;">
<tr><td style="border: 1px solid black;">
<img alt="Light theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/127557629-d80af7a3-3fc8-44cc-8c6f-f3f1d08ba424.png" />
</td><td style="border: 1px solid black;">
<img alt="Dark theme mobile screenshot" src="https://user-images.githubusercontent.com/699572/127557630-18b5d92d-2574-45eb-8d65-f0120ddc2f50.png" />
</td></tr></table>

## Supported Languages
Here is the full breakdown of language support across the passphrase generators:

| ID | ISO | Language   | Unique | Alt. | Bit. | Dice | EFF | Notes                              |
|:--:|:---:|:-----------|:------:|:----:|:----:|:----:|:---:|:-----------------------------------|
|  1 | --  | Elvish     | 7,776  |  ✔️   |      |      |     |                                    |
|  2 | --  | Klingon    | 2,604  |  ✔️   |      |      |     |                                    |
| 34 | AF  | Afrikaans  | 6,567  |  ✔️   |      |      |     |                                    | 
| 35 | BE  | Belrusian  | 5,676  |  ✔️   |      |      |     |                                    | 
|  3 | BG  | Bulgarian  | 7,775  |      |      |  ✔️   |     |                                    |
|  4 | CA  | Catalan    | 7,776  |      |      |  ✔️   |     |                                    |
|  5 | CN  | Chinese    |  var.  |      |  ✔️   |  ✔️   |     |                                    |
|  6 | CZ  | Czech      |  var.  |      |  ✔️   |  ✔️   |     |                                    |
|  7 | DA  | Danish     | 7,776  |      |      |  ✔️   |     |                                    |
|  8 | DE  | German     | 7,776  |      |      |  ✔️   |     |                                    |
|  9 | EL  | Greek      | 7,776  |      |      |  ✔️   |     |                                    |
| 10 | EN  | English    |  var.  |  ✔️   |  ✔️   |  ✔️   |  ✔️  |                                    |
| 11 | EO  | Esperanto  | 7,776  |      |      |  ✔️   |     |                                    |
| 12 | ES  | Spanish    |  var.  |      |  ✔️   |  ✔️   |     |                                    |
| 13 | ET  | Estonian   | 7,776  |      |      |  ✔️   |     |                                    |
| 14 | EU  | Basque     | 7,776  |      |      |  ✔️   |     |                                    |
| 15 | FI  | Finnish    | 7,776  |      |      |  ✔️   |     |                                    |
| 16 | FR  | French     |  var.  |      |  ✔️   |  ✔️   |     |                                    |
| 36 | HR  | Croatian   | 9,204  |  ✔️   |      |      |     |                                    | 
| 17 | HU  | Hungarian  | 7,776  |      |      |  ✔️   |     |                                    |
| 18 | IT  | Italian    |  var.  |      |  ✔️   |  ✔️   |     |                                    |
| 19 | IW  | Hebrew     | 7,776  |      |      |  ✔️   |     |                                    |
| 20 | JP  | Japanese   |  var.  |      |  ✔️   |  ✔️   |     |                                    |
| 21 | KO  | Korean     | 2,048  |      |  ✔️   |      |     |                                    |
| 22 | LA  | Latin      | 7,776  |      |      |  ✔️   |     |                                    |
| 23 | MI  | Maori      | 7,776  |      |      |  ✔️   |     |                                    |
| 37 | MN  | Mongolian  | 4,124  |  ✔️   |      |      |     |                                    | 
| 24 | NL  | Dutch      | 7,776  |      |      |  ✔️   |     | Alternate composite                |
| 25 | NO  | Norwegian  | 7,776  |      |      |  ✔️   |     |                                    |
| 26 | PL  | Polish     | 7,776  |      |      |  ✔️   |     |                                    |
| 27 | PT  | Portuguese |  var.  |      |  ✔️   |  ✔️   |     |                                    |
| 28 | RO  | Romanian   | 7,776  |      |      |  ✔️   |     |                                    |
| 29 | RU  | Russian    | 7,776  |      |      |  ✔️   |     |                                    |
| 30 | SK  | Slovak     | 7,776  |      |      |  ✔️   |     |                                    |
| 31 | SL  | Slovenian  | 7,776  |      |      |  ✔️   |     |                                    |
| 38 | SR  | Serbian    | 8,670  |  ✔️   |      |      |     |                                    | 
| 32 | SV  | Swedish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a". |
| 33 | TR  | Turkish    | 7,776  |      |      |  ✔️   |     | 7,775 unique at first. Added "2a". |
| 39 | UK  | Ukranian   | 7,000  |  ✔️   |      |      |     |                                    | 

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
| 9f | English (NLP)   | Diceware  |  var.  | 1,296 adjectives, 7,776 nouns |
| 9h | Game of Thrones | EFF       | 4,000  | Unofficial                    |
| 9i | Harry Potter    | EFF       | 4,000  | Unofficial                    |
| 9j | Long            | EFF       | 1,296  |                               |
| 9k | PGP             | Alternate |   512  |                               |
| 9l | Short           | EFF       | 1,296  |                               |
| 9m | Shavian         | Alternate | 7,776  | Alternate English alphabet    |
| 9n | Simpsons        | Alternate | 5,000  | From Peerio                   |
| 9o | Star Trek       | EFF       | 4,000  | Unofficial                    |
| 9p | Star Wars       | EFF       | 4,000  | Unofficial                    |
| 9q | Trump           | Alternate | 8,192  | From his Twitter account      |

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
