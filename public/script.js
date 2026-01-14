// ------------------------------
// LANGUAGE DATA
// ------------------------------
const LANG_DATA = {
  Sanskrit: {
    script: "Devanagari",
    chars: "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह",
    history: "1500 BCE – Present • India",
    examples: ["राम", "धर्म", "कर्म"]
  },

  Sumerian: {
    script: "Cuneiform",
    chars: "𒀀 𒀭 𒁀 𒁈 𒀸 𒌨 𒆠 𒌓 𒄑 𒌋",
    history: "4000–2000 BCE • Mesopotamia",
    examples: ["𒌓𒀭", "𒈠𒂵𒆠", "𒀭𒁕"]
  },

  Egyptian: {
    script: "Hieroglyphic",
    chars: "𓀀 𓁐 𓂀 𓄿 𓇋 𓈖 𓊃 𓊹 𓉔 𓊪",
    history: "3200–400 BCE • Egypt",
    examples: ["𓂀𓊹", "𓏏𓊪", "𓃀𓂋"]
  },

  Akkadian: {
    script: "Cuneiform",
    chars: "𒀭 𒀝 𒅗 𒁺 𒆠 𒌓 𒈠 𒄑 𒉌",
    history: "2500–100 BCE • Mesopotamia",
    examples: ["𒀝𒅗", "𒁺𒀀", "𒌓𒄑"]
  },

  "Ancient Greek": {
    script: "Greek Alphabet",
    chars: "Α Β Γ Δ Ε Ζ Η Θ Ι Κ Λ Μ Ν Ξ Ο Π Ρ Σ Τ Υ Φ Χ Ψ Ω",
    history: "800–600 BCE • Mediterranean",
    examples: ["λόγος", "ἀλήθεια", "φιλοσοφία"]
  },

  Latin: {
    script: "Latin Alphabet",
    chars: "A B C D E F G H I K L M N O P Q R S T V X Y Z",
    history: "75 BCE–200 CE • Rome",
    examples: ["Lingua", "Veritas", "Amor"]
  },

  Phoenician: {
    script: "Phoenician Alphabet",
    chars: "𐤀 𐤁 𐤂 𐤃 𐤄 𐤅 𐤆 𐤇 𐤈 𐤉 𐤊 𐤋 𐤌 𐤍 𐤎 𐤏 𐤐 𐤑 𐤒 𐤓 𐤔 𐤕",
    history: "1050–150 BCE • Levant",
    examples: ["𐤀𐤁", "𐤂𐤃", "𐤄𐤅"]
  },

  Aramaic: {
    script: "Aramaic Script",
    chars: "ܐ ܒ ܓ ܕ ܗ ܘ ܙ ܚ ܛ ܝ ܟ ܠ ܡ ܢ ܣ ܥ ܦ ܨ ܩ ܪ ܫ ܬ",
    history: "900 BCE–Present • Near East",
    examples: ["ܫܠܡܐ", "ܟܬܒܐ", "ܥܠܡ"]
  },

  Arabic: {
    script: "Arabic Alphabet",
    chars: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي",
    history: "4th century CE – Present • Middle East",
    examples: ["سلام", "كتاب", "علم"]
  },

  English: {
    script: "Latin Alphabet",
    chars: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
    history: "5th century CE – Present • England",
    examples: ["hello", "world", "language"]
  },

  Spanish: {
    script: "Latin Alphabet",
    chars: "A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z",
    history: "9th century CE – Present • Spain",
    examples: ["hola", "mundo", "lenguaje"]
  },

  French: {
    script: "Latin Alphabet",
    chars: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
    history: "9th century CE – Present • France",
    examples: ["bonjour", "monde", "langue"]
  }
};

// ------------------------------
// NO MEANING TEXT PER LANGUAGE
// ------------------------------
const NO_MEANING_TEXT = {
  English: "No clear meaning",
  Spanish: "Sin significado claro",
  French: "Sans signification claire",
  Arabic: "لا معنى واضح"
};

// ------------------------------
// VARIABLES
// ------------------------------
let testerLanguage = "";
let translationLanguage = "";

const infoPanel = document.getElementById("infoPanel");
const infoBtn = document.getElementById("infoBtn");
const fromCard = document.getElementById("fromCard");
const toCard = document.getElementById("toCard");
const translationCard = document.getElementById("translationText");
const explanationCard = document.getElementById("explanationText");

// ------------------------------
// UPDATE HEADER
// ------------------------------
const updateHeader = () => {
  if (testerLanguage) {
    const data = LANG_DATA[testerLanguage];
    fromCard.querySelector(".native.big").textContent = data ? data.examples[0] || "—" : "—";
    fromCard.querySelector(".english").textContent = testerLanguage;
  }
  if (translationLanguage) {
    const data = LANG_DATA[translationLanguage];
    toCard.querySelector(".native.big").textContent = data ? data.examples[0] || "—" : "—";
    toCard.querySelector(".english").textContent = translationLanguage;
  }
};

// ------------------------------
// CLEAR CARD SELECTION
// ------------------------------
const clearSelection = (selector) => {
  document.querySelectorAll(selector).forEach(c => c.classList.remove("selected"));
};

// ------------------------------
// SOURCE LANGUAGE
// ------------------------------
document.querySelectorAll(".card.source").forEach(card => {
  card.addEventListener("click", () => {
    testerLanguage = card.dataset.lang;
    clearSelection(".card.source");
    card.classList.add("selected");
    updateHeader();

    const data = LANG_DATA[testerLanguage];
    if (!data) return;

    document.getElementById("infoTitle").innerText = testerLanguage;
    document.getElementById("infoScript").innerText = data.script;
    document.getElementById("infoChars").innerText = data.chars;
    document.getElementById("infoHistory").innerText = data.history;

    const ul = document.getElementById("infoExamples");
    ul.innerHTML = "";
    data.examples.forEach(e => {
      const li = document.createElement("li");
      li.textContent = e;
      ul.appendChild(li);
    });

    infoBtn.innerText = testerLanguage + " Reference";
  });
});

// ------------------------------
// TARGET LANGUAGE
// ------------------------------
document.querySelectorAll(".card.target").forEach(card => {
  card.addEventListener("click", () => {
    translationLanguage = card.dataset.lang;
    clearSelection(".card.target");
    card.classList.add("selected");
    updateHeader();
  });
});

// ------------------------------
// INFO BUTTON TOGGLE
// ------------------------------
infoBtn.addEventListener("click", () => {
  infoPanel.classList.toggle("hidden");
  infoPanel.classList.toggle("show");
});

// ------------------------------
// TRANSLATE BUTTON
// ------------------------------
document.getElementById("translateBtn").addEventListener("click", async () => {
  const input = document.getElementById("inputText").value.trim();

  if (!input || !testerLanguage || !translationLanguage) {
    translationCard.textContent = "Select both languages and enter text.";
    explanationCard.textContent = "";
    return;
  }

  // Show loading
  translationCard.textContent = "Translating...";
  explanationCard.textContent = "Translating...";

  try {
    // Call backend now
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
        fromLang: testerLanguage,
        toLang: translationLanguage
      })
    });

    const data = await res.json();
    const result = data.result || "No clear meaning";

    // Split into translation + explanation
    const lines = result.split("\n").filter(l => l.trim());
    translationCard.textContent = lines[0] || "No clear meaning";
    explanationCard.textContent = lines.slice(1).join("\n") || "No clear meaning";

  } catch (err) {
    console.error(err);
    translationCard.textContent = "Translation failed.";
    explanationCard.textContent = "";
  }
});




