---
layout: notes
permalink: /notes/linux/privesc/
title: Linux Privilege Escalation
---

# Linux Privilege Escalation

## Common Vectors

### SUID Binaries
```bash
# Find SUID binaries
find / -perm -4000 2>/dev/null

# Common SUID binaries to check
- /usr/bin/sudo
- /usr/bin/pkexec
- /usr/bin/passwd
- /usr/bin/gpasswd
- /usr/bin/newgrp
```

### Sudo Misconfigurations
```bash
# Check sudo permissions
sudo -l

# Common sudo exploits
- LD_PRELOAD
- SETENV
- NOPASSWD
- Wildcards
```

### Kernel Exploits
- DirtyPipe (Linux Kernel 5.8+)
- DirtyC0w (Linux Kernel < 4.8.3)
- Overlayfs (Ubuntu < 15.04)

### Service Misconfigurations
- Writable service files
- Unquoted service paths
- Weak permissions on service binaries

## Tools
- LinPEAS
- Linux Exploit Suggester
- Linux Smart Enumeration
- pspy64