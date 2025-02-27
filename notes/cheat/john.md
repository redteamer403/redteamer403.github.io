---
layout: notes
permalink: /notes/cheat/john/
title: John The Ripper Cheat Sheet
---

# John The Ripper Cheat Sheet

```bash
#URL
https://www.openwall.com/john/

#Installation
sudo apt-get install john

#Pot Location
/root/.john/john.pot
~/.john/john.pot

#Benchmark
john --test

#Create Session
john hash.txt --session=session-name

#Restore Session
john --restore=session-name

#List Hash Formats
john --list=formats

#List Rules
john --list=rules

#View Status
john --status

#Unshadow
unshadow passwd.txt shadow.txt > unshadowed.txt

#Create Wordlist
john --wordlist=list.txt --stdout --external:[filter] > output.txt

#Zip To John
zip2john file.zip > ziphash.txt

#RAR To John
rar2john file.zip > rarhash.txt

#Default Attack
john hash.txt

#Incremental Attack
john --incremental hash.txt

#Mask Attack
john –format=hashtype hash.txt –mask?a?a?a?a?a?a?a

#Crack MD5
john --format=raw-md5 --wordlist=rockyou.txt hash1.txt

#Crack SHA1
john --format=raw-sha1 --wordlist=rockyou.txt hash2.txt

#Crack SHA256
john --format=raw-sha256 --wordlist=rockyou.txt hash3.txt

#Crack Whirlpool
john --format=whirlpool --wordlist=rockyou.txt hash4.txt

#Crack MD4
john --format=raw-md4 --wordlist=rockyou.txt hash5.txt

#John Masks
?1 = lowercase #26 characters abcdefghijklmnopqrstuvqxyz
?u = uppercase #26 characters ABCDEFGHIJKLMNOPQRSTUVWXYZ
?d = digits #10 characters 0123456789
?s = special #33 characters <>!”£$%^&*()_+{}[]’#~\/|?
?a = all #95 characters upper,lower,digits,special
?h = hex #hex characters 0x00, 0xff
?A = all valid
?H = all except null
?L = non ASCII lower-case
?U = non ASCII upper-case
?D = non ASCII digits
?S = non ASCII specials
?w = Hybrid
```