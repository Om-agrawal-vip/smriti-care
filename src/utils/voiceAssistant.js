// Web Speech API Voice Assistant (Speech Recognition + Speech Synthesis)
// Zero External APIs, 100% Free Browser Native

class VoiceAssistantManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Default to Indian English / Multilingual
    }
  }

  isSupported() {
    return !!(this.recognition && this.synth);
  }

  setLanguage(langCode) {
    if (!this.recognition) return;
    if (langCode === 'hi') {
      this.recognition.lang = 'hi-IN';
    } else {
      this.recognition.lang = 'en-IN';
    }
  }

  // Start listening to user mic
  startListening({ onResult, onError, onEnd, onStart }) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
        if (onStart) onStart();
      };

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        const isFinal = event.results[0].isFinal;
        if (onResult) onResult({ transcript, isFinal });
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
      if (onError) onError(e.message || 'Could not access microphone.');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    this.isListening = false;
  }

  // Speak aloud via Text-to-Speech
  speak(text, lang = 'en-IN', onComplete) {
    if (!this.synth) return;

    try {
      this.synth.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95; // Gentle pace for senior citizens
      utterance.pitch = 1.05; // Friendly warm tone

      // Try to select an Indian English or Hindi natural voice if available
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes(lang.toLowerCase().replace('_', '-')) ||
          (lang.startsWith('hi') && v.name.toLowerCase().includes('hindi')) ||
          (lang.startsWith('en') && v.name.toLowerCase().includes('india'))
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      if (onComplete) {
        utterance.onend = () => onComplete();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  // Intelligent query processor for Dementia / Cognitive commands
  processCommand({ query, userProfile, levelProgress, langCode }) {
    const q = query.toLowerCase().trim();
    const isHindi = langCode === 'hi' || q.includes('kya') || q.includes('mera') || q.includes('khel');

    const completed = levelProgress.filter((l) => l.completed);
    const avgAcc =
      completed.length > 0
        ? Math.round(completed.reduce((a, b) => a + (b.accuracy || 0), 0) / completed.length)
        : 90;
    const name = userProfile?.name?.split(' ')[0] || 'Friend';

    // 1. Score / Progress queries
    if (
      q.includes('score') ||
      q.includes('accuracy') ||
      q.includes('progress') ||
      q.includes('points') ||
      q.includes('kaisa') ||
      q.includes('kitna')
    ) {
      if (isHindi) {
        return {
          reply: `नमस्ते ${name} ji! आपकी औसत सटीकता ${avgAcc} प्रतिशत है और आपने ${completed.length} स्तर पूरे कर लिए हैं। बहुत बढ़िया प्रदर्शन!`,
          action: 'NAVIGATE_PROGRESS',
        };
      }
      return {
        reply: `Hello ${name}! Your overall memory accuracy is ${avgAcc}% across ${completed.length} completed levels. You are doing fantastic!`,
        action: 'NAVIGATE_PROGRESS',
      };
    }

    // 2. Play / Game queries
    if (
      q.includes('play') ||
      q.includes('game') ||
      q.includes('level') ||
      q.includes('start') ||
      q.includes('khel') ||
      q.includes('shuru') ||
      q.includes('agla')
    ) {
      if (isHindi) {
        return {
          reply: `बिल्कुल ${name} ji! चलिए आज का स्मृति खेल शुरू करते हैं। ऑल द बेस्ट!`,
          action: 'NAVIGATE_LEVELS',
        };
      }
      return {
        reply: `Right away ${name}! Opening your North East cognitive map. Let's exercise your memory!`,
        action: 'NAVIGATE_LEVELS',
      };
    }

    // 3. Reminder / Medicine queries
    if (
      q.includes('reminder') ||
      q.includes('medicine') ||
      q.includes('dawa') ||
      q.includes('schedule') ||
      q.includes('call') ||
      q.includes('yaad')
    ) {
      if (isHindi) {
        return {
          reply: `${name} ji, आज आपके 2 मुख्य रिमाइंडर हैं: सुबह की दवा और शाम को अनन्या के साथ वीडियो कॉल।`,
          action: 'SHOW_REMINDERS',
        };
      }
      return {
        reply: `${name}, you have 2 reminders scheduled today: Morning hydration and the 5:00 PM family video call.`,
        action: 'SHOW_REMINDERS',
      };
    }

    // 4. Greetings
    if (
      q.includes('hello') ||
      q.includes('namaste') ||
      q.includes('hi') ||
      q.includes('kaise') ||
      q.includes('who are you') ||
      q.includes('kaun')
    ) {
      if (isHindi) {
        return {
          reply: `नमस्ते ${name} ji! मैं स्मृति सहायक हूँ। मैं आपकी याददाश्त और दैनिक स्वास्थ्य की देखभाल में मदद करती हूँ।`,
          action: 'NONE',
        };
      }
      return {
        reply: `Hello ${name}! I am Smriti, your caring cognitive companion. How can I assist your memory today?`,
        action: 'NONE',
      };
    }

    // Default Fallback
    if (isHindi) {
      return {
        reply: `मैंने सुना: "${query}"। आप मुझसे अपना स्कोर, अगला खेल, या आज के रिमाइंडर के बारे में पूछ सकते हैं!`,
        action: 'NONE',
      };
    }
    return {
      reply: `I heard: "${query}". You can ask me about your memory score, to start today's game, or view your reminders!`,
      action: 'NONE',
    };
  }
}

export const voiceAssistant = new VoiceAssistantManager();
export default voiceAssistant;
