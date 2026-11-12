# Gauge

A pixel art shape game: in a forge, a piece of hot metal falls toward a mould dug into the floor. Turn it, flip it and place it so it fills the mould exactly.

*Version française : [README.md](README.md)*

## Controls

- **← →** (or **A D**): move the piece.
- **↑** (or **W**, **X**): turn it a quarter turn.
- **Shift** (or **C**): flip it, like in a mirror.
- **↓**: make it fall faster. **Space**: drop it at once.
- **Finger** or **mouse**: left or right to move, middle to turn, two quick taps in the middle to drop.
- **P** or **Esc**: pause, **Enter** to resume.

## How it works

- The **mould** is the shape dug into the floor, edged in red. The piece has the same shape, but turned: put it back the right way.
- The **dotted outline** shows where the piece will fall.
- If it fills the mould exactly, it turns to gold. Otherwise it's a **miss**: one heart less. Three misses and the forge goes out.
- Moulds get bigger and the piece falls faster and faster.
- From **round 5**, a **fake mould** that looks almost the same appears next to the real one. From **round 8**, you sometimes have to **flip** the piece.
- Points: 50 per cell, plus a bonus if you place it fast, plus 25% per piece landed in a row (up to +100%).

## Stats

The Records panel keeps your **best score**, the number of **games** and **pieces cast**.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Gauge → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
