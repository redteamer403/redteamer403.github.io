---
layout: notes
permalink: /notes/linux/tools/
title: Useful tools usage
---

# Useful tools
## Tee
The tee command in Linux reads from standard input and writes to standard output and one or more files simultaneously.
```bash
#tee Command Syntax:
tee [OPTIONS] [FILE] 

#OPTIONS :
-a (--append) #Do not overwrite the files instead append to the given files.
-i (--ignore-interrupts) #Ignore interrupt signals.

#Example:
python3 sqlmap.py -u example.com | tee -a sqlmap_results.txt
```
## Tmux
Tmux is a terminal multiplexer; it allows you to create several "pseudo terminals" from a single terminal.

[Tmux CheatSheet](https://tmuxcheatsheet.com/)
```bash
#Create session
tmux new -s [sessionName]
    
#Two panes vertical
Ctrl+B -> shift+5 (%)
    
#Activate mouse scroll:
tmux set -g mouse on

#Go to your session
tmux a -t [sessionName]
```

## Xfreerdp
FreeRDP is a free implementation of the Remote Desktop Protocol (RDP).
```bash
#Basic Commands
xfreerdp /dynamic-resolution +clipboard /cert:ignore /v:<IP> /u:<username> /p:'<password>'
xfreerdp /v:<IP> /u:<DOMAIN>\\<username> /pth:<NTLM_HASH>
```