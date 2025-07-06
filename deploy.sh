#!/bin/bash

# Auralo Website Deployment Script

echo "🚀 Deploying Auralo Website to Netlify..."
echo "========================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Are you in the auralo-website-fixed directory?"
    exit 1
fi

# Option selection
echo ""
echo "Choose deployment method:"
echo "1) Deploy to Netlify (without Git)"
echo "2) Commit changes and push to GitHub"
echo "3) Both (commit to Git AND deploy to Netlify)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "📦 Deploying directly to Netlify..."
        netlify deploy --prod --dir=.
        ;;
    2)
        echo "📝 Committing changes to Git..."
        git add .
        git commit -m "feat: Add enhanced popup with offer stack and advanced Quantum spoofing"
        git push origin main
        echo "✅ Pushed to GitHub. Connect your GitHub repo to Netlify for automatic deployment."
        ;;
    3)
        echo "📝 Committing changes to Git..."
        git add .
        git commit -m "feat: Add enhanced popup with offer stack and advanced Quantum spoofing"
        git push origin main
        echo "✅ Pushed to GitHub"
        echo ""
        echo "📦 Deploying to Netlify..."
        netlify deploy --prod --dir=.
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Test the live site on mobile devices"
echo "2. Verify €19.50 price is maintained"
echo "3. Check Mercury provider selection"
echo "4. Monitor conversion rates"

# Make executable: chmod +x deploy.sh
# Run with: ./deploy.sh