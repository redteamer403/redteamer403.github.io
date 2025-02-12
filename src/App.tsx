import React, { useState } from "react";
import { Menu, X, Github, Mail, LinkedinIcon, Terminal } from "lucide-react";

const sections = {
  about: {
    title: "About Me",
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neon">Penetration Tester & Security Researcher</h2>
        <p className="text-gray-300">
          Welcome to my digital space, where I document security research, penetration testing insights, and methodology.
        </p>
        <div className="flex space-x-4">
          <a href="https://github.com/redteamer403" className="text-accent hover:text-neon">
            <Github className="inline-block mr-2" size={20} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/rustam-fakhrutdinov-1131b96a/" className="text-accent hover:text-neon">
            <LinkedinIcon className="inline-block mr-2" size={20} /> Linkedin
          </a>
          <a href="mailto:johndoe889913@gmail.com" className="text-accent hover:text-neon">
            <Mail className="inline-block mr-2" size={20} /> Contact
          </a>
        </div>
      </div>
    ),
  },
  notes: {
    title: "Notes",
    content: (
      <div className="grid gap-6">
        {[
          { name: "Active Directory", description: "AD pentesting techniques & attacks" },
          { name: "Windows", description: "Windows security notes" },
          { name: "Linux", description: "Linux hardening & security testing" },
          { name: "WebApp", description: "Web security vulnerabilities & testing" },
          { name: "Cloud", description: "AWS, Azure, GCP security testing" },
          { name: "CheatSheets", description: "Quick security commands & payloads" }
        ].map((category) => (
          <div key={category.name} className="bg-gray-800 p-6 rounded-lg border border-blue-500/30 hover:border-blue-500">
            <h3 className="text-xl font-bold text-blue-400">{category.name}</h3>
            <p className="text-gray-300">{category.description}</p>
          </div>
        ))}
      </div>
    )
  },  
  posts: {
    title: "Posts",
    content: (
      <div className="grid gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-blue-500/30">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Latest Writeups</h3>
          <div className="space-y-4">
            {/* Existing Post */}
            <article className="border-l-2 border-blue-500 pl-4">
              <h4 className="text-lg font-semibold text-gray-200">HackTheBox - Machine Walkthrough</h4>
              <p className="text-gray-400">Detailed walkthrough of compromising a Windows AD environment...</p>
              <span className="text-sm text-blue-400">Posted on Feb 10, 2025</span>
            </article>
  
            {/* Add a new post here */}
            <article className="border-l-2 border-blue-500 pl-4">
              <h4 className="text-lg font-semibold text-gray-200">Bug Bounty - XSS in WebApp</h4>
              <p className="text-gray-400">Found an XSS vulnerability in a major financial app...</p>
              <span className="text-sm text-blue-400">Posted on Feb 15, 2025</span>
            </article>
          </div>
        </div>
      </div>
    )
  }  
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'about' | 'posts'>('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darkBg text-gray-100">
      <nav className="bg-gray-800 border-b border-neon/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-neon">Security Research</h1>
          <div className="hidden md:flex space-x-4">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeSection === section ? 'bg-accent text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-400 hover:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            {Object.keys(sections).map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section as any);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeSection === section ? 'bg-accent text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-neon mb-8">{sections[activeSection].title}</h2>
        {sections[activeSection].content}
      </main>
    </div>
  );
};

export default App;
