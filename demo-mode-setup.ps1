# Demo Mode Setup Script
# This script helps you switch between demo mode and full Supabase mode

echo "🎯 IEC 61850 SCL Visualizer - Demo Mode Setup"
echo "=============================================="
echo ""

# Check current configuration
if ($env:NEXT_PUBLIC_SUPABASE_URL -and $env:NEXT_PUBLIC_SUPABASE_URL -ne "https://demo.supabase.co") {
    echo "✅ Current Status: Supabase is configured with real credentials"
    echo "📍 URL: $($env:NEXT_PUBLIC_SUPABASE_URL)"
    echo ""
    echo "To enable DEMO MODE, you need to temporarily disable Supabase:"
    echo ""
    echo "Option 1: Rename .env.local file temporarily"
    echo "Option 2: Comment out Supabase variables in .env.local"
    echo "Option 3: Set demo URLs in environment"
    echo ""
    
    $choice = Read-Host "Choose option (1/2/3) or press Enter to cancel"
    
    switch ($choice) {
        "1" {
            # Option 1: Rename .env.local
            if (Test-Path ".env.local") {
                Rename-Item ".env.local" ".env.local.backup"
                echo "✅ .env.local renamed to .env.local.backup"
                echo "🔄 Please restart the development server"
            }
        }
        "2" {
            # Option 2: Comment out variables
            $content = Get-Content ".env.local"
            $newContent = $content -replace "^(NEXT_PUBLIC_SUPABASE_URL=)", "# $1"
            $newContent = $newContent -replace "^(NEXT_PUBLIC_SUPABASE_ANON_KEY=)", "# $1"
            $newContent = $newContent -replace "^(SUPABASE_SERVICE_ROLE_KEY=)", "# $1"
            $newContent | Set-Content ".env.local"
            echo "✅ Supabase variables commented out"
            echo "🔄 Please restart the development server"
        }
        "3" {
            # Option 3: Set demo URLs
            $env:NEXT_PUBLIC_SUPABASE_URL = "https://demo.supabase.co"
            $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "demo-key"
            $env:SUPABASE_SERVICE_ROLE_KEY = "demo-service-key"
            echo "✅ Demo URLs set in current session"
            echo "🔄 Please restart the development server"
        }
        default {
            echo "❌ Operation cancelled"
        }
    }
} else {
    echo "✅ Current Status: Already in DEMO MODE"
    echo "🎯 All features are available without authentication"
    echo ""
    echo "To return to full Supabase mode:"
    echo ""
    
    if (Test-Path ".env.local.backup") {
        echo "Option 1: Restore .env.local from backup"
    }
    
    if (Test-Path ".env.local") {
        echo "Option 2: Uncomment Supabase variables in .env.local"
    }
    
    echo "Option 3: Set real Supabase URLs in environment"
    echo ""
    
    $choice = Read-Host "Choose option (1/2/3) or press Enter to stay in demo mode"
    
    switch ($choice) {
        "1" {
            if (Test-Path ".env.local.backup") {
                if (Test-Path ".env.local") {
                    Remove-Item ".env.local"
                }
                Rename-Item ".env.local.backup" ".env.local"
                echo "✅ .env.local restored from backup"
                echo "🔄 Please restart the development server"
            } else {
                echo "❌ No backup file found"
            }
        }
        "2" {
            $content = Get-Content ".env.local"
            $newContent = $content -replace "^# (NEXT_PUBLIC_SUPABASE_URL=)", "$1"
            $newContent = $newContent -replace "^# (NEXT_PUBLIC_SUPABASE_ANON_KEY=)", "$1"
            $newContent = $newContent -replace "^# (SUPABASE_SERVICE_ROLE_KEY=)", "$1"
            $newContent | Set-Content ".env.local"
            echo "✅ Supabase variables uncommented"
            echo "🔄 Please restart the development server"
        }
        "3" {
            echo "Please provide your Supabase credentials:"
            $url = Read-Host "Supabase URL"
            $anonKey = Read-Host "Anon Key"
            $serviceKey = Read-Host "Service Role Key"
            
            $env:NEXT_PUBLIC_SUPABASE_URL = $url
            $env:NEXT_PUBLIC_SUPABASE_ANON_KEY = $anonKey
            $env:SUPABASE_SERVICE_ROLE_KEY = $serviceKey
            echo "✅ Real Supabase credentials set"
            echo "🔄 Please restart the development server"
        }
        default {
            echo "✅ Remaining in demo mode"
        }
    }
}

echo ""
echo "🌐 Application URL: http://localhost:3000"
echo "📖 Documentation: See README.md for detailed instructions"