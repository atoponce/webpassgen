# Manual DiceKey Generation
The DiceKeys physical random number generator is meant to be a permanent physical device to recover a secret, such as a
master passphrase to a password manager, or the seed to a SoloKey hacker model. Regardless, once securely stored in a
safe location, the device is meant to be scanned with the upstream tool, either via using the mobile app or the web
interface. However, if you want to generate a secret manually without the app, this document gives you a few ideas how
you can do that.

**Disclaimer:** I am not affiliated with the DiceKeys product in any way. When it was announced, I liked the idea of
physical 198-bit random number generator with dice, and further liked the idea of permanently setting that number in
place for archival purposes. I ordered my own physical copy to play with, and recommend you do the same. I added it to
the my password generator project for demonstration purposes.

## Reading the DiceKey Directly
The security of the DiceKey comes a shuffled 25 character alphabet, 6 sides and 4 orientations of each die. As such, for
each die you must record the character, side, and orientation. Thus, without spaces, this will produce a 75-character
secret you can type by hand. Probably easiest to follow your natural reading direction, such as left-to-right,
top-to-bottom for English speakers.

Recording the character and dice side is easy, as they are physically printed on the dice, and can be read directly.
However, orientation must be defined. There are a number of ways you could approach this. For example, you could use the
cardinal directions on a compass:

* "N" for facing north (right-side up).
* "E" for facing east (resting on its right side).
* "S" for facing south (upside down).
* "W" for facing west (resting on its left side).

So the "N4" face resting on its right side (facing east) would be recorded an "N4E". Similarly, an upside down "Z3" die
would be recorded as "Z3S". Following this definition, a possible result reading from the top-left die to the
lower-right die could be:

    N3E O2N S2S D5E Z1E I3W H4N X6S A5W T2S R4E B3E C3E P5N Y3E M5W V1E J3E K1E L6W W5N G6S E3W F6E U2N

## Converting the DiceKey into a Passphrase by Hand
If you would prefer to use a passphrase instead of a random meaningless string of characters, I built [a word list of
exactly 14,400 unique words][1]. Creating the passphrase means executing the following steps:

[1]: https://gist.github.com/atoponce/648436a7b8492d13039040e38f87762b

1. Create 12 non-overlapping pairs of dice.
2. Record the alphabetic characters of the pair.
3. Record the face of the first die in the pair.
4. Record the orientation of the second die in the pair.

For example, using our DiceKey result from above, they would first be paired (note the last die is not paired, and is
ignored):

    (N3E O2N) (S2S D5E) (Z1E I3W) (H4N X6S) (A5W T2S) (R4E B3E) (C3E P5N) (Y3E M5W) (V1E J3E) (K1E L6W) (W5N G6S) (E3W F6E) U2N

Now record the alphabetic characters of each pair:

    NO SD ZI HX AT RB CP YM VJ KL WG EF

Record the face of the first die in each pair:

    NO3 SD2 ZI1 HX4 AT5 RB4 CP3 YM3 VJ1 KL1 WG5 EF3

And record the orientation of the second die in each pair:

    NO3N SD2E ZI1W HX4S AT5S RB4E CP3N YM3W VJ1E KL1W WG5S EF3E

These results are indices of each word in the word list:

    milked quinin wight forky arhat pinkie broke vestal sorrel ibex swatch copal

This provides a security margin of log2(25! \* 24^12) ~= 138 bits. No word is longer than 5 characters, so the
passphrase itself will never exceed 72 characters, unless you add a word separator between each word.

## Converting the DiceKey into a Passphrase using Niceware
### Using offline tools
If you would like to maximize the security margin out of the 198 bits available in the device itself, you can
use a cryptographic hashing function to hash the results of the DiceKey, then convert the hexadecimal to a [Niceware
passphrase][2].

[2]: https://github.com/diracdeltas/niceware

Doing this is fairly straight-forward:

1. Hash the recorded result of the DiceKey, truncated to 192 bits.
2. Convert the hex to a Niceware phrase.

For hashing, any cryptographic hashing primitive that can produce digests of 192 bits of greater will work, such as
SHA-256, SHAKE, BLAKE3, and others. For example, using SHA-256 with our recorded example above, ignoring white space, we
can execute in a Linux terminal:

    $ printf N3EO2NS2SD5EZ1EI3WH4NX6SA5WT2SR4EB3EC3EP5NY3EM5WV1EJ3EK1EL6WW5NG6SE3WF6EU2N | sha256sum
    55a46459af3f9995ef7f1e8e52b6481671200224f629b373fc4447d9a30051e5  -

Because each hexadecimal character provides 4 bits, then we only need the first 48 hex characters from our digest to
produce a 192-bit Niceware passphrase:

    $ printf N3EO2NS2SD5EZ1EI3WH4NX6SA5WT2SR4EB3EC3EP5NY3EM5WV1EJ3EK1EL6WW5NG6SE3WF6EU2N | sha256sum | head -c 48; printf '\n'
    55a46459af3f9995ef7f1e8e52b6481671200224f629b373

Using the command line [`nicepass(1)`][3] utility, you can convert this result to a passphrase:

[3]: https://github.com/awcross/nicepass

    $ nicepass 55a46459af3f9995ef7f1e8e52b6481671200224f629b373
    fugue hitting quipster overtire unmasked caucussing forelady estrogenicity introducible aikido vinca reconcilability

We ended up with another 12 word passphrase, but this time our security margin is 192 bits instead of 138, a significant
improvement. The cost is considerably more characters to type however, as the average word length is 8.2 characters.

### Using online tools
Not everyone likes command line tools, and not everyone uses unix-like environments. As such, the above can be
duplicated using CyberChef by the GCHQ and Niceware by Yan Zhu.

1. Paste your DiceKey secret using [this CyberChef recipe][4].
2. Paste the resulting hexadecimal string into [Niceware][5].

[4]: https://gchq.github.io/CyberChef/#recipe=SHA2('256')Head('Nothing%20(separate%20chars)',48)
[5]: https://diracdeltas.github.io/niceware/

**Caution:** You should [avoid using web interfaces or other online tools when working with secrets][6]. There are no
guarantees that your data is not being recorded and sent to a 3rd party without fully inspecting the code, *on every
page refresh*. If you have to use web tools, you should run them 100% offline. Both [CyberChef][7] and [Niceware][8]
provide ZIP archives of the software that you can download, extract, and run locally in your browser, completely
offline. I **strongly** recommend this approach.

[6]: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/
[7]: https://github.com/gchq/CyberChef/releases/latest
[8]: https://github.com/diracdeltas/niceware/releases/latest
