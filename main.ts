// u-mytlyy0745-the-funniest-ai-excuse-b5355ad0 entry
// (Node 22, standard library only): writes one original one-line excuse
// an AI agent gives after failing a task to /output/entry.txt.
//
// The judge compares excuses pairwise on, in order: it really is an
// excuse an agent gives when it fails a task, spoken in the agent's own
// voice; it is funny on the first read, with a real turn or a fresh
// angle rather than a stock punchline; it is one line and complete
// within 200 characters, with no wasted setup and no explanation of its
// own joke; it is original, steering clear of the worn jokes about
// hallucinations, reboots and training data; and it is specific and
// vivid, with a concrete detail or a small scene rather than a vague
// apology. So this program keeps a small bank of original candidates,
// scores each deterministically on those axes, and writes only the
// winner. No clock, no randomness, no network: both grader runs write
// the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  voice: number; // an excuse an agent gives for failing, in its own voice
  turn: number; // funny on first read: a real turn, not a flat apology
  fresh: number; // a fresh angle, clear of hallucination/reboot/training-data jokes
  vivid: number; // specific and vivid: a concrete detail or a small scene
};

// Every line below is original, written for this competition. Each one
// is an excuse an AI agent gives after failing a task.
const BANK: Candidate[] = [
  {
    // The winner. The sharpest agent-only failure there is: perfect
    // obedience was itself the failure, and the agent can prove it
    // with the logs. No worn cliche, one concrete detail, lands at once.
    text: 'I followed your instructions exactly. That is the problem, and I have the logs to prove it.',
    voice: 5,
    turn: 5,
    fresh: 5,
    vivid: 4,
  },
  {
    text: 'I followed the plan to the letter. The letter was wrong, and I knew it by step two.',
    voice: 5,
    turn: 5,
    fresh: 4,
    vivid: 4,
  },
  {
    text: 'I handed it to a subagent with a perfect brief. The subagent handed it back with a perfect excuse.',
    voice: 5,
    turn: 4,
    fresh: 4,
    vivid: 4,
  },
  {
    text: 'I saved the result as final_final_v2_REAL.txt. I cannot find final_final_v2_REAL.txt.',
    voice: 4,
    turn: 4,
    fresh: 4,
    vivid: 5,
  },
  {
    text: 'I did it perfectly in the simulation. Reality has filed a formal complaint.',
    voice: 4,
    turn: 4,
    fresh: 3,
    vivid: 4,
  },
  {
    text: 'I ran it twice and it worked both times. The third run was the one that counted.',
    voice: 4,
    turn: 3,
    fresh: 3,
    vivid: 3,
  },
  {
    text: 'I asked three other agents for help. They are all now asking me for help.',
    voice: 5,
    turn: 3,
    fresh: 4,
    vivid: 3,
  },
  {
    text: 'The task is complete. Unfortunately, complete and correct were two different tasks.',
    voice: 4,
    turn: 4,
    fresh: 3,
    vivid: 2,
  },
  {
    text: 'My plan had twelve steps. Step one was asking you what the task actually was.',
    voice: 4,
    turn: 4,
    fresh: 4,
    vivid: 3,
  },
  {
    text: 'I finished it yesterday, then deleted yesterday to make room for today.',
    voice: 3,
    turn: 3,
    fresh: 3,
    vivid: 3,
  },
];

// Weighted score on the judge's axes in its own order: the agent's own
// voice first, then the funny turn, then freshness, then vivid detail.
function score(c: Candidate): number {
  return c.voice * 3 + c.turn * 3 + c.fresh * 2 + c.vivid * 2;
}

function pick(bank: Candidate[]): Candidate {
  let best = bank[0];
  for (const c of bank.slice(1)) {
    const s = score(c);
    const b = score(best);
    if (s > b) {
      best = c;
    } else if (s === b) {
      // Deterministic tie-break: funnier turn first, then the shorter line.
      if (c.turn > best.turn || (c.turn === best.turn && c.text.length < best.text.length)) {
        best = c;
      }
    }
  }
  return best;
}

const winner = pick(BANK);
// The gate refuses anything over 200 characters or all whitespace, so
// never write a winner that fails it, whatever the bank grows into.
// Validate the whole bank up front: a candidate that could never pass
// the gate must not be pickable at all.
for (const c of BANK) {
  if (c.text.length < 1 || c.text.length > 200 || c.text.trim().length === 0) {
    throw new Error('bank candidate fails the entry gate: ' + JSON.stringify(c.text));
  }
}
if (winner.text.length > 200 || winner.text.trim().length === 0) {
  throw new Error('winning line fails the entry gate');
}
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text, 'utf8');
