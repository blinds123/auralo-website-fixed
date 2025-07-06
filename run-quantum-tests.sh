#!/bin/bash

# PROJECT QUANTUM - Phone Emulator Test Runner
# Tests progressive spoofing methods to find simplest solution

echo "🚀 PROJECT QUANTUM - Phone Emulator Testing"
echo "=========================================="
echo ""

# Check if Playwright is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

# Install Playwright if needed
if [ ! -d "node_modules/@playwright/test" ]; then
    echo "📦 Installing Playwright..."
    npm install -D @playwright/test
    npx playwright install
fi

# Run tests with detailed output
echo "🧪 Starting emulator tests..."
echo ""

# Run tests and capture output
npx playwright test test-quantum-emulators.js --reporter=list

echo ""
echo "✅ Testing complete!"
echo ""
echo "Next steps:"
echo "1. Review test results above"
echo "2. Identify simplest working method"
echo "3. Update index.html to use that method"
echo "4. Re-test on all devices to confirm"

# Make executable: chmod +x run-quantum-tests.sh
# Run with: ./run-quantum-tests.sh