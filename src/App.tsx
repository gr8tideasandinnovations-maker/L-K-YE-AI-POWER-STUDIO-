
import { useState } from 'react';
import {
  Bot,
  MessageCircle,
  Code,
  GraduationCap,
  BriefcaseBusiness,
  Languages,
  Image,
  Menu,
  Send,
  Sparkles,
  Mic,
  Globe,
  X
} from 'lucide-react';

const languages = [
  'English',
  'Nigerian Pidgin',
  'Yoruba',
  'Igbo',
  'Hausa',
  'French'
];
const tools = [
  {
    name: 'AI Assistant',
    icon: MessageCircle,
    description: 'Ask questions and get intelligent answers.',
    welcome: 'Your personal AI companion is ready. Ask questions, explore ideas and solve problems.',
    prompts: [
      'Explain an interesting new technology.',
      'Help me solve a difficult problem.',
      'Give me ideas for a new project.'
    ]
  },
  {
    name: 'AI Coding Studio',
    icon: Code,
    description: 'Write, explain and improve code.',
    welcome: 'Welcome to your coding workspace. Learn programming, understand code and build software.',
    prompts: [
      'Teach me JavaScript from the beginning.',
      'Help me build a mobile-friendly website.',
      'Explain how APIs work.'
    ]
  },
  {
    name: 'Academic Centre',
    icon: GraduationCap,
    description: 'Research, learning and study support.',
    welcome: 'Your learning workspace is ready. Explore academic subjects, research and study effectively.',
    prompts: [
      'Explain a difficult academic topic.',
      'Help me prepare a study timetable.',
      'Help me understand data science.'
    ]
  },
  {
    name: 'Business Intelligence',
    icon: BriefcaseBusiness,
    description: 'Business planning and data analysis.',
    welcome: 'Welcome to your business workspace. Explore business ideas, planning, management and analytics.',
    prompts: [
      'Help me write a business plan.',
      'Design a cooperative management application.',
      'Explain how to analyse business data.'
    ]
  },
  {
    name: 'Language Centre',
    icon: Languages,
    description: 'Communicate across languages.',
    welcome: 'Your language workspace is ready. Practise languages, translate and improve communication.',
    prompts: [
      'Teach me five useful Yoruba phrases.',
      'Translate a message into Hausa.',
      'Help me improve my English.'
    ]
  },
  {
    name: 'Creative Studio',
    icon: Image,
    description: 'Explore creative and image tools.',
    welcome: 'Welcome to your creative workspace. Develop ideas, stories, concepts and creative projects.',
    prompts: [
      'Help me develop a creative business idea.',
      'Write an inspiring short story.',
      'Create a concept for a technology brand.'
    ]
  }
];


export default function App() {
  const [active, setActive] = useState('AI Assistant');
  const [language, setLanguage] = useState('English');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const activeTool =
    tools.find((tool) => tool.name === active) || tools[0];
  
  async function sendMessage() {
    if (!message.trim() || loading) return;

    const question = message.trim();

    setLoading(true);
    setError('');
    setReply('');
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
  message: question,
  language,
  department: active
})
      });

      const data = await response.json();

      if (!response.ok) {
        const statusInfo = data.providerStatus
          ? ` (Gemini status: ${data.providerStatus})`
          : ` (HTTP status: ${response.status})`;

        throw new Error(
          (data.error || 'The AI service could not respond.') +
          statusInfo
        );
      }

      setReply(
        data.reply || 'I could not generate a response.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Connection failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  function selectDepartment(name: string) {
    setActive(name);
    setReply('');
    setError('');
    setMenuOpen(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#home">
          <div className="brand-icon">
            <Bot size={27} />
          </div>

          <div>
            <strong>LÀÁKÀYÈ</strong>
            <span>AI POWER STUDIO</span>
          </div>
        </a>

        <button
          className="menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-menu">
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#assistant" onClick={() => setMenuOpen(false)}>
            AI Assistant
          </a>
          <a href="#departments" onClick={() => setMenuOpen(false)}>
            AI Departments
          </a>
        </nav>
      )}

      <main className="main" id="home">
        <section className="welcome">
          <span className="eyebrow">
            <Sparkles size={15} />
            ONE INTELLIGENCE. ENDLESS POSSIBILITIES.
          </span>

          <h1>
            Think beyond.
            <br />
            <span>Create without limits.</span>
          </h1>

          <p>
            Meet LÀÁKÀYÈ, your AI companion for learning,
            creativity, innovation and achievement.
            Built for everyone, everywhere.
          </p>
        </section>

        <section className="assistant-panel" id="assistant">
          <div className="assistant-heading">
            <div className="robot">
              <Bot size={30} />
            </div>

            <div>
              <h2>{active}</h2>
              <span className="online">
                <span className="status-dot"></span>
                LÀÁKÀYÈ AI workspace
              </span>
            </div>
          </div>

          <div className="language-area">
            <label htmlFor="language-select">
              <Globe size={16} />
              Response language
            </label>

            <select
              id="language-select"
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

<div className="chat-welcome">
  <Sparkles size={23} />

  <h3>Welcome to {activeTool.name}</h3>

  <p>{activeTool.welcome}</p>

  <p>Try one of these suggested tasks:</p>

  <div className="suggested-prompts">
    {activeTool.prompts.map((prompt) => (
      <button
        key={prompt}
        className="prompt-chip"
        onClick={() => setMessage(prompt)}
      >
        {prompt}
      </button>
    ))}
  </div>
</div>
          
          {reply && (
            <div className="chat-welcome">
              <h3>LÀÁKÀYÈ's response</h3>
              <p>{reply}</p>
            </div>
          )}

          {loading && (
            <div className="chat-welcome">
              <p>LÀÁKÀYÈ is thinking...</p>
            </div>
          )}

          {error && (
            <div className="chat-welcome">
              <h3>Connection message</h3>
              <p>{error}</p>
            </div>
          )}

          <div className="message-box">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask LÀÁKÀYÈ anything..."
              rows={2}
              disabled={loading}
            />

            <button
              aria-label="Send message"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
            >
              <Send size={19} />
            </button>
          </div>

          <div className="chat-tools">
            <span>
              <Mic size={14} />
              Voice support coming soon
            </span>

            <span>
              <Globe size={14} />
              Multilingual experience
            </span>
          </div>
        </section>

        <section className="tools-section" id="departments">
          <div className="section-heading">
            <div>
              <h2>Explore AI departments</h2>
              <p>
                Different possibilities. One intelligent platform.
              </p>
            </div>
          </div>

          <div className="tools-grid">
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
  type="button"
  className={`tool-card ${
                    active === tool.name ? 'selected' : ''
                  }`}
                  key={tool.name}
                  onClick={() => selectDepartment(tool.name)}
                >
                  <Icon size={25} />
                  <strong>{tool.name}</strong>
                  <span>{tool.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <footer>
          <span>LÀÁKÀYÈ AI POWER STUDIO</span>

          <p>One Intelligence. Endless Possibilities.</p>

          <p>
            Built for knowledge, creativity and progress.
          </p>

          <p>Ask. Discover. Achieve.</p>
        </footer>
      </main>
    </div>
  );
                             }
        
