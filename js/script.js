const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchageIcon = document.querySelector(".exchange"),
    selectTag = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".row i"),
    translateBtn = document.querySelector("button");

// Fill language dropdowns
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 
            ? (country_code == "en-GB" ? "selected" : "") 
            : (country_code == "hi-IN" ? "selected" : "");
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Exchange text and language
exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Clear translated text if input is empty
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Custom translations
const customTranslations = {
    "en-GB|hi-IN": {
        "hey": "नमस्ते",
    "hello": "नमस्ते",
    "hi": "नमस्कार",
    "good morning": "सुप्रभात",
    "good night": "शुभ रात्रि",
    "thank you": "धन्यवाद",
    "thanks": "धन्यवाद",
    "sorry": "माफ़ कीजिए",
    "please": "कृपया",
    "welcome": "स्वागत है",
    "goodbye": "अलविदा",
    "how are you": "आप कैसे हैं",
    "i am fine": "मैं ठीक हूँ",
    "what is your name": "आपका नाम क्या है",
    "my name is": "मेरा नाम है",
    "nice to meet you": "आपसे मिलकर खुशी हुई",
    "yes": "हाँ",
    "no": "नहीं",
    "okay": "ठीक है",
    "good": "अच्छा",
    "bad": "बुरा",
    "where are you": "आप कहाँ हैं",
    "i love you": "मैं तुमसे प्यार करता हूँ",
    "help": "मदद",
    "stop": "रुको",
    "go": "जाओ",
    "come": "आओ",
    "eat": "खाओ",
    "drink": "पियो",
    "sit": "बैठो",
    "stand": "खड़े हो जाओ"
    },
    "en-GB|ta-IN": {
        "hey": "வணக்கம்",
        "hello": "வணக்கம்",
        "hi": "வணக்கம்",
        "good morning": "காலை வணக்கம்",
        "good night": "இனிய இரவு",
        "thank you": "நன்றி",
        "thanks": "நன்றி",
        "sorry": "மன்னிக்கவும்",
        "please": "தயவுசெய்து",
        "welcome": "வரவேற்கிறேன்",
        "goodbye": "பிரியாவிடை",
        "how are you": "நீங்கள் எப்படி இருக்கிறீர்கள்",
        "i am fine": "நான் நலமாக இருக்கிறேன்",
        "what is your name": "உங்கள் பெயர் என்ன",
        "my name is": "என் பெயர்",
        "nice to meet you": "உங்களை சந்தித்ததில் மகிழ்ச்சி",
        "yes": "ஆம்",
        "no": "இல்லை",
        "okay": "சரி",
        "good": "நல்லது",
        "bad": "கெட்டது",
        "where are you": "நீங்கள் எங்கே இருக்கிறீர்கள்",
        "i love you": "நான் உன்னை 사랑ிக்கிறேன்",
        "help": "உதவி",
        "stop": "நிறுத்து",
        "go": "போ",
        "come": "வா",
        "eat": "சாப்பிடு",
        "drink": "குடி",
        "sit": "உட்கார்",
        "stand": "நில்"
    }
};

// Translation logic
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim().toLowerCase();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    if (!text) return;

    toText.setAttribute("placeholder", "Translating...");

    // Check for custom translation match
    const key = `${translateFrom}|${translateTo}`;
    if (customTranslations[key] && customTranslations[key][text]) {
        toText.value = customTranslations[key][text];
        toText.setAttribute("placeholder", "Translation");
        return;
    }

    // Fallback to API
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        });
});

// Copy and speech functionality
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;

        if (target.classList.contains("fa-copy")) {
            const textToCopy = target.id == "from" ? fromText.value : toText.value;
            navigator.clipboard.writeText(textToCopy);
        } else {
            let utterance = new SpeechSynthesisUtterance(
                target.id == "from" ? fromText.value : toText.value
            );
            utterance.lang = target.id == "from" ? selectTag[0].value : selectTag[1].value;
            speechSynthesis.speak(utterance);
        }
    });
});
