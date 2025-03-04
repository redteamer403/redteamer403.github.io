document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath === '/tools/' || currentPath === '/tools') {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    terminalInput.style.display = 'none'; // Hide input during loading

    const loadingMessages = [
      'VAULT-TEC Terminal: Booting Pip-Boy Interface...',
      'Initializing Vault Security Protocols...',
      'Decrypting Wasteland Data...'
    ];

    function typeMessage(index = 0, currentText = '', startTime = Date.now(), callback) {
      if (index >= loadingMessages.length) {
        if (callback) callback();
        return;
      }

      const message = loadingMessages[index];
      const totalTime = 2500; // 2.5 seconds total for all messages
      const charsPerMessage = message.length;
      const timePerChar = totalTime / (loadingMessages.reduce((sum, msg) => sum + msg.length, 0)); // Distribute time evenly

      if (currentText.length < message.length) {
        const elapsed = Date.now() - startTime;
        const targetChars = Math.floor(elapsed / timePerChar);
        const newText = message.substring(0, Math.min(targetChars, message.length));
        terminalOutput.textContent = loadingMessages.slice(0, index).join('\n') + '\n' + newText;
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        setTimeout(() => typeMessage(index, newText, startTime, callback), 10); // Faster typing check (10ms)
      } else {
        setTimeout(() => typeMessage(index + 1, '', Date.now(), callback), 0); // Immediate next message
      }
    }

    typeMessage(0, '', Date.now(), () => {
      setTimeout(() => {
        terminalOutput.textContent = '';
        terminalInput.style.display = 'block'; // Show input after loading
        initializeTerminal();
      }, 0); // Immediate transition to terminal
    });
  }

  function initializeTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    let terminalInput = document.getElementById('terminal-input');
    let currentState = 'menu'; // States: 'menu', 'cidr', 'password', 'encoder', 'encode1', 'encode2', 'encode3', 'copyPrompt', 'postCopy'

    // Ensure only one terminal-input exists
    if (document.querySelectorAll('.terminal-input').length > 1) {
      document.querySelectorAll('.terminal-input').forEach((input, index) => {
        if (index > 0) input.remove();
      });
    }
    terminalInput = document.getElementById('terminal-input'); // Reassign after cleanup
    terminalInput.style.display = 'block'; // Ensure it’s visible

    function printToTerminal(text, delay = 0, callback = null) {
      setTimeout(() => {
        terminalOutput.textContent += text + '\n';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        if (callback) callback();
      }, delay);
    }

    function clearTerminal() {
      terminalOutput.textContent = '';
    }

    function getRandomChar(type) {
      const chars = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      };
      return chars[type][Math.floor(Math.random() * chars[type].length)];
    }

    function generatePassword(length, minNumbers, minSymbols) {
      let password = '';
      let numbers = 0, symbols = 0;

      // Ensure minimum requirements
      while (numbers < minNumbers || symbols < minSymbols) {
        password = '';
        for (let i = 0; i < length; i++) {
          const types = ['lowercase', 'uppercase', 'numbers', 'symbols'];
          const type = types[Math.floor(Math.random() * types.length)];
          password += getRandomChar(type);
          if (type === 'numbers') numbers++;
          if (type === 'symbols') symbols++;
        }
      }

      // Shuffle the password for randomness
      return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    function handleInput(input) {
      const trimmedInput = input.trim().toLowerCase();
      terminalInput.value = ''; // Clear input after each action

      if (currentState === 'menu') {
        if (trimmedInput === '1') {
          currentState = 'cidr';
          printToTerminal('Initializing Pip-Boy Calculations...', 0, () => {
            setTimeout(() => {
              clearTerminal();
              printToTerminal('VAULT-TEC Terminal: CIDR to IP Range Tool');
              printToTerminal('Enter CIDR notation (e.g., 192.168.0.1/24) or type "exit" to return to menu:');
            }, 1000); // 1-second loading splash
          });
        } else if (trimmedInput === '2') {
          currentState = 'password';
          printToTerminal('Activating Vault Security Passcode Generator...', 0, () => {
            setTimeout(() => {
              clearTerminal();
              printToTerminal('Vault-Tec Password Generator Online! Choose your strength, Wanderer:');
              printToTerminal('1) Easy');
              printToTerminal('2) Strong');
              printToTerminal('3) Insane');
              printToTerminal('Enter 1, 2, or 3, or type "exit" to return to menu:');
            }, 1000); // 1-second loading splash
          });
        } else if (trimmedInput === '3') {
          currentState = 'encoder';
          printToTerminal('Hacking Wasteland Encryption Protocols...', 0, () => {
            setTimeout(() => {
              clearTerminal();
              printToTerminal('Vault-Tec Encoder Online! Choose your cipher, Survivor:');
              printToTerminal('1) URL');
              printToTerminal('2) Double URL');
              printToTerminal('3) BASE64');
              printToTerminal('Enter 1, 2, or 3, or type "exit" to return to menu:');
            }, 1000); // 1-second loading splash
          });
        } else {
          printToTerminal('Invalid selection. Please enter 1, 2, or 3.');
        }
      } else if (currentState === 'cidr') {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else {
          try {
            const [ip, prefix] = trimmedInput.split('/');
            if (!ip || !prefix || isNaN(parseInt(prefix, 10))) {
              printToTerminal('ERROR: Invalid CIDR notation. Use format like 192.168.0.1/24');
              return;
            }

            const prefixNum = parseInt(prefix, 10);
            if (prefixNum < 16 || prefixNum > 32) {
              printToTerminal('ERROR: Invalid CIDR notation. Use CIDR range from 16-32');
              return;
            }

            const ipParts = ip.split('.').map(part => {
              const num = parseInt(part, 10);
              return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 255);
            });
            if (ipParts.length !== 4) {
              printToTerminal('ERROR: Invalid IP address. Use format like 192.168.0.1');
              return;
            }

            const mask = ~(Math.pow(2, 32 - prefixNum) - 1) >>> 0;
            const startIpNum = ipParts.reduce((acc, part, i) => acc + (part << (24 - i * 8)), 0) & mask;
            const endIpNum = startIpNum + (Math.pow(2, 32 - prefixNum) - 1);

            const ipAddresses = [];
            for (let i = startIpNum; i <= endIpNum; i++) {
              const bytes = [
                (i >>> 24) & 0xFF,
                (i >>> 16) & 0xFF,
                (i >>> 8) & 0xFF,
                i & 0xFF
              ];
              ipAddresses.push(bytes.join('.'));
            }

            if (ipAddresses.length === 0) {
              printToTerminal('ERROR: No IP addresses in range. Check CIDR notation.');
            } else {
              printToTerminal('IP Address Range:');
              ipAddresses.forEach(ip => printToTerminal(ip));
              printToTerminal(''); // Empty line after IPs
              printToTerminal('Do you wish to copy IP List to clipboard? (Y/N)');
              currentState = 'copyPrompt';
            }
          } catch (error) {
            printToTerminal('ERROR: Conversion failed. Please check the format.');
            console.error('CIDR conversion error:', error);
          }
        }
      } else if (currentState === 'password') {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else if (['1', '2', '3'].includes(trimmedInput)) {
          let password, message;
          if (trimmedInput === '1') {
            password = generatePassword(8, 1, 1);
            message = 'Generated an Easy passcode for noobs';
          } else if (trimmedInput === '2') {
            password = generatePassword(12, 2, 2);
            message = 'Generated a Strong passcode';
          } else if (trimmedInput === '3') {
            password = generatePassword(20, 4, 4);
            message = 'Are you okay? Why you need this Insane passcode?';
          }
          printToTerminal(''); // Empty line
          printToTerminal(message);
          printToTerminal(password); // New line for the password
          printToTerminal(''); // Empty line after the password
          printToTerminal('Do you wish to copy this Passcode to clipboard? (Y/N)');
          currentState = 'copyPrompt';
        } else {
          printToTerminal('Invalid selection. Enter 1, 2, or 3, or type "exit" to return to menu.');
        }
      } else if (currentState === 'encoder') {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else if (['1', '2', '3'].includes(trimmedInput)) {
          currentState = `encode${trimmedInput}`;
          printToTerminal(trimmedInput === '1' ? 'Loading URL Encoder for Wasteland Navigation...' :
                         trimmedInput === '2' ? 'Loading Double URL Encoder—Paranoia Mode Engaged!' :
                         'Loading BASE64 Encoder for Enclave Secrets...');
          setTimeout(() => {
            clearTerminal();
            printToTerminal(trimmedInput === '1' ? 'Vault-Tec URL Encoder Online!' :
                           trimmedInput === '2' ? 'Vault-Tec Double URL Encoder Online!' :
                           'Vault-Tec BASE64 Encoder Online!');
            printToTerminal('Enter text to encode, or type "exit" to return to menu:');
          }, 1000); // 1-second loading splash
        } else {
          printToTerminal('Invalid selection. Enter 1, 2, or 3, or type "exit" to return to menu.');
        }
      } else if (currentState.startsWith('encode')) {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else {
          let encoded;
          if (currentState === 'encode1') { // URL Encode
            encoded = encodeURIComponent(trimmedInput);
            printToTerminal('Encoded URL (Wasteland-safe):');
            printToTerminal(encoded); // New line for the encoded output
            printToTerminal(''); // Empty line after the encoded output
          } else if (currentState === 'encode2') { // Double URL Encode
            encoded = encodeURIComponent(encodeURIComponent(trimmedInput));
            printToTerminal('Double-Encoded URL (Enclave Paranoia!):');
            printToTerminal(encoded); // New line for the encoded output
            printToTerminal(''); // Empty line after the encoded output
          } else if (currentState === 'encode3') { // BASE64 Encode
            encoded = btoa(trimmedInput);
            printToTerminal('BASE64 Encoded (Enclave Secret!):');
            printToTerminal(encoded); // New line for the encoded output
            printToTerminal(''); // Empty line after the encoded output
          }
          printToTerminal('Do you wish to copy this Enclave Cipher to clipboard? (Y/N)');
          currentState = 'copyPrompt';
        }
      } else if (currentState === 'copyPrompt') {
        if (trimmedInput === 'y' || trimmedInput === 'yes') {
          const text = terminalOutput.textContent
            .split('\n')
            .filter(line => line.match(/^\d+\.\d+\.\d+\.\d+$|^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$|^[A-Za-z0-9%+=\/]+$/)) // Filter IPs, passwords, or encoded outputs
            .join('\n');
          if (text) {
            navigator.clipboard.writeText(text).then(() => {
              printToTerminal(currentState === 'cidr' ? 'Wasteland IP List copied to clipboard!' :
                             currentState === 'password' ? 'Wasteland Passcode copied to clipboard!' :
                             'Enclave Cipher copied to clipboard!');
              printToTerminal('Type "exit" to return to menu.');
              currentState = 'postCopy'; // New state after copying
            }).catch(err => {
              printToTerminal('Failed to copy. Vault-Tec tech glitch—try again!');
              console.error('Copy failed:', err);
              currentState = currentState.replace('copyPrompt', currentState.startsWith('encode') ? 'encode' : currentState);
            });
          } else {
            printToTerminal('No results to copy. Try generating output first.');
            currentState = currentState.replace('copyPrompt', currentState.startsWith('encode') ? 'encode' : currentState);
          }
        } else if (trimmedInput === 'n' || trimmedInput === 'no') {
          // Redirect to Tools page (reset to menu)
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else {
          printToTerminal('Please enter Y/N, Wanderer—don’t make Pip-Boy confused!');
        }
      } else if (currentState === 'postCopy') {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) Password Generator');
          printToTerminal('3) Encoder');
        } else {
          printToTerminal('Invalid command. Type "exit" to return to menu.');
        }
      }
    }

    // Initial greeting (only after loading screen)
    printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
    printToTerminal('1) CIDR to IP Range');
    printToTerminal('2) Password Generator');
    printToTerminal('3) Encoder');

    // Handle terminal input with preventDefault to stop newline
    terminalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default newline behavior
        handleInput(terminalInput.value);
      }
    });
  }
});