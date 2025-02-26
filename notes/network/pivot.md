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