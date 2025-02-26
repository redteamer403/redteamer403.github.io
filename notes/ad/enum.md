---
layout: notes
permalink: /notes/ad/enum/
title: Active Directory Domain Enumeration
---

# Active Directory Domain Enumeration

## Domain Controllers
```powershell
# List domain controllers
nltest /dclist:<domain>

# Get DC info via PowerShell
Get-ADDomainController -Filter *

# Query DNS for DCs
nslookup -type=SRV _ldap._tcp.dc._msdcs.<domain>
```

## Users and Groups
```powershell
# List domain users
net user /domain

# Get all AD users
Get-ADUser -Filter * (if AD module)

# List domain groups
net group /domain

# Get group members
Get-ADGroupMember -Identity "Domain Admins"

# Enumerate user properties
dsquery user -o dn
```

## Group Policies
```powershell
# List GPOs
Get-GPO -All

# Check GPO settings
gpresult /r

# Export GPO report
Get-GPOReport -All -ReportType Html -Path gpo.html
```

## Trust Relationships
```powershell
# List trusted domains
nltest /domain_trusts

# Get trust details
Get-ADTrust -Filter *

# Check trust attributes
netdom query trust
```

## Automated Enumeration Tools
- BloodHound: ```bloodhound-python -u <user> -p <pass> -d <domain> -c All```
- PowerView: ```Import-Module .\PowerView.ps1; Get-NetDomain```
- ADRecon: ```.\ADRecon.ps1```
- SharpHound: ```SharpHound.exe -c All```
- PingCastle: ```PingCastle.exe --healthcheck```