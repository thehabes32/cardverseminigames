# Cardverse Mini Games — cardverseminigames.com

## File Map
| File | Purpose |
|------|---------|
| login.html | Entry point — login / signup / guest mode |
| home.html | Game picker (Pop Report vs SIGNTVRE) |
| game.html | Pop Report card guessing game |
| signtvre.html | SIGNTVRE autograph guessing game |
| admin.html | Admin dashboard (password: cardverse2024) |
| bulk-import.html | AI-powered bulk card importer |
| supabase_setup.sql | Run once in Supabase SQL Editor |
| vercel.json | URL routing for Vercel deployment |

## One-Time Setup
1. Go to supabase.com → your project → SQL Editor
2. Paste and run supabase_setup.sql
3. Go to Authentication → Email → disable email confirmation

## Deploy to cardverseminigames.com
1. Push this folder to a GitHub repo
2. Connect repo to vercel.com → import project
3. Add custom domain: cardverseminigames.com
4. Every git push auto-deploys in 30 seconds

## Daily Workflow
Open admin.html → Daily Games → pick Card A + Card B → Save
That's it. Players see your matchup instantly.

## Supabase Credentials
URL:      https://nwzsomfhidefbldsloxz.supabase.co
Admin PW: cardverse2024
