// Philosophy keys + display data
export type PhilKey =
  | "T" | "S" | "C" | "E" | "ON" | "U" | "SK" | "VT" | "CO" | "A" | "EP" | "D" | "B";

export const PHILOSOPHIES: { key: PhilKey; name: string; description: string }[] = [
  {
    key: "T",
    name: "Taoism",
    description:
      "Ancient Chinese philosophy emphasizing a sense of connectedness to the universe. It stresses specialization and inner peace with the rest of the world.",
  },
  {
    key: "S",
    name: "Stoicism",
    description:
      "Ancient Greek philosophy emphasizing focusing on what you can control. It stresses self discipline and making the most out of the worst circumstances.",
  },
  {
    key: "C",
    name: "Cynicism",
    description:
      "Ancient Greek philosophy emphasizing a lack of material possessions. It focuses on the intrinsic value of being alive and escaping societal controls and expectations.",
  },
  {
    key: "ON",
    name: "Optimistic Nihilism",
    description:
      "Nihilism is the belief/realization that there is no “meaning in life.” Optimistic Nihilism focuses on the benefits of the fact that nothing matters, encouraging freedom from social conventions and enjoying life.",
  },
  {
    key: "E",
    name: "Existentialism",
    description:
      "A popular response to nihilism, which encourages responding to a lack of objective meaning by creating one's own subjective meaning. It encourages being true to yourself and not being influenced by outside circumstances.",
  },
  {
    key: "U",
    name: "Utilitarianism",
    description:
      "The belief that every action should be for the good of the many — that an action's moral value is determined by whether it caused an increase in pleasure or a decrease in suffering. This also works in reverse.",
  },
  {
    key: "SK",
    name: "Skepticism",
    description:
      "The belief that we know nothing is 100 percent true. A common exception is that we know that we exist; in other words, “I think, therefore I am.”",
  },
  {
    key: "VT",
    name: "Virtue Theory",
    description:
      "An ancient Greek philosophy that emphasizes refining yourself into a person with good “virtues” such that you would naturally do good actions.",
  },
  {
    key: "CO",
    name: "Confucianism",
    description:
      "An ancient eastern philosophy that encourages a focus on tradition, family, culture, and being a good person in your societal role.",
  },
  {
    key: "A",
    name: "Absurdism",
    description:
      "An expansion on existentialism. It says to not only reject objective value, but to reject meaning altogether, embracing the absurdity and ultimate freedom that comes with life.",
  },
  {
    key: "EP",
    name: "Epicureanism",
    description:
      "An ancient Greek philosophy which states life's purpose is pleasure. It doesn't solely encourage succumbing to natural instincts like lust or gluttony, but instead focuses on what causes long term pleasure for life.",
  },
  {
    key: "D",
    name: "Determinism",
    description:
      "The belief that everything in the universe — every event in all of history — was not random and could theoretically be predicted ahead of time. It is a common argument against free will.",
  },
  {
    key: "B",
    name: "Buddhism",
    description:
      "An ancient eastern philosophy and religion. It emphasizes inner peace and harmony, not doing anything too little or too much. In short it's about balancing the goods and the bads in life, and escaping earthly attachment.",
  },
];

export type Effects = Partial<Record<PhilKey, number>>;

export interface Option {
  text: string;
  effects: Effects;
  // Philosophies that get PERMed by this answer:
  // - immediately set to max(current, 50)
  // - and from then on, cannot drop below 50
  perm?: PhilKey[];
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  // If provided, question only appears when this returns true
  showIf?: (answers: Record<string, number>) => boolean;
}

// Helper to find the question's selected index
const ans = (answers: Record<string, number>, id: string) => answers[id];

export const QUESTIONS: Question[] = [
  {
    id: "religion",
    text: "How religious are you?",
    options: [
      {
        // Original spec contained "015%SK" (interpreted as -15% SK) and a trailing
        // unattributed "+10%" which we omit since no philosophy was specified.
        text: "Very religious — I believe in a specific god/gods.",
        effects: { T: 10, E: -15, ON: -30, U: -10, SK: -15, VT: -10 },
      },
      {
        text: "Somewhat religious. I don't believe in a specific god, but I consider myself spiritual / feel a connection to a force outside the physical world.",
        effects: { T: 15, E: -10, ON: -15, SK: -5, A: -5, B: 20 },
      },
      {
        text: "I don't believe in god.",
        effects: { T: -5, SK: 10, E: 20, ON: 30, VT: -5, C: -5, A: 25, B: -10 },
      },
      {
        text: "I don't know / I have no opinion on whether God does or does not exist.",
        effects: { E: 15, ON: 5, S: 25, VT: -15, C: -15, A: 25 },
      },
    ],
  },
  {
    id: "objective-meaning",
    text: "Do you believe in objective meaning?",
    options: [
      {
        text: "Yes, I believe in objective meaning through god.",
        effects: { T: 10, S: 5, E: -15, ON: -20, U: 10, SK: -20, VT: 10, CO: 5, A: -15, B: 5 },
      },
      {
        text: "Yes, I believe in objective meaning, though I don't have a concrete reason.",
        effects: { T: 15, S: 10, E: -5, ON: -10, SK: -10, VT: 10, CO: 5, A: -10, B: 10 },
      },
      {
        text: "No, I don't believe in objective meaning, but I do believe in subjective meaning.",
        effects: { E: 25, SK: 5, VT: -10, A: 10 },
      },
      {
        text: "No, I don't believe in objective meaning, or that subjective meaning exists / matters.",
        effects: { E: 10, SK: 15, VT: -15, A: 25 },
      },
    ],
  },
  {
    id: "value",
    text: "Which of the following values do you think is the most important in life?",
    options: [
      {
        // Original spec had a stray unattributed "+10%" between U and CO; omitted.
        text: "Tradition",
        effects: { T: 10, C: -5, U: -5, CO: 25, EP: -5, B: 10 },
      },
      {
        text: "Pleasure",
        effects: { S: 10, C: 10, E: 5, ON: 5, U: 25, EP: 30 },
      },
      {
        text: "Honour (i.e. a moral code)",
        effects: { S: 10, U: 5, SK: -5, VT: 25, CO: 10, B: 5 },
      },
      {
        text: "Spirituality",
        effects: { T: 20, C: -10, E: -5, ON: -5, SK: -10, A: -5, B: 20 },
      },
    ],
  },
  {
    id: "free-will",
    text: "Do you believe that you have free will?",
    options: [
      {
        text: "Yes",
        effects: { B: 10, S: -5, E: -10, ON: -10, U: -5, SK: -25, A: -10 },
        perm: ["D"],
      },
      {
        text: "No",
        effects: { B: -10, S: 5, E: 10, ON: 10, U: 5, SK: 25, D: -20 },
      },
      {
        text: "Don't know",
        effects: { SK: 25 },
      },
    ],
  },
  {
    id: "happiness",
    text: "What is happiness to you?",
    options: [
      { text: "Inner peace.", effects: { B: 25, T: 15, S: 5 } },
      { text: "Living virtuously.", effects: { S: 10, VT: 20, CO: 5 } },
      { text: "Maximizing pleasure, minimizing pain.", effects: { EP: 30, U: 10 } },
      { text: "I don't know / it fluctuates.", effects: { E: 25, A: 10, ON: 15 } },
    ],
  },
  {
    id: "lifestyle",
    text: "Which of the following lifestyles is the most appealing?",
    options: [
      { text: "Going with the flow and enjoying the scenery.", effects: { T: 20, S: -10, B: 10, EP: 5 } },
      { text: "Living with action, discipline, and self control.", effects: { S: 25, VT: 25, CO: 15 } },
      { text: "Living with ultimate freedom.", effects: { E: 20, A: 25, ON: 20 } },
      { text: "Living a stress-free life, caring about close relationships.", effects: { EP: 25, B: 10, CO: 20 } },
    ],
  },
  {
    id: "good-person",
    text: "What makes someone a good person?",
    options: [
      { text: "Actions that lead to the betterment of society.", effects: { S: 5, U: 30, D: 5, EP: 15 } },
      { text: "Actions made with good intentions.", effects: { S: 10, E: 5, U: -5, VT: 5, CO: 10, B: 5 } },
      { text: "Having good virtues / vibes.", effects: { T: 15, S: 10, E: 5, CO: 20, VT: 25 } },
      { text: "Other / don't know / don't care.", effects: {} },
    ],
  },
  {
    id: "planning",
    text: "How much of your life do you plan?",
    options: [
      {
        text: "I focus on what I can control right now — the future is not in my hands.",
        effects: { S: 25, T: 15, B: 10, D: 10, E: -10, EP: -5 },
      },
      {
        text: "I plan carefully to maximize long-term wellbeing for myself and others.",
        effects: { U: 25, CO: 15, EP: 10, T: -10, A: -5, ON: -5 },
      },
      {
        text: "There's no grand plan — I make meaning as I go, day by day.",
        effects: { E: 20, A: 20, ON: 10, CO: -15, U: -10, S: -5 },
      },
      {
        text: "The future is largely predetermined. I accept the path as it unfolds.",
        effects: { D: 30, T: 10, B: 10, E: -15, S: -10, U: -5 },
      },
    ],
  },
  {
    id: "punishment",
    text: "An otherwise good man kills someone in an accident that he could have easily avoided. You are certain he will not make a mistake like this again. The trial will not be published. What should his punishment be?",
    options: [
      { text: "He should not be punished.", effects: { U: 10, ON: 5, D: 5, EP: 10 } },
      {
        text: "He should have the same penalty as any other murderer (10 years to life in prison, or the death penalty).",
        effects: { C: 10, ON: 5, A: 5, U: -10, EP: 5 },
      },
      {
        text: "He should have an easy sentence as it was an accident (less than 10 years).",
        effects: { T: 10, S: 5, E: 5, ON: -5, U: -15, VT: 20, CO: 10 },
      },
      { text: "Other / no opinion / don't know.", effects: { SK: 10 } },
    ],
  },
  {
    id: "punishment-followup",
    text: "Would your answer change if it were intentional, but you knew for a fact he still wouldn't commit a similar action in the future?",
    showIf: (a) => ans(a, "punishment") === 0,
    options: [
      {
        text: "Yes.",
        effects: { U: -10, ON: -5, D: -5, EP: -10, T: 10, S: 5, E: 5, VT: 20, CO: 10 },
      },
      { text: "No.", effects: { U: 20, ON: 5, A: 5, EP: 5 } },
    ],
  },
  {
    id: "buttons",
    text: "In front of you, and every other (mentally capable) person on earth, are two buttons — one red and one blue. If more than 50% of the population selects the red button, every person who selected blue will die. Pressing red ensures your own safety, but risks being partially responsible for the deaths of millions to billions of people who picked blue. Which button do you press?",
    options: [
      { text: "Red.", effects: { E: 10, U: -15, SK: 10, A: 15, D: 10 } },
      {
        text: "Blue.",
        effects: { T: 10, S: 5, E: -5, ON: 5, U: 15, SK: -5, VT: 5, CO: 5, D: -10 },
      },
    ],
  },
  {
    id: "buttons-followup",
    text: "Does your answer change if you know that already over 50% of the population has clicked the red button?",
    showIf: (a) => ans(a, "buttons") === 1,
    options: [
      { text: "Yes.", effects: { U: -20, ON: -5 } },
      { text: "No.", effects: {} },
    ],
  },
  {
    id: "lifeboat",
    text: "You and 9 other people are on a lifeboat. There are only enough spots for 6 people. Who should live and who should die?",
    options: [
      { text: "We should leave it to chance — draw straws to see who stays behind.", effects: { SK: 10 } },
      {
        text: "We should choose the 6 youngest people to live and the 4 oldest to die.",
        effects: { U: 15, VT: -5, CO: -15, EP: 10 },
      },
      {
        // Original spec had "=10%CO"; interpreted as +10% CO.
        text: "We should choose the 6 most moral to survive and the 4 least moral to die.",
        effects: { T: 5, S: 5, U: -5, VT: 15, CO: 10, B: 5 },
      },
      {
        text: "Whoever can make it onto a spot in the boat first deserves to survive.",
        effects: { T: -5, ON: 5, U: -10, VT: -10, CO: -15, EP: -10, A: 5 },
      },
    ],
  },
  {
    id: "galaxy",
    text: "There is a button in front of you. If you press it, a random person dies. If you do not, everything outside our current observable galaxy is destroyed — potentially an infinite amount of planets, stars, and beauty. Do you press it?",
    options: [
      { text: "Yes.", effects: {} },
      { text: "No.", effects: {} },
    ],
  },
];

export interface ScoreResult {
  scores: Record<PhilKey, number>;
}

export function computeScores(
  answers: Record<string, number>,
  questions: Question[] = QUESTIONS,
): ScoreResult {
  const scores: Record<PhilKey, number> = {
    T: 0, S: 0, C: 0, E: 0, ON: 0, U: 0, SK: 0,
    VT: 0, CO: 0, A: 0, EP: 0, D: 0, B: 0,
  };
  const permLocked = new Set<PhilKey>();

  for (const q of questions) {
    if (q.showIf && !q.showIf(answers)) continue;
    const idx = answers[q.id];
    if (idx === undefined) continue;
    const opt = q.options[idx];
    if (!opt) continue;

    // Apply PERM: floor at 50, lock from going below 50 thereafter.
    if (opt.perm) {
      for (const k of opt.perm) {
        if (scores[k] < 50) scores[k] = 50;
        permLocked.add(k);
      }
    }

    for (const [k, delta] of Object.entries(opt.effects) as [PhilKey, number][]) {
      // Negative effects count 1.5x, per author preference.
      const adjusted = delta < 0 ? delta * 1.5 : delta;
      const next = scores[k] + adjusted;
      scores[k] = permLocked.has(k) ? Math.max(50, next) : next;
    }
  }

  // Final clamp ±100
  for (const k of Object.keys(scores) as PhilKey[]) {
    scores[k] = Math.max(-100, Math.min(100, scores[k]));
  }

  return { scores };
}

export const INTRO_TEXT = `I started this to expand my beliefs and worldview to encompass a multitude of different philosophies. I hope that you can do the same by taking this survey. At the very least, it will give you a place to start. That being said, not all philosophies made it onto the list. The philosophies on this list are aimed at different ways to live life. Metaphysical and epistemological philosophies were thus kept out. The exception is determinism, as I believe its implications on free will can have a meaningful effect on our lives.`;

export const INTRO_RELIGION = `Regarding religion, I have decided to omit all religion, essentially except Buddhism, as the majority of what it preaches is, in my opinion, not inherently religious. Religion has aspects of philosophy, but is not inherently a philosophy in and of itself. Additionally, those who are religious do not need a survey to confirm their own beliefs, so doing so would be pointless.`;

export const INTRO_RESULTS = `The results are not absolute. I cannot guarantee that you will agree with these philosophies, as the topics they tackle are extremely complex and individualistic. That being said, it should give you philosophies similar to your current beliefs that are aimed at helping with problems you are experiencing. Thank you for taking this!`;
