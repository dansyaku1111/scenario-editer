#!/usr/bin/env pwsh
# 診断スクリプト - プロジェクトの状態を確認

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  シナリオエディタ 診断スクリプト" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 環境確認
Write-Host "1. 環境確認" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host "現在のディレクトリ: " -NoNewline
$currentDir = Get-Location
Write-Host $currentDir -ForegroundColor Green

Write-Host "Node.js: " -NoNewline
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host $nodeVersion -ForegroundColor Green
} else {
    Write-Host "インストールされていません" -ForegroundColor Red
}

Write-Host "npm: " -NoNewline
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host $npmVersion -ForegroundColor Green
} else {
    Write-Host "インストールされていません" -ForegroundColor Red
}
Write-Host ""

# 2. ファイル構成確認
Write-Host "2. ファイル構成確認" -ForegroundColor Yellow
Write-Host "-------------------"

$requiredFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "index.html",
    "src/main.tsx",
    "src/App.tsx"
)

foreach ($file in $requiredFiles) {
    Write-Host "$file : " -NoNewline
    if (Test-Path $file) {
        Write-Host "✓" -ForegroundColor Green
    } else {
        Write-Host "✗ 見つかりません" -ForegroundColor Red
    }
}
Write-Host ""

# 3. node_modules確認
Write-Host "3. 依存関係の確認" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host "node_modules: " -NoNewline
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "✓ ($moduleCount パッケージ)" -ForegroundColor Green
} else {
    Write-Host "✗ 見つかりません（npm install が必要）" -ForegroundColor Red
}
Write-Host ""

# 4. ビルド成果物確認
Write-Host "4. ビルド成果物の確認" -ForegroundColor Yellow
Write-Host "-------------------"
Write-Host "dist/: " -NoNewline
if (Test-Path "dist") {
    if (Test-Path "dist/index.html") {
        Write-Host "✓ ビルド済み" -ForegroundColor Green
    } else {
        Write-Host "✗ ビルド不完全" -ForegroundColor Red
    }
} else {
    Write-Host "✗ ビルドされていません（npm run build が必要）" -ForegroundColor Yellow
}
Write-Host ""

# 5. 重要ファイルのチェック
Write-Host "5. ノードファイルの確認" -ForegroundColor Yellow
Write-Host "-------------------"

$nodeFiles = @(
    "src/components/NodeTypes/StartNode.ts",
    "src/components/NodeTypes/EndNode.ts",
    "src/components/NodeTypes/ActionNode.ts",
    "src/components/NodeTypes/CharacterNode.ts",
    "src/components/NodeTypes/sockets.ts"
)

$allNodesExist = $true
foreach ($file in $nodeFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file" -ForegroundColor Red
        $allNodesExist = $false
    }
}
Write-Host ""

# 6. package.jsonの内容確認
Write-Host "6. スクリプト確認" -ForegroundColor Yellow
Write-Host "-------------------"
if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "利用可能なコマンド:"
    $pkg.scripts.PSObject.Properties | ForEach-Object {
        Write-Host "  npm run $($_.Name)" -ForegroundColor Cyan
    }
} else {
    Write-Host "  package.json が見つかりません" -ForegroundColor Red
}
Write-Host ""

# 7. 推奨アクション
Write-Host "7. 推奨アクション" -ForegroundColor Yellow
Write-Host "-------------------"

if (-not (Test-Path "node_modules")) {
    Write-Host "⚠ 依存関係をインストールしてください:" -ForegroundColor Yellow
    Write-Host "   npm install" -ForegroundColor Cyan
    Write-Host ""
}

if (-not (Test-Path "dist")) {
    Write-Host "💡 プロダクションビルドを実行できます:" -ForegroundColor Yellow
    Write-Host "   npm run build" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "🚀 開発サーバーを起動するには:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  診断完了" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
