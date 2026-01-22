<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni-Calc AI</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js"></script>
    <style>
        :root {
            --bg-color: #0f172a;
            --calc-bg: #1e293b;
            --text-main: #f8fafc;
            --text-sec: #94a3b8;
            --accent: #38bdf8;
            --btn-bg: #334155;
            --btn-hover: #475569;
            --op-bg: #0ea5e9;
        }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }

        .container {
            width: 100%;
            max-width: 400px;
            background: var(--calc-bg);
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            overflow: hidden;
            border: 1px solid #334155;
        }

        /* Display Section */
        .display {
            padding: 30px 20px;
            text-align: right;
            background: rgba(0,0,0,0.2);
        }

        #history {
            font-size: 0.9rem;
            color: var(--text-sec);
            min-height: 20px;
            margin-bottom: 5px;
        }

        #result {
            font-size: 2.5rem;
            font-weight: 300;
            word-wrap: break-word;
        }

        /* AI Input Section */
        .ai-mode {
            padding: 10px 20px;
            border-bottom: 1px solid var(--btn-bg);
            display: flex;
            gap: 10px;
        }

        #ai-input {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: none;
            background: var(--btn-bg);
            color: white;
            font-family: monospace;
        }
        
        #ai-input:focus {
            outline: 2px solid var(--accent);
        }

        /* Keypad */
        .keys {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: var(--btn-bg);
        }

        button {
            border: none;
            background: var(--calc-bg);
            color: var(--text-main);
            padding: 20px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: background 0.2s;
        }

        button:hover {
            background: var(--btn-hover);
        }

        .op {
            color: var(--accent);
            font-weight: bold;
        }

        .equal {
            background: var(--op-bg);
            color: white;
            grid-column: span 2;
        }
        
        .equal:hover {
            background: #0284c7;
        }

        .sci {
            font-size: 1rem;
            color: var(--text-sec);
            background: #253246;
        }

        /* Tabs for modes */
        .tabs {
            display: flex;
            background: #0f172a;
        }
        .tab {
            flex: 1;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            font-size: 0.8rem;
            color: var(--text-sec);
        }
        .tab.active {
            background: var(--calc-bg);
            color: var(--accent);
            border-top: 3px solid var(--accent);
        }

    </style>
</head>
<body>

<div class="container">
    <div class="tabs">
        <div class="tab active">Standard</div>
        <div class="tab">Scientific</div>
        <div class="tab">AI / Unit Converter</div>
    </div>

    <div class="ai-mode">
        <input type="text" id="ai-input" placeholder="Type here... (e.g., '5 inch to cm' or 'sqrt(16)')">
    </div>

    <div class="display">
        <div id="history"></div>
        <div id="result">0</div>
    </div>

    <div class="keys">
        <button class="sci" onclick="append('sin(')">sin</button>
        <button class="sci" onclick="append('cos(')">cos</button>
        <button class="sci" onclick="append('tan(')">tan</button>
        <button class="sci" onclick="append('deg')">deg</button>

        <button class="sci" onclick="append('sqrt(')">√</button>
        <button class="sci" onclick="append('^')">^</button>
        <button class="sci" onclick="append('log(')">log</button>
        <button class="sci" onclick="append('pi')">π</button>

        <button class="op" onclick="clearDisplay()">AC</button>
        <button class="op" onclick="deleteChar()">DEL</button>
        <button class="op" onclick="append('%')">%</button>
        <button class="op" onclick="append('/')">÷</button>

        <button onclick="append('7')">7</button>
        <button onclick="append('8')">8</button>
        <button onclick="append('9')">9</button>
        <button class="op" onclick="append('*')">×</button>

        <button onclick="append('4')">4</button>
        <button onclick="append('5')">5</button>
        <button onclick="append('6')">6</button>
        <button class="op" onclick="append('-')">−</button>

        <button onclick="append('1')">1</button>
        <button onclick="append('2')">2</button>
        <button onclick="append('3')">3</button>
        <button class="op" onclick="append('+')">+</button>

        <button onclick="append('0')">0</button>
        <button onclick="append('.')">.</button>
        <button class="equal" onclick="calculate()">=</button>
    </div>
</div>

<script>
    const resultDisplay = document.getElementById('result');
    const historyDisplay = document.getElementById('history');
    const aiInput = document.getElementById('ai-input');
    let currentInput = '';

    // Synchronize the input box and the calculator buttons
    function updateDisplay() {
        resultDisplay.innerText = currentInput || '0';
        aiInput.value = currentInput;
    }

    function append(value) {
        currentInput += value;
        updateDisplay();
    }

    function clearDisplay() {
        currentInput = '';
        historyDisplay.innerText = '';
        updateDisplay();
    }

    function deleteChar() {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }

    function calculate() {
        try {
            const expression = currentInput;
            // Use math.js to evaluate. This is much safer and more powerful than eval()
            // It handles units (cm to inch), matrices, and complex math.
            const result = math.evaluate(expression);
            
            historyDisplay.innerText = expression + ' =';
            currentInput = result.toString();
            updateDisplay();
        } catch (error) {
            historyDisplay.innerText = 'Error';
            resultDisplay.innerText = 'Invalid';
            console.error(error);
        }
    }

    // Allow typing in the input box directly
    aiInput.addEventListener('input', (e) => {
        currentInput = e.target.value;
        resultDisplay.innerText = currentInput || '0';
    });

    // Handle "Enter" key in the input box
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
</script>

</body>
</html>
