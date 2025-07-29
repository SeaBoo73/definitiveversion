#!/bin/bash

# SeaGO Backup System - Preserve all updates
# Automatically saves versions with timestamp

TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 SeaGO Backup System - Saving current versions..."

# Backup mobile preview
if [ -f "mobile-preview.html" ]; then
    cp mobile-preview.html "mobile-preview-$TIMESTAMP.html"
    echo "✅ Mobile preview saved: mobile-preview-$TIMESTAMP.html"
fi

# Backup native preview  
if [ -f "native-app-preview.html" ]; then
    cp native-app-preview.html "native-app-preview-$TIMESTAMP.html"
    echo "✅ Native preview saved: native-app-preview-$TIMESTAMP.html"
fi

# Backup main configuration
if [ -f "replit.md" ]; then
    cp replit.md "replit-$TIMESTAMP.md"
    echo "✅ Configuration saved: replit-$TIMESTAMP.md"
fi

# Show current backups
echo ""
echo "📁 Current backup files:"
ls -la *-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]_[0-9][0-9][0-9][0-9][0-9][0-9].* | tail -5

echo ""
echo "💾 Backup completed successfully!"