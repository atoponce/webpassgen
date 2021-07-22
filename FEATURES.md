# Features
This password generator project consists of three families of generators:

1. Passphrases
2. Pseudowords (memorable or pronounceable)
3. Random meaningless strings

Random meaningless strings are the gold standard, and a common homework assignment problem by many
computer science teacher in college or university. They great for density, and when coupled with a
password manager, only need to be copied and pasted without concern about recalling it or needing to
type it out. However, they can be cumbersome when needing to type it out, such as when in a
data center or on a mobile device. However, they'll generally meet stringent password strength
requirements, and they're generally short with high security per character.

Passphrases are tried and true, and a favorite of many. Unfortunately, some of the word lists the
passphrases are based on are not organized very well, so homonyms, plurals, and other concerns
arise, in addition to usually being subject or noun heavy. Some word lists, like those provided by
the EFF or Bitcoin have more attention placed on such concerns, and usually provide higher quality
lists. Word lists like those provided by "Simpsons" or "Trump" are based on sources of natural
speaking, so they tend to have a better balance in nouns, adjectives, verbs, etc.

Pseudowords sit between random meaningless strings and passphrases to provide a balance of density
and memorability without complexity. Pseudowords generally try to be pronounceable by alternating
consonant and vowel letters. Unfortunately, the pseudowords are usually non-words, and even though
they might be pronounceable, they are probably still meaningless. Other pseudowords try to be more
memorable rather than pronounceable, such as "Letterblock Diceware" which uses bigram weighting to
generate the string. Regardless, they attempt to "meet in the middle" between the density and
complexity of random meaningless strings, and the convenience of being pronounceable, ease of typing
on the keyboard, and memorability of passphrases.

Those three families of generators are broken down into six general categories:

1. Alternate: A selection of different approaches to passphrase generation.
2. Bitcoin: All [officially defined][1] BIP 0039 language word lists.
3. Diceware: All [officially defined][2] word lists.
4. EFF: The [official lists][3] provided by the EFF and [unofficial lists][4] corrected by me.
5. Pseudowords: A selection of different approaches to pseudoword generation.
6. Random: Some common numerical bases

[1]: https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md
[2]: https://diceware.com
[3]: https://www.eff.org/dice
[4]: https://gist.github.com/atoponce/03109c0a51aededbddaf40b4c0aa0d7d/

Below is a list of the features that this project supports, with the various generators that supply
each feature. Note that many generators have multiple features.

## Mouse Entropy Collection
The project supports collecting entropy via mouse or finger movement over an animated CSPRNG noise
matrix. These bits are debiased and stored locally for mixing into the password generation if you
choose. This should yield "true random" passwords, providing information theoretic security like
flipping fair coins or tossing fair dice.

## Checksums
Client-side software could check the validity of the checksum first before sending it to the
authentication server for hashing. This should reduce stress off the authentication server by
preventing hashing of wrong passwords.

* Bitcoin
* Pseudowords: Bubble Babble, Letterblock Diceware
* Random: Base32

## Educational Discussion
Passphrases from a deck of playing cards? Twitter? Simpsons episodes? Leaked passwords? These
generators are designed to spark a discussion about the security of how passphrases can be sourced.

* Alternate: English (All), Pokerware, RockYou, Simpsons, Trump
* Diceware: English (Beale), English (NLP)

## Encoding Standards
Each of these is a common (more or less) standard for converting binary into text. In the case of
Munemo, it's converting a signed integer into a signed base100 pronounceable string.

* Pseudowords: Bubble Babble, Munemo
* Random: Base85, Base64, Base58, Base32, Base16

## Entertainment
These are here for strictly entertainment purposes. Who says you can't have some fun with your
passwords? Personally, I find it entertaining to have a password out of Braille, as it's designed
for tactile use, not visual use.

* Alternate: Elvish, Klingon
* EFF: Game of Thrones, Harry Potter, Star Trek, Star Wars
* Random: Braille, Emoji

## Density
Just categorizes character density for the same security level into high, medium, and low.

### High
* Pseudowords: Letterblock Diceware
* Random: Base94 - Base52
* Random: Braille, Emoji, ISO 8859-1, Latin Extended

### Medium
* Pseudowords: Apple, Inc.
* Random: Base36 - Base16

### Low
* Alternate
* Bitcoin
* Diceware
* EFF
* Pseudowords: Bubble Babble, Munemo, Proquints

## Meets Complex Requirements
Sites that have very complex password strength requirements could probably be satisfied with these
generators. It may take a couple generations for the site to accept it however.

* Pseudowords: Apple, Inc, Letterblock Diceware
* Random: Base94, Base85

## More Natural English Grammar
One problem with passphrases is their lack of language structure. These generators attempt either
implicitly or explicitly to crease passphrases that seem more "natural", in hopes of making them
easier to recall from memory.

* Alternate: Simpsons, Trump
* Diceware: English (NLP)

## Multiple Languages
One of the core requirements of my passphrase generators was to support as many languages as
possible to have the largest outreach. That includes the nerds with their artificial languages.

* Alternate: Elvish, Klingon
* Bitcoin
* Diceware

## Programmatic Predictability
In the client-side software, if enough of the characters are typed to uniquely identify a word, the
software could auto-complete it for the user, speeding up the process of logging and reducing the
likelihood of errors.

* Alternate: PGP,  S/KEY
* Bitcoin
* EFF: Distant Words

## Synaesthesia
This is entirely an unfounded investigation into whether or not seeing the color of the color word
itself will help in remembering that word, and ultimately the passphrase. For those with diagnosed
synaesthesia, I would be very interested in hearing from you if this helped where you struggled with
generic passphrase approaches, such as Diceware.

* Alternate: Colors

## Unicode
Bytes are bytes, and Unicode characters are just more bytes. This can be an effective way to test
authentication systems for localization support, run dynamic tests for bugs, and other things.

* Alternate: English (Deseret), English (Shavian)
* Bitcoin
* Diceware
* Random: Braille, Emoji, ISO 8859-1, Latin Extended

## Verbal Unambiguity
Sometimes a password needs to be spoken in a noisy environment, such as a PGP key signing party or
in a data center. These word lists are designed such that each word has its own distinct sound.

* Alternate: PGP, S/KEY

## Visual Unambiguity
As with verbal unambiguity, these are visually unambiguous, even you might need to know the
character set in advance. They should read from screens or printed documents without confusion.

* Alternate: Colors
* Random: Base32 - Base2, Coin Flips, DNA Sequence
