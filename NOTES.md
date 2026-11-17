# Quibly notes

## How to run it

In the project folder, run:

    npm start

Then open http://127.0.0.1:3000 in a browser.

The OpenAI key is read only from .env, never sent to the page, and never printed. The model used is gpt-5.6-luna. If the AI cannot answer because the key expired or the internet is unavailable, Quibly shows a friendly message telling you to check .env and the internet connection.

## What is done

Quibly Version 1 follows the MVP order from BRIEF.md:

1. Paste notes → real OpenAI AI makes a personalized quiz game. The sample button makes the flow easy to demo.
2. Correct answers earn points, streaks, XP-style rewards, and update the small progress strip.
3. Quick quiz, Matching, and Speed round modes are selectable before generating; each mode has a different play UI.
4. The server sends the brief as the AI's system instructions with every request. Questions are required to stay inside the notes, use safe middle-school language, and avoid personal information.

Saving is in public/storage.js only, using browser localStorage. It saves points, games played, best streak, and the last few session summaries.

Saves on this computer only for now.

## MVP feature checks

| MVP feature | Works? | How to check |
| --- | --- | --- |
| Paste notes and get an AI-made quiz game | Yes | Click “Try a sample,” click “Make my game,” wait for “Thinking…” to finish, and confirm the game appears. |
| Earn points and rewards | Yes | Answer a question correctly, confirm points/streak update, finish the game, and confirm the results card shows XP. |
| Choose matching or speed rounds | Yes | Select “Matching” or “Speed round” before making a game; confirm the matching cards or 15-second timer appears. |
| AI gives correct, safe answers | Yes | Use the sample notes, verify every answer appears in those notes, and try adding an email/phone number to see the privacy block. |

## Maybe Later

- The user can report a wrong question so it is removed.
- The user can see which part of their notes each question came from.
- The user can replay questions they got wrong.
- The user can see a break reminder after playing for a while.
- The user can race a timer to beat their best score.
- The user can save a game set in the browser to play later.
- The user can see a progress bar of topics mastered.
- The user can ask the AI to explain a missed answer.

## Next

- Test with several real, teacher-reviewed note sets.
- Add the reporting and explanation features after the MVP is demonstrated.
- Review privacy and child-safety choices before adding accounts or a database.
- Add a short video-demo mode and a written-entry export for the competition.
