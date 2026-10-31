import { useState } from 'react';
import {
  Bot, MessageCircle, Code, GraduationCap, BriefcaseBusiness,
  Languages, Image, Menu, Send, Sparkles, Mic, Globe
} from 'lucide-react';

const tools = [
  { name: 'AI Assistant', icon: MessageCircle, description: 'Ask questions and get intelligent answers.' },
  { name: 'AI Coding Studio', icon: Code, description: 'Write, explain and improve code.' },
  { name: 'Academic Centre', icon: GraduationCap, description: 'Research, learning and study support.' },
  { name: 'Business Intelligence', icon: BriefcaseBusiness, description: 'Business planning and data analysis.' },
  { name: 'Language Centre', icon: Languages, description: 'Communicate across languages.' },
  { name: 'Creative Studio', icon: Image, description: 'Explore creative and image tools.' }
];

export default function App() {
  const [active, setActive] = useState('AI Assistant');
  const [message, setMessage] = useState('');

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Bot size={27} /></div>
          <div>
            <strong>LÀÁKÀYÉ</strong>
            <span>AI POWER STUDIO</span>
          </div>
        </div>
        <button className="menu-button" aria-label="Open menu">
          <Menu />
        </button>
      </header>

      <main className="main">
        <section className="welcome">
          <span className="eyebrow"><Sparkles size={15} /> YOUR INTELLIGENCE HUB</span>
          <h1>One Intelligence.<br /><span>Endless Possibilities.</span></h1>
          <p>Think, create, learn and achieve with AI built for everyone.</p>
        </section>

        <section className="assistant-panel">
          <div className="assistant-heading">
            <div className="robot"><Bot size={28} /></div>
            <div>
              <h2>{active}</h2>
              <span className="online">Your AI workspace</span>
            </div>
          </div>
          <div className="chat-welcome">
            <Sparkles size={23} />
            <h3>Welcome to LÀÁKÀYÉ AI</h3>
            <p>What would you like to discover or create today?</p>
          </div>
          <div className="message-box">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask LÀÁKÀYÉ anything..."
              rows={2}
            />
            <button
              aria-label="Send message"
              onClick={() => {
                if (message.trim()) {
                  alert('AI connection will be activated in the next development stage.');
                }
              }}
            >
              <Send size={19} />
            </button>
          </div>
          <div className="chat-tools">
            <span><Mic size={14} /> Voice support coming soon</span>
            <span><Globe size={14} /> Multilingual AI</span>
          </div>
        </section>

        <section className="tools-section">
          <div className="section-heading">
            <div>
              <h2>Explore AI departments</h2>
              <p>Powerful tools. One platform.</p>
            </div>
          </div>
          <div className="tools-grid">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  className={`tool-card ${active === tool.name ? 'selected' : ''}`}
                  key={tool.name}
                  onClick={() => setActive(tool.name)}
                >
                  <Icon size={23} />
                  <strong>{tool.name}</strong>
                  <span>{tool.description}</span>
                </button>
              );
            })}
          </div>
        </section>

        <footer>
          <span>LÀÁKÀYÉ AI POWER STUDIO</span>
          <p>Built for knowledge, creativity and progress.</p>
        </footer>
      </main>
    </div>
  );
              }
