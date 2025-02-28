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
    let currentState = 'menu'; // States: 'menu', 'cidr', 'copyPrompt'

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

    function handleInput(input) {
      const trimmedInput = input.trim().toLowerCase();
      terminalInput.value = ''; // Explicitly clear input after each action
    
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
        } else if (['2', '3'].includes(trimmedInput)) {
          printToTerminal('Tool in development. Not available yet.');
          setTimeout(() => {
            clearTerminal();
            printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
            printToTerminal('1) CIDR to IP Range');
            printToTerminal('2) IP Calculator');
            printToTerminal('3) Encoder');
          }, 2000);
        } else {
          printToTerminal('Invalid selection. Please enter 1, 2, or 3.');
        }
      } else if (currentState === 'cidr') {
        if (trimmedInput === 'exit') {
          currentState = 'menu';
          clearTerminal();
          printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
          printToTerminal('1) CIDR to IP Range');
          printToTerminal('2) IP Calculator');
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
              printToTerminal('Do you wish to copy the results to clipboard? (Y/N)');
              currentState = 'copyPrompt';
            }
          } catch (error) {
            printToTerminal('ERROR: Conversion failed. Please check the format.');
            console.error('CIDR conversion error:', error);
          }
        }
      } else if (currentState === 'copyPrompt') {
        if (trimmedInput === 'y' || trimmedInput === 'yes') {
          const text = terminalOutput.textContent
            .split('\n')
            .filter(line => line.match(/^\d+\.\d+\.\d+\.\d+$/)) // Filter only IP addresses
            .join('\n');
          if (text) {
            navigator.clipboard.writeText(text).then(() => {
              printToTerminal('Results copied to clipboard!');
              setTimeout(() => {
                printToTerminal('Type "exit" to return to the main menu or enter another CIDR.');
                currentState = 'cidr';
              }, 2000);
            }).catch(err => {
              printToTerminal('Failed to copy. Please try again.');
              console.error('Copy failed:', err);
              currentState = 'cidr';
            });
          } else {
            printToTerminal('No results to copy. Try generating a list first.');
            currentState = 'cidr';
          }
        } else if (trimmedInput === 'n' || trimmedInput === 'no') {
          printToTerminal('Copy cancelled.');
          printToTerminal('Type "exit" to return to the main menu or enter another CIDR.');
          currentState = 'cidr';
        } else {
          printToTerminal('Please enter Y/N.');
        }
      }
    }

    // Initial greeting (only after loading screen)
    printToTerminal('Welcome to Vault-Tec Terminal, Wanderer! Pip-Boy Online. Select a tool:');
    printToTerminal('1) CIDR to IP Range');
    printToTerminal('2) IP Calculator');
    printToTerminal('3) Encoder');

    // Handle terminal input with preventDefault to stop newline
    terminalInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default newline behavior
        handleInput(terminalInput.value);
      }
    });
  }
})