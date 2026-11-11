# DearBubbl notes

## How to run it

1. In the project folder, run `npm install` once.
2. Start the app with `npm start`.
3. Open `http://127.0.0.1:3000` in a browser.

Keep the `npm start` server running while using the app; if the page ever says it cannot connect, run that command again.

The OpenAI key is read only from `.env`. The model is `gpt-5.6-luna`. If the AI cannot answer, the app tells you to check `.env` and the internet connection. The key is never sent to the page.

## Vercel setup

- Vercel can detect this Express app automatically from `server.js`; the files in `public/` are the page and assets. No build command or database is needed for Version 1.
- In the Vercel project’s Environment Variables settings, add the secret value under the name `OPENAI_API_KEY` for Production. Add it to Preview too if you want preview links to answer. Redeploy after adding or changing it.
- The long `sk-...` text supplied for deployment is the secret value, not a valid Vercel variable name. Vercel variable names can use letters, numbers, and underscores, so the code uses `OPENAI_API_KEY` and never contains the secret.
- Keep `.env` and `.env*` ignored. Browser saving still works locally and online; there is no database yet.

## What’s done

- Version 1 focuses on one complete session: pick a doorway, write what feels okay, send once, receive Bubbl’s supportive reply, and get one optional small step toward talking with another person.
- Safety reminders are visible before and during chat. The app blocks common private details, has a high-risk support message with 911/988, never pressures the student to keep sharing, and disables Send while it shows “Thinking…”.
- The Daily Social Goal tracker shows three checklist tasks for today and gives a thumbs-up when each one is completed.
- Clicking Bubbl's `b` icon opens a speaking-style chooser with Friendly, Casual/Chatty, Empathetic, and Upbeat options. The choice saves in the browser and is applied to the next AI message.
- The header and hero now use the supplied DearBubbl logo, and the promotion line says “Always a place to land.”
- The page now uses a pale blue and white cloud background, dark navy text, and varied pastel button colors.
- The large hero logo now sits on a white circle so it stays clear over the cloud background.
- Completing a daily goal now opens a small square blind-box sticky note with a paper-plane trail and light animation: 25 Common yellow notes, 25 Rare purple notes, 25 Super Rare pink notes, and 25 Legendary blue notes. Found notes stay in the browser collection without repeats. The quote text uses a handwriting style, and the top Gallery button opens the organized collection in its own popup.
- Conversation entries and sample next steps save in the browser through `public/storage.js` so the future database change has one small home.
- Saves on this computer only for now.
- After each save point, push it to GitHub.
- Verified locally: the starter flow reaches a real OpenAI reply, shows `Thinking…` while waiting, saves the optional step, and warns before a sample address is sent.

## What’s next

### Maybe Later

- Add a student-friendly written-entry export for the competition PDF.
- Add a short video demo mode with captions and a privacy-safe presentation script.
- Add trusted-adult support and region-aware crisis resources.
- Add a real database and user accounts only after the safety/privacy design is reviewed.
- Add more carefully tested conversation starters, accessibility review, and moderated peer practice.
