// Space Calculator JavaScript
class SpaceCalculator {
    constructor() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
        this.memory = 0;
        this.angleMode = 'deg'; // 'deg' or 'rad'
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializeConversions();
        this.initializeOrbital();
        this.initializeScientific();
    }

    initializeElements() {
        // Basic calculator elements
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        this.numberButtons = document.querySelectorAll('.btn-number');
        this.operatorButtons = document.querySelectorAll('.btn-operator');
        this.equalsButton = document.querySelector('.btn-equals');
        this.clearButton = document.querySelector('.btn-clear');
        this.deleteButton = document.querySelector('.btn-delete');
        
        // Scientific calculator elements
        this.sciCurrentOperandElement = document.getElementById('sci-current-operand');
        this.sciPreviousOperandElement = document.getElementById('sci-previous-operand');
        this.sciNumberButtons = document.querySelectorAll('.scientific-calc .btn-number');
        this.sciOperatorButtons = document.querySelectorAll('.scientific-calc .btn-operator');
        this.sciEqualsButton = document.querySelector('.scientific-calc .btn-equals');
        this.sciClearButton = document.querySelector('.scientific-calc .btn-clear');
        this.sciDeleteButton = document.querySelector('.scientific-calc .btn-delete');
        this.functionButtons = document.querySelectorAll('.btn-function');
        this.constantButtons = document.querySelectorAll('.btn-constant');
        this.memoryButtons = document.querySelectorAll('.btn-memory');
        
        // Mode selector
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.calculators = document.querySelectorAll('.calculator');
        
        // Conversion elements
        this.conversionValue = document.getElementById('conversion-value');
        this.conversionCategory = document.getElementById('conversion-category');
        this.fromUnit = document.getElementById('from-unit');
        this.conversionResults = document.getElementById('conversion-results');
        
        // Orbital elements
        this.orbitalRadius = document.getElementById('orbital-radius');
        this.centralMass = document.getElementById('central-mass');
        this.orbitalMass = document.getElementById('orbital-mass');
        this.calculateOrbitalBtn = document.getElementById('calculate-orbital');
        this.orbitalResults = document.getElementById('orbital-results');
    }

    attachEventListeners() {
        // Basic calculator events
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });

        this.operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operator);
            });
        });

        this.equalsButton.addEventListener('click', () => {
            this.compute();
        });

        this.clearButton.addEventListener('click', () => {
            this.clear();
        });

        this.deleteButton.addEventListener('click', () => {
            this.delete();
        });

        // Scientific calculator events
        this.sciNumberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumberScientific(button.dataset.number);
            });
        });

        this.sciOperatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperationScientific(button.dataset.operator);
            });
        });

        this.sciEqualsButton.addEventListener('click', () => {
            this.computeScientific();
        });

        this.sciClearButton.addEventListener('click', () => {
            this.clearScientific();
        });

        this.sciDeleteButton.addEventListener('click', () => {
            this.deleteScientific();
        });

        // Function buttons
        this.functionButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.executeFunction(button.dataset.function);
            });
        });

        // Constant buttons
        this.constantButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.insertConstant(button.dataset.constant);
            });
        });

        // Memory buttons
        this.memoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.executeMemoryOperation(button.dataset.action);
            });
        });

        // Mode selector events
        this.modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchMode(button.dataset.mode);
            });
        });

        // Conversion events
        this.conversionValue.addEventListener('input', () => {
            this.updateConversions();
        });

        this.conversionValue.addEventListener('keydown', (e) => {
            // Allow all keyboard input
            e.stopPropagation();
        });

        this.conversionValue.addEventListener('focus', () => {
            // Ensure input is focused and ready for typing
            this.conversionValue.select();
        });

        this.conversionValue.addEventListener('click', () => {
            // Ensure input is focused when clicked
            this.conversionValue.focus();
        });

        this.conversionCategory.addEventListener('change', () => {
            this.updateConversionUnits();
            this.updateConversions();
        });

        this.fromUnit.addEventListener('change', () => {
            this.updateConversions();
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleQuickAction(btn.dataset.action);
            });
        });

        // Orbital calculation events
        this.calculateOrbitalBtn.addEventListener('click', () => {
            this.calculateOrbital();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    initializeConversions() {
        // Comprehensive conversion system
        this.conversionCategories = {
            basic: {
                name: 'Basic Quantities',
                units: {
                    'meters': { factor: 1, name: 'Meters (m)' },
                    'kilometers': { factor: 1000, name: 'Kilometers (km)' },
                    'inches': { factor: 0.0254, name: 'Inches (in)' },
                    'feet': { factor: 0.3048, name: 'Feet (ft)' },
                    'miles': { factor: 1609.344, name: 'Miles (mi)' },
                    'light-years': { factor: 9.461e15, name: 'Light Years (ly)' },
                    'parsecs': { factor: 3.086e16, name: 'Parsecs (pc)' },
                    'astronomical-units': { factor: 1.496e11, name: 'Astronomical Units (AU)' },
                    'square-meters': { factor: 1, name: 'Square Meters (m²)' },
                    'acres': { factor: 4046.86, name: 'Acres' },
                    'hectares': { factor: 10000, name: 'Hectares (ha)' },
                    'liters': { factor: 0.001, name: 'Liters (L)' },
                    'gallons-us': { factor: 0.00378541, name: 'US Gallons (gal)' },
                    'kilograms': { factor: 1, name: 'Kilograms (kg)' },
                    'pounds': { factor: 0.453592, name: 'Pounds (lb)' },
                    'seconds': { factor: 1, name: 'Seconds (s)' },
                    'minutes': { factor: 60, name: 'Minutes (min)' },
                    'hours': { factor: 3600, name: 'Hours (h)' },
                    'days': { factor: 86400, name: 'Days (d)' },
                    'years': { factor: 31557600, name: 'Years (yr)' },
                    'celsius': { factor: 1, name: 'Celsius (°C)', isTemperature: true },
                    'fahrenheit': { factor: 1, name: 'Fahrenheit (°F)', isTemperature: true },
                    'kelvin': { factor: 1, name: 'Kelvin (K)', isTemperature: true }
                }
            },
            motion: {
                name: 'Motion & Mechanics',
                units: {
                    'meters-per-second': { factor: 1, name: 'Meters per Second (m/s)' },
                    'kilometers-per-hour': { factor: 0.277778, name: 'Kilometers per Hour (km/h)' },
                    'miles-per-hour': { factor: 0.44704, name: 'Miles per Hour (mph)' },
                    'knots': { factor: 0.514444, name: 'Knots (kn)' },
                    'g-force': { factor: 9.80665, name: 'G-Force (g)' },
                    'newtons': { factor: 1, name: 'Newtons (N)' },
                    'pound-force': { factor: 4.44822, name: 'Pound-Force (lbf)' },
                    'joules': { factor: 1, name: 'Joules (J)' },
                    'kilojoules': { factor: 1000, name: 'Kilojoules (kJ)' },
                    'calories': { factor: 4.184, name: 'Calories (cal)' },
                    'kilowatt-hours': { factor: 3600000, name: 'Kilowatt-Hours (kWh)' },
                    'watts': { factor: 1, name: 'Watts (W)' },
                    'kilowatts': { factor: 1000, name: 'Kilowatts (kW)' },
                    'horsepower': { factor: 745.7, name: 'Horsepower (hp)' },
                    'pascals': { factor: 1, name: 'Pascals (Pa)' },
                    'psi': { factor: 6894.76, name: 'Pounds per Square Inch (psi)' },
                    'bar': { factor: 100000, name: 'Bar (bar)' },
                    'newton-meters': { factor: 1, name: 'Newton-Meters (N⋅m)' },
                    'pound-feet': { factor: 1.35582, name: 'Pound-Feet (lb⋅ft)' }
                }
            },
            electricity: {
                name: 'Electricity & Magnetism',
                units: {
                    'amperes': { factor: 1, name: 'Amperes (A)' },
                    'milliamperes': { factor: 0.001, name: 'Milliamperes (mA)' },
                    'volts': { factor: 1, name: 'Volts (V)' },
                    'kilovolts': { factor: 1000, name: 'Kilovolts (kV)' },
                    'ohms': { factor: 1, name: 'Ohms (Ω)' },
                    'kiloohms': { factor: 1000, name: 'Kiloohms (kΩ)' },
                    'farads': { factor: 1, name: 'Farads (F)' },
                    'microfarads': { factor: 0.000001, name: 'Microfarads (μF)' },
                    'henries': { factor: 1, name: 'Henries (H)' },
                    'millihenries': { factor: 0.001, name: 'Millihenries (mH)' },
                    'tesla': { factor: 1, name: 'Tesla (T)' },
                    'gauss': { factor: 0.0001, name: 'Gauss (G)' }
                }
            },
            waves: {
                name: 'Waves, Light & Sound',
                units: {
                    'hertz': { factor: 1, name: 'Hertz (Hz)' },
                    'kilohertz': { factor: 1000, name: 'Kilohertz (kHz)' },
                    'megahertz': { factor: 1000000, name: 'Megahertz (MHz)' },
                    'gigahertz': { factor: 1000000000, name: 'Gigahertz (GHz)' },
                    'nanometers': { factor: 0.000000001, name: 'Nanometers (nm)' },
                    'micrometers': { factor: 0.000001, name: 'Micrometers (μm)' },
                    'decibels': { factor: 1, name: 'Decibels (dB)' },
                    'lumens': { factor: 1, name: 'Lumens (lm)' },
                    'candela': { factor: 1, name: 'Candela (cd)' },
                    'lux': { factor: 1, name: 'Lux (lx)' },
                    'gray': { factor: 1, name: 'Gray (Gy)' },
                    'sievert': { factor: 1, name: 'Sievert (Sv)' }
                }
            },
            chemistry: {
                name: 'Chemistry & Material Science',
                units: {
                    'molarity': { factor: 1, name: 'Molarity (M)' },
                    'molality': { factor: 1, name: 'Molality (m)' },
                    'ppm': { factor: 1, name: 'Parts per Million (ppm)' },
                    'ppb': { factor: 0.001, name: 'Parts per Billion (ppb)' },
                    'percentage': { factor: 1, name: 'Percentage (%)' },
                    'kg-per-cubic-meter': { factor: 1, name: 'kg/m³' },
                    'g-per-cubic-centimeter': { factor: 1000, name: 'g/cm³' },
                    'ph': { factor: 1, name: 'pH Scale' },
                    'pascal-seconds': { factor: 1, name: 'Pascal-Seconds (Pa⋅s)' },
                    'centipoise': { factor: 0.001, name: 'Centipoise (cP)' }
                }
            },
            astronomy: {
                name: 'Astronomy & Space',
                units: {
                    'astronomical-units': { factor: 1.496e11, name: 'Astronomical Units (AU)' },
                    'light-years': { factor: 9.461e15, name: 'Light Years (ly)' },
                    'parsecs': { factor: 3.086e16, name: 'Parsecs (pc)' },
                    'earth-radii': { factor: 6.371e6, name: 'Earth Radii (R⊕)' },
                    'solar-radii': { factor: 6.96e8, name: 'Solar Radii (R☉)' },
                    'lunar-distance': { factor: 3.844e8, name: 'Lunar Distance (LD)' },
                    'solar-masses': { factor: 1.989e30, name: 'Solar Masses (M☉)' },
                    'stellar-magnitude': { factor: 1, name: 'Stellar Magnitude (mag)' }
                }
            },
            biology: {
                name: 'Biology & Medicine',
                units: {
                    'beats-per-minute': { factor: 1, name: 'Beats per Minute (BPM)' },
                    'mmHg': { factor: 1, name: 'Millimeters of Mercury (mmHg)' },
                    'celsius-body': { factor: 1, name: 'Body Temperature (°C)' },
                    'fahrenheit-body': { factor: 1, name: 'Body Temperature (°F)' },
                    'bmi': { factor: 1, name: 'Body Mass Index (BMI)' },
                    'mg-per-kg': { factor: 1, name: 'mg/kg' },
                    'mcg-per-kg': { factor: 0.001, name: 'μg/kg' },
                    'oxygen-saturation': { factor: 1, name: 'Oxygen Saturation (%)' }
                }
            },
            computing: {
                name: 'Information & Computing',
                units: {
                    'bytes': { factor: 1, name: 'Bytes (B)' },
                    'kilobytes': { factor: 1024, name: 'Kilobytes (KB)' },
                    'megabytes': { factor: 1048576, name: 'Megabytes (MB)' },
                    'gigabytes': { factor: 1073741824, name: 'Gigabytes (GB)' },
                    'terabytes': { factor: 1099511627776, name: 'Terabytes (TB)' },
                    'megahertz': { factor: 1000000, name: 'Megahertz (MHz)' },
                    'gigahertz': { factor: 1000000000, name: 'Gigahertz (GHz)' },
                    'flops': { factor: 1, name: 'FLOPS' },
                    'megaflops': { factor: 1000000, name: 'MFLOPS' },
                    'gigaflops': { factor: 1000000000, name: 'GFLOPS' },
                    'bits-per-second': { factor: 1, name: 'Bits per Second (bps)' },
                    'kilobits-per-second': { factor: 1000, name: 'Kilobits per Second (kbps)' },
                    'megabits-per-second': { factor: 1000000, name: 'Megabits per Second (Mbps)' },
                    'gigabits-per-second': { factor: 1000000000, name: 'Gigabits per Second (Gbps)' },
                    'pixels': { factor: 1, name: 'Pixels' },
                    'dpi': { factor: 1, name: 'Dots per Inch (DPI)' },
                    'ppi': { factor: 1, name: 'Pixels per Inch (PPI)' }
                }
            },
            everyday: {
                name: 'Everyday & Practical',
                units: {
                    'degrees': { factor: 1, name: 'Degrees (°)' },
                    'radians': { factor: 57.2958, name: 'Radians (rad)' },
                    'gradians': { factor: 0.9, name: 'Gradians (grad)' },
                    'decibels': { factor: 1, name: 'Decibels (dB)' },
                    'lux': { factor: 1, name: 'Lux (lx)' },
                    'lumens': { factor: 1, name: 'Lumens (lm)' },
                    'cups': { factor: 0.000236588, name: 'Cups' },
                    'teaspoons': { factor: 0.00000492892, name: 'Teaspoons (tsp)' },
                    'tablespoons': { factor: 0.0000147868, name: 'Tablespoons (tbsp)' },
                    'ounces-fluid': { factor: 0.0000295735, name: 'Fluid Ounces (fl oz)' },
                    'mpg': { factor: 1, name: 'Miles per Gallon (mpg)' },
                    'liters-per-100km': { factor: 1, name: 'Liters per 100 km (L/100km)' },
                    'km-per-liter': { factor: 1, name: 'Kilometers per Liter (km/L)' }
                }
            }
        };
        
        // Initialize with basic category
        this.currentConversionCategory = 'basic';
    }

    initializeOrbital() {
        this.gravitationalConstant = 6.67430e-11; // m³/(kg⋅s²)
    }

    initializeScientific() {
        this.sciCurrentOperand = '';
        this.sciPreviousOperand = '';
        this.sciOperation = undefined;
        this.sciShouldResetDisplay = false;
        
        // Mathematical constants
        this.constants = {
            'pi': Math.PI,
            'e': Math.E
        };
    }

    // Basic Calculator Methods
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    getOperationSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '-';
            case '×': return '×';
            case '÷': return '÷';
            default: return '';
        }
    }

    // Scientific Calculator Methods
    appendNumberScientific(number) {
        if (this.sciShouldResetDisplay) {
            this.sciCurrentOperand = '';
            this.sciShouldResetDisplay = false;
        }
        
        if (number === '.' && this.sciCurrentOperand.includes('.')) return;
        this.sciCurrentOperand = this.sciCurrentOperand.toString() + number.toString();
        this.updateScientificDisplay();
    }

    chooseOperationScientific(operation) {
        if (this.sciCurrentOperand === '') return;
        if (this.sciPreviousOperand !== '') {
            this.computeScientific();
        }
        
        this.sciOperation = operation;
        this.sciPreviousOperand = this.sciCurrentOperand;
        this.sciCurrentOperand = '';
        this.updateScientificDisplay();
    }


    clearScientific() {
        this.sciCurrentOperand = '';
        this.sciPreviousOperand = '';
        this.sciOperation = undefined;
        this.updateScientificDisplay();
    }

    deleteScientific() {
        this.sciCurrentOperand = this.sciCurrentOperand.toString().slice(0, -1);
        this.updateScientificDisplay();
    }

    updateScientificDisplay() {
        this.sciCurrentOperandElement.textContent = this.getDisplayNumber(this.sciCurrentOperand);
        
        if (this.sciOperation != null) {
            this.sciPreviousOperandElement.textContent = 
                `${this.getDisplayNumber(this.sciPreviousOperand)} ${this.getOperationSymbol(this.sciOperation)}`;
        } else {
            this.sciPreviousOperandElement.textContent = '';
        }
    }

    executeFunction(func) {
        const value = parseFloat(this.sciCurrentOperand);
        if (isNaN(value)) return;

        let result;
        const angleInRadians = this.angleMode === 'deg' ? value * Math.PI / 180 : value;

        switch (func) {
            case 'sin':
                result = Math.sin(angleInRadians);
                break;
            case 'cos':
                result = Math.cos(angleInRadians);
                break;
            case 'tan':
                result = Math.tan(angleInRadians);
                break;
            case 'asin':
                result = Math.asin(value);
                if (this.angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(value);
                if (this.angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(value);
                if (this.angleMode === 'deg') result = result * 180 / Math.PI;
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'pow':
                // For x^y, we need to store the current value and wait for the next number
                this.sciPreviousOperand = this.sciCurrentOperand;
                this.sciOperation = 'pow';
                this.sciCurrentOperand = '';
                this.updateScientificDisplay();
                return;
            case 'factorial':
                result = this.factorial(Math.floor(value));
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'floor':
                result = Math.floor(value);
                break;
            case 'ceil':
                result = Math.ceil(value);
                break;
            case 'round':
                result = Math.round(value);
                break;
            case 'inv':
                result = 1 / value;
                break;
            case 'neg':
                result = -value;
                break;
            case 'pow10':
                result = Math.pow(10, value);
                break;
            case 'pow2':
                result = Math.pow(2, value);
                break;
            case 'mod':
                // For mod, we need to store the current value and wait for the next number
                this.sciPreviousOperand = this.sciCurrentOperand;
                this.sciOperation = 'mod';
                this.sciCurrentOperand = '';
                this.updateScientificDisplay();
                return;
            case 'rand':
                result = Math.random();
                break;
            case 'deg':
                this.angleMode = 'deg';
                return;
            case 'rad':
                this.angleMode = 'rad';
                return;
            default:
                return;
        }

        this.sciCurrentOperand = result;
        this.sciShouldResetDisplay = true;
        this.updateScientificDisplay();
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    insertConstant(constant) {
        if (this.sciShouldResetDisplay) {
            this.sciCurrentOperand = '';
            this.sciShouldResetDisplay = false;
        }
        
        this.sciCurrentOperand = this.constants[constant].toString();
        this.updateScientificDisplay();
    }

    executeMemoryOperation(operation) {
        const value = parseFloat(this.sciCurrentOperand) || 0;
        
        switch (operation) {
            case 'mc':
                this.memory = 0;
                break;
            case 'mr':
                this.sciCurrentOperand = this.memory.toString();
                this.updateScientificDisplay();
                break;
            case 'm+':
                this.memory += value;
                break;
            case 'm-':
                this.memory -= value;
                break;
        }
    }

    // Enhanced compute for scientific operations
    computeScientific() {
        let computation;
        const prev = parseFloat(this.sciPreviousOperand);
        const current = parseFloat(this.sciCurrentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.sciOperation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case 'pow':
                computation = Math.pow(prev, current);
                break;
            case 'mod':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.sciCurrentOperand = computation;
        this.sciOperation = undefined;
        this.sciPreviousOperand = '';
        this.sciShouldResetDisplay = true;
        this.updateScientificDisplay();
    }

    // Mode Switching
    switchMode(mode) {
        // Update active mode button
        this.modeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Update active calculator
        this.calculators.forEach(calc => calc.classList.remove('active'));
        document.querySelector(`.${mode}-calc`).classList.add('active');
        
        // Initialize conversions when switching to conversions mode
        if (mode === 'conversions') {
            setTimeout(() => {
                this.updateConversionUnits();
            }, 50);
        }
    }

    // Unit Conversions
    updateConversionUnits() {
        const category = this.conversionCategory ? this.conversionCategory.value || 'basic' : 'basic';
        const categoryData = this.conversionCategories[category];
        
        if (!categoryData || !this.fromUnit) {
            return;
        }
        
        // Clear existing options
        this.fromUnit.innerHTML = '';
        
        // Add new options
        Object.entries(categoryData.units).forEach(([key, unit]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = unit.name;
            this.fromUnit.appendChild(option);
        });
        
        // Show placeholder message
        this.showPlaceholderMessage();
    }

    showPlaceholderMessage() {
        if (this.conversionResults) {
            this.conversionResults.innerHTML = `
                <div class="placeholder-message">
                    <div class="placeholder-icon">🌌</div>
                    <p>Select a unit and enter a value to see conversions</p>
                </div>
            `;
        }
        this.updateResultCount(0);
    }

    updateResultCount(count) {
        const resultCountElement = document.getElementById('result-count');
        if (resultCountElement) {
            resultCountElement.textContent = `${count} result${count !== 1 ? 's' : ''}`;
        }
    }

    updateConversions() {
        const value = parseFloat(this.conversionValue.value);
        const category = this.conversionCategory.value;
        const fromUnit = this.fromUnit.value;
        
        if (isNaN(value) || value === '') {
            this.showPlaceholderMessage();
            return;
        }
        
        const categoryData = this.conversionCategories[category];
        const fromUnitData = categoryData.units[fromUnit];
        
        // Handle temperature conversions specially
        if (fromUnitData.isTemperature) {
            this.updateTemperatureConversions(value, fromUnit, categoryData.units);
            return;
        }
        
        // Handle special cases like fuel efficiency
        if (category === 'everyday' && (fromUnit === 'mpg' || fromUnit === 'liters-per-100km' || fromUnit === 'km-per-liter')) {
            this.updateFuelEfficiencyConversions(value, fromUnit);
            return;
        }
        
        // Standard conversion
        const baseValue = value * fromUnitData.factor;
        let resultCount = 0;
        
        let html = '';
        Object.entries(categoryData.units).forEach(([key, unit]) => {
            if (key === fromUnit) return; // Skip the source unit
            
            let convertedValue;
            if (unit.isTemperature) {
                // Temperature conversions are handled separately
                return;
            } else {
                convertedValue = baseValue / unit.factor;
            }
            
            const formattedValue = this.formatScientific(convertedValue);
            html += `
                <div class="result-item-enhanced">
                    <span class="result-label-enhanced">${unit.name}</span>
                    <span class="result-value-enhanced">${formattedValue}</span>
                </div>
            `;
            resultCount++;
        });
        
        this.conversionResults.innerHTML = html;
        this.updateResultCount(resultCount);
    }

    updateTemperatureConversions(value, fromUnit, units) {
        let celsius, fahrenheit, kelvin;
        
        // Convert to Celsius first
        switch (fromUnit) {
            case 'celsius':
            case 'celsius-body':
                celsius = value;
                break;
            case 'fahrenheit':
            case 'fahrenheit-body':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to others
        fahrenheit = celsius * 9/5 + 32;
        kelvin = celsius + 273.15;
        
        let html = '';
        let resultCount = 0;
        Object.entries(units).forEach(([key, unit]) => {
            if (key === fromUnit) return;
            
            let convertedValue;
            switch (key) {
                case 'celsius':
                case 'celsius-body':
                    convertedValue = celsius;
                    break;
                case 'fahrenheit':
                case 'fahrenheit-body':
                    convertedValue = fahrenheit;
                    break;
                case 'kelvin':
                    convertedValue = kelvin;
                    break;
                default:
                    return;
            }
            
            const formattedValue = this.formatScientific(convertedValue);
            html += `
                <div class="result-item-enhanced">
                    <span class="result-label-enhanced">${unit.name}</span>
                    <span class="result-value-enhanced">${formattedValue}</span>
                </div>
            `;
            resultCount++;
        });
        
        this.conversionResults.innerHTML = html;
        this.updateResultCount(resultCount);
    }

    updateFuelEfficiencyConversions(value, fromUnit) {
        let mpg, l100km, kml;
        
        // Convert to mpg first
        switch (fromUnit) {
            case 'mpg':
                mpg = value;
                l100km = 235.214 / value;
                kml = value * 0.425144;
                break;
            case 'liters-per-100km':
                l100km = value;
                mpg = 235.214 / value;
                kml = 100 / value;
                break;
            case 'km-per-liter':
                kml = value;
                mpg = value * 2.35214;
                l100km = 100 / value;
                break;
        }
        
        const html = `
            <div class="result-item-enhanced">
                <span class="result-label-enhanced">Miles per Gallon (mpg)</span>
                <span class="result-value-enhanced">${this.formatScientific(mpg)}</span>
            </div>
            <div class="result-item-enhanced">
                <span class="result-label-enhanced">Liters per 100 km (L/100km)</span>
                <span class="result-value-enhanced">${this.formatScientific(l100km)}</span>
            </div>
            <div class="result-item-enhanced">
                <span class="result-label-enhanced">Kilometers per Liter (km/L)</span>
                <span class="result-value-enhanced">${this.formatScientific(kml)}</span>
            </div>
        `;
        
        this.conversionResults.innerHTML = html;
        this.updateResultCount(3);
    }

    handleQuickAction(action) {
        switch (action) {
            case 'swap-units':
                // For now, just clear and reset
                this.conversionValue.value = '';
                this.showPlaceholderMessage();
                break;
            case 'clear-conversion':
                this.conversionValue.value = '';
                this.showPlaceholderMessage();
                break;
            case 'copy-result':
                this.copyResultsToClipboard();
                break;
        }
    }

    copyResultsToClipboard() {
        const results = this.conversionResults.textContent;
        if (results && results.trim() !== '') {
            navigator.clipboard.writeText(results).then(() => {
                // Show feedback
                const copyBtn = document.querySelector('[data-action="copy-result"]');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            });
        }
    }

    formatScientific(number) {
        if (number === 0) return '0';
        if (Math.abs(number) >= 1e6 || Math.abs(number) < 1e-3) {
            return number.toExponential(3);
        }
        return number.toLocaleString('en', { maximumFractionDigits: 6 });
    }

    // Orbital Calculations
    calculateOrbital() {
        const radius = parseFloat(this.orbitalRadius.value);
        const centralMass = parseFloat(this.centralMass.value);
        const orbitalMass = parseFloat(this.orbitalMass.value);
        
        if (isNaN(radius) || isNaN(centralMass) || isNaN(orbitalMass)) {
            this.orbitalResults.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Please enter valid values for all fields</p>';
            return;
        }
        
        if (radius <= 0 || centralMass <= 0 || orbitalMass <= 0) {
            this.orbitalResults.innerHTML = '<p style="color: #ff6b6b; text-align: center;">All values must be positive</p>';
            return;
        }
        
        // Convert radius from km to meters
        const radiusInMeters = radius * 1000;
        
        // Calculate orbital velocity (m/s)
        const orbitalVelocity = Math.sqrt(this.gravitationalConstant * centralMass / radiusInMeters);
        
        // Calculate orbital period (seconds)
        const orbitalPeriod = 2 * Math.PI * radiusInMeters / orbitalVelocity;
        
        // Calculate escape velocity (m/s)
        const escapeVelocity = Math.sqrt(2 * this.gravitationalConstant * centralMass / radiusInMeters);
        
        // Calculate gravitational force (N)
        const gravitationalForce = this.gravitationalConstant * centralMass * orbitalMass / (radiusInMeters * radiusInMeters);
        
        // Calculate orbital energy (J)
        const orbitalEnergy = -this.gravitationalConstant * centralMass * orbitalMass / (2 * radiusInMeters);
        
        const results = [
            { label: 'Orbital Velocity', value: orbitalVelocity / 1000, unit: 'km/s' },
            { label: 'Orbital Period', value: orbitalPeriod / 3600, unit: 'hours' },
            { label: 'Orbital Period', value: orbitalPeriod / 86400, unit: 'days' },
            { label: 'Escape Velocity', value: escapeVelocity / 1000, unit: 'km/s' },
            { label: 'Gravitational Force', value: gravitationalForce, unit: 'N' },
            { label: 'Orbital Energy', value: orbitalEnergy, unit: 'J' }
        ];
        
        let html = '<h4 style="color: #4ecdc4; margin-bottom: 15px;">Orbital Parameters</h4>';
        results.forEach(result => {
            const formattedValue = this.formatScientific(result.value);
            html += `
                <div class="result-item">
                    <span class="result-label">${result.label}</span>
                    <span class="result-value">${formattedValue} ${result.unit}</span>
                </div>
            `;
        });
        
        this.orbitalResults.innerHTML = html;
    }

    // Keyboard Support
    handleKeyboard(e) {
        // Don't interfere if user is typing in conversion input
        if (e.target === this.conversionValue) {
            return;
        }
        
        e.preventDefault();
        
        const activeMode = document.querySelector('.mode-btn.active').dataset.mode;
        
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            if (activeMode === 'scientific') {
                this.appendNumberScientific(e.key);
            } else {
                this.appendNumber(e.key);
            }
        }
        
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            const operator = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
            if (activeMode === 'scientific') {
                this.chooseOperationScientific(operator);
            } else {
                this.chooseOperation(operator);
            }
        }
        
        if (e.key === 'Enter' || e.key === '=') {
            if (activeMode === 'scientific') {
                this.computeScientific();
            } else {
                this.compute();
            }
        }
        
        if (e.key === 'Escape') {
            if (activeMode === 'scientific') {
                this.clearScientific();
            } else {
                this.clear();
            }
        }
        
        if (e.key === 'Backspace') {
            if (activeMode === 'scientific') {
                this.deleteScientific();
            } else {
                this.delete();
            }
        }
        
        // Scientific calculator shortcuts
        if (activeMode === 'scientific') {
            switch (e.key.toLowerCase()) {
                case 's':
                    this.executeFunction('sin');
                    break;
                case 'c':
                    this.executeFunction('cos');
                    break;
                case 't':
                    this.executeFunction('tan');
                    break;
                case 'l':
                    this.executeFunction('log');
                    break;
                case 'n':
                    this.executeFunction('ln');
                    break;
                case 'r':
                    this.executeFunction('sqrt');
                    break;
                case 'p':
                    this.insertConstant('pi');
                    break;
                case 'e':
                    this.insertConstant('e');
                    break;
            }
        }
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new SpaceCalculator();
    
    // Handle intro page transition
    const introPage = document.getElementById('intro-page');
    const mainInterface = document.getElementById('main-interface');
    const startButton = document.getElementById('start-calculator');
    
    if (startButton) {
        startButton.addEventListener('click', () => {
            // Add transition effect
            introPage.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            introPage.style.opacity = '0';
            introPage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                introPage.style.display = 'none';
                mainInterface.style.display = 'block';
                mainInterface.style.opacity = '0';
                mainInterface.style.transform = 'scale(1.1)';
                
                // Fade in main interface
                setTimeout(() => {
                    mainInterface.style.transition = 'opacity 0.6s ease-in, transform 0.6s ease-in';
                    mainInterface.style.opacity = '1';
                    mainInterface.style.transform = 'scale(1)';
                }, 100);
            }, 800);
        });
    }
    
    // Force initialize conversion units
    setTimeout(() => {
        if (calculator.conversionCategory && calculator.fromUnit) {
            calculator.updateConversionUnits();
            calculator.showPlaceholderMessage();
        }
    }, 200);
});

// Simplified animations
document.addEventListener('DOMContentLoaded', () => {
    // Remove excessive animations for cleaner look
});
