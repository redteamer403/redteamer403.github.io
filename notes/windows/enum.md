---
layout: notes
permalink: /notes/windows/enum/
title: Windows Enumeration
---

# Windows Enumeration

## System Information Gathering
```powershell
# Get system details
systeminfo

# Get OS info via WMI
Get-WmiObject Win32_OperatingSystem

# Get computer info
Get-ComputerInfo

# Display version
ver

# Get OS and patches
wmic os get *

# List hotfixes
Get-HotFix

# Filter OS name and version
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"

# Get processor info
Get-WmiObject Win32_Processor

# List environment variables
set
```

## User and Group Enumeration
```powershell
# List local users
net user

# List local groups
net group

# Get local user details
Get-LocalUser

# Get local group details
Get-LocalGroup

# Display user privileges
whoami /all

# List domain users
net user /domain

# Get all AD users
Get-ADUser -Filter * (if AD module)

# List active sessions
qwinsta

# Get admin group members
Get-LocalGroupMember -Group "Administrators"

# Query logged-on users
query user
```

## Network Shares
```powershell
# List shares
net share

# Get SMB shares
Get-SmbShare

# View network shares
net view

# Enumerate remote shares
net view \\\\<target>
```

## Running Services
```powershell
# List running services
net start

# Get service details
Get-Service

# Query service status
sc query

# List processes with services
tasklist /svc

# Get detailed service info
Get-WmiObject Win32_Service
```

## Additional Network Configuration
```powershell
# Display IP config
ipconfig /all

# Get network adapters
Get-NetAdapter

# Get IP addresses
Get-NetIPAddress

# Show ARP table
arp -a

# Get DNS servers
Get-DnsClientServerAddress

# Display routing table
Get-NetRoute

# Test connectivity
Test-Connection -ComputerName <target> -Count 4

# Scan network
nmap -sn <network>
```

## Automated Enumeration Tools
- PowerView: ``` Import-Module .\PowerView.ps1; Get-NetComputer ```
- SharpUp: ``` SharpUp.exe ```
- WinPEAS: ``` WinPEAS.exe ```
- BloodHound: ``` bloodhound-python -u <user> -p <pass> -d <domain> -c All ```
- ADRecon: ``` .\ADRecon.ps1 ```
- PowerSploit: ``` Import-Module .\PowerSploit.ps1; Get-NetDomainController ```
- Netscan: ``` netscan.exe ```