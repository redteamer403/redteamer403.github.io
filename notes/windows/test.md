Find interesting files in Recycle bin

*Evil-WinRM* PS C:\Users\f.frizzle\Documents> $shell = New-Object -ComObject Shell.Application
*Evil-WinRM* PS C:\Users\f.frizzle\Documents> $recycleBin = $shell.Namespace(0xA)
*Evil-WinRM* PS C:\Users\f.frizzle\Documents> $recycleBin.items() | Select-Object Name, Path

Name                  Path
----                  ----
wapt-backup-sunday.7z C:\$RECYCLE.BIN\S-1-5-21-2386970044-1145388522-2932701813-1103\$RE2XMEG.7z