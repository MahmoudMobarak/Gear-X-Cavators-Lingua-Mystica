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
// VARIABLES
// ------------------------------
let testerLanguage = "";
let translationLanguage = "";

const fromCard = document.getElementById("fromCard");
const toCard = document.getElementById("toCard");
const translationCard = document.getElementById("translationText");
const explanationCard = document.getElementById("explanationText");

// ------------------------------
// SELECT LANGUAGES
// ------------------------------
document.querySelectorAll(".card.source").forEach(card => {
  card.addEventListener("click", () => {
    testerLanguage = card.dataset.lang;
    document.querySelectorAll(".card.source").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    fromCard.querySelector(".native.big").textContent = card.querySelector(".native.big").textContent;
    fromCard.querySelector(".english").textContent = testerLanguage;
  });
});

document.querySelectorAll(".card.target").forEach(card => {
  card.addEventListener("click", () => {
    translationLanguage = card.dataset.lang;
    document.querySelectorAll(".card.target").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    toCard.querySelector(".native.big").textContent = card.querySelector(".native.big").textContent;
    toCard.querySelector(".english").textContent = translationLanguage;
  });
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

  translationCard.textContent = "Translating...";
  explanationCard.textContent = "Translating...";

  try {
    const res = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        fromLang: testerLanguage,
        toLang: translationLanguage
      })
    });

    const data = await res.json();

    if (data.error) {
      translationCard.textContent = "Translation failed.";
      explanationCard.textContent = "";
      return;
    }

    const lines = data.result.split("\n").filter(l => l.trim());
    translationCard.textContent = lines[0];
    explanationCard.textContent = lines.slice(1).join("\n") || "No explanation available.";

  } catch (err) {
    console.error(err);
    translationCard.textContent = "Translation failed.";
    explanationCard.textContent = "";
  }
});
