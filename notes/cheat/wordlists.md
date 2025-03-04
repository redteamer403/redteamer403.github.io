---
layout: notes
permalink: /notes/cheat/wordlists/
title: Wordlists Cheat Sheet
---

# Wordlists Cheat Sheet
### Extensions
```bash
#All for fuzzing
1,2,3,bac,backup,bak,cache,conf,config,cs,csproj,dif,err,gz,inc,ini,java,json,jsp,map,log,lst,old,orig,part,php,rej,sass-cache,sav,save,save.1,sublime-project,sublime-workspace,swp,tar,tar.gz,temp,templ,tmp,txt,un~,vb,vbproj,vi,zip,0,s,_,dist,~,~1,~bk,asp,axd,aspx,ashx,js,class,ts,xml,ps1

#General
bak,sql,zip,xml,old,inc,backup,js,json,passwd,conf,log,yml,yaml,txt

#ASP.NET/IIS
asp,aspx,asmx,cfg,config,xml,web,dll,exe,wasm,wadl,axd,resx,wsdl,xsd,htm,ashx,cs,sln,asax

#Java
jsp,jsf,xhtml,xml,class,java,jar,seam,faces,shtml,ifaces,do,action,jspf,properties

#NodeJS
js,json,yaml,lock,yml,md,basejs
```

### Combine & Sort Wordlists
```bash
#Combine wordlists:
cat file1.txt file2.txt file3.txt > combined_list.txt

#Sort unique:
sort combined_list.txt | uniq -u > cleaned_combined_list.txt
```

### Pre-installed (Kali)
```bash
#Base path
/usr/share/wordlists/
#dirb
/usr/share/dirb/wordlists
#dirbuster
/usr/share/dirbuster/wordlists
#dnsmap
/usr/share/dnsmap/wordlist_TLAs.txt
#fasttrack
/usr/share/set/src/fasttrack/wordlist.txt
#wifi-cracker
/usr/share/fern-wifi-cracker/extras/wordlists
#metasploit
/usr/share/metasploit-framework/data/wordlists
#nmap
/usr/share/nmap/nselib/data/passwords.lst
#sqlmap
/usr/share/sqlmap/txt/wordlist.txt
#wfuzz
/usr/share/wfuzz/wordlist
#rockyou
/usr/share/wordlists/rockyou.txt
```

## Crunch
```bash
# Usage
crunch <minimum-length> <maximum-length> [charset]
@ # lower case alpha characters
, # upper case alpha characters
% # numeric characters
^ # special characters including space

crunch 6 6 -t pass%% -o file1.txt
# Output
pass00
pass01
pass02

crunch 5 5 -t ddd@@ -o j -p dog cat bird -o file2.txt
# Output
birdcatdogaa
birdcatdogab
birdcatdogac
<skipped>
dogcatbirdzy

crunch 7 7 -t p@ss,%^ -l a@aaaaa -o file3.txt
# Output
p@ssA0!
p@ssA0@
p@ssA0#
p@ssA0$
<skipped>
p@ssZ9
```

### CUPP (Common User Passwords Profiler)
CUPP is an automatic and interactive tool written in Python for creating custom wordlists. For instance, if you know some details about a specific target, such as their birthdate, pet name, company name, etc., this could be a helpful tool to generate passwords based on this known information. 
```bash
git clone https://github.com/Mebus/cupp.git
python3 cupp.py
python3 cupp.py -i #Interactive questions for user password profiling
python3 cupp.py -l #Download huge wordlists from repository
python3 cupp.py -a #Parse default usernames and passwords directly from Alecto DB
```

### CeWL (Custom Word List generator)
```bash
cewl -w list.txt -d 5 -m 5 http://thm.labs
    -w #will write the contents to a file. In this case, list.txt.
    -m 5 #gathers strings (words) that are 5 characters or more
    -d 5 #is the depth level of web crawling/spidering (default 2)
    http://thm.labs #is the URL that will be used
```

### RSMangler (Permutation)
RSMangler will take a wordlist and perform various manipulations on it. It will first take the input words and generate all permutations and the acronym of the words (in order they appear in the file) before it applies the rest of the mangles
```bash
# Basic usage
rsmangler --file wordlist.txt

#To pass the initial words in on standard in do:
cat wordlist.txt | rsmangler

#To send the output to a file:
rsmangler --file wordlist.txt --output mangled.txt
```

### Username Generator
```bash
git clone https://github.com/therodri2/username_generator.git
cd username_generator
python3 username_generator.py -h
    usage: username_generator.py [-h] -w wordlist [-u]
    Python script to generate user lists for bruteforcing!
    optional arguments:
      -h, --help show this help message and exit
      -w <wordlist>, --wordlist <wordlist> Specify path to the wordlist
      -u, --uppercase Also produce uppercase permutations. Disabled by default

#Example
echo "John Smith" > users.lst
python3 username_generator.py -w users.lst
```

### Number Generator
[https://numbergenerator.org/numberlist](https://numbergenerator.org/numberlist)

### Password Wordlists
[Password Dictionaries](https://www.skullsecurity.org/wiki/Passwords)\
[Automatically Generated Wordlists](https://wordlists.assetnote.io/)\
[Huge Github Password List](https://github.com/philipperemy/tensorflow-1.4-billion-password-analysis)

### All Wordlists
[https://github.com/danielmiessler/SecLists/](https://github.com/danielmiessler/SecLists/)\
[https://github.com/Bo0oM/fuzz.txt/blob/master/fuzz.txt](https://github.com/Bo0oM/fuzz.txt/blob/master/fuzz.txt)

<embed src="/assets/file/Wordlists_for_pentester.pdf" type="application/pdf" width="100%" height="600px" />

### Default Credentials
[Default Passwords List-1](https://datarecovery.com/rd/default-passwords/)\
[Default Passwords List-2](https://cirt.net/passwords )\
[Default Passwords List-3](https://default-password.info/)\
[Default Credentials Cheat Sheet](https://github.com/ihebski/DefaultCreds-cheat-sheet)

### Security Camera Systems Default Credentials
```
ACTi: admin/123456 or Admin/123456 
ActiveCam: admin/admin
Avtech: admin/admin
Arecont Vision: null
Avigilon: admin/admin
Axis: root/pass or null
Basler: admin/admin
Beward: admin/admin
Bosch: null
Brickcom: admin/admin
Cisco: null
Dahua: admin/admin
Digital Watchdog: admin/admin
DRS: admin/1234
DVTel: Admin/1234
DynaColor: Admin/1234
Elex: admin/<blank>
FLIR: admin/fliradmin
Foscam: admin/<blank>
GeoVision: admin/admin
Grandstream: admin/admin
Hunter: admin/<blank> 
Hikvision : admin/12345
Honeywell: admin/1234
IQinVision: root/system
IPX-DDK: root/admin or root/Admin
Jassun: admin/admin
JVC: admin/jvc
Lanser: admin/12345
LTV: ADMIN/1234
Mobotix: admin/meinsm
Novicam admin/<blank>
Panasonic: admin/12345
Pelco Sarix: admin/admin
Pixord: admin/admin
RVI admin/admin
Samsung Electronics: root/root or admin/4321
Samsung Techwin (old): admin/1111111
Samsung Techwin (new): admin/4321
Sanyo: admin/admin
Scallop: admin/password
Sentry360 (mini): admin/1234
Sentry360 (pro): null
Sony: admin/admintrassir
Stardot: admin/admin
Starvedia: admin/<blank>
Tauvision DVR: admin/12345
Trassir: Admin/12345
Trendnet: admin/admin
Toshiba: root/ikwd
VideoIQ: supervisor/supervisor
Vivotek: root/<blank>&gt
Ubiquiti: ubnt/ubnt
Wodsee: admin/<blank>
```