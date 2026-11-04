# DearBubbl notes

## How to run it

1. In the project folder, run `npm install` once.
2. Start the app with `npm start`.
3. Open `http://127.0.0.1:3000` in a browser.

The OpenAI key is read only from `.env`. The model is `gpt-5.6-luna`. If the AI cannot answer, the app tells you to check `.env` and the internet connection. The key is never sent to the page.

## What’s done

- Version 1 focuses on one complete session: pick a doorway, write what feels okay, send once, receive Bubbl’s supportive reply, and get one optional small step toward talking with another person.
- Safety reminders are visible before and during chat. The app blocks common private details, has a high-risk support message with 911/988, never pressures the student to keep sharing, and disables Send while it shows “Thinking…”.
- Conversation entries and sample next steps save in the browser through `public/storage.js` so the future database change has one small home.
- Saves on this computer only for now.
- Verified locally: the starter flow reaches a real OpenAI reply, shows `Thinking…` while waiting, saves the optional step, and warns before a sample address is sent.

## What’s next

### Maybe Later

- Add a student-friendly written-entry export for the competition PDF.
- Add a short video demo mode with captions and a privacy-safe presentation script.
- Add trusted-adult support and region-aware crisis resources.
- Add a real database and user accounts only after the safety/privacy design is reviewed.
- Add more carefully tested conversation starters, accessibility review, and moderated peer practice.
