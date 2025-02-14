import React, { useState, useEffect } from 'react';
import { Terminal, Code2, BookOpen, User, Coffee, Github, Linkedin } from 'lucide-react';

const useTypingEffect = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return displayText;
};

const CRTOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50">
    <div className="h-full w-full bg-gradient-to-b from-transparent to-transparent bg-[linear-gradient(0deg,rgba(31,39,48,0.2)_50%,rgba(31,39,48,0.3)_50%)] bg-[length:100%_4px] animate-scan" />
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(0,0,0,0.2)_100%)]" />
  </div>
);

const GlowingBorder = ({ children }) => (
  <div className="relative p-1 rounded-lg bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50 animate-pulse">
    <div className="bg-gray-900 rounded-lg">
      {children}
    </div>
  </div>
);

const SideProfile = () => (
  <div className="w-64 p-6 bg-gray-900/50 border-r border-gray-800">
    <div className="space-y-6">
      <div className="text-center">
        <img
          src="/images/avatar.png"
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full border-4 border-cyan-500/30"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-100">RedTeamer403</h1>
        <p className="mt-2 text-gray-400">Penetration Tester</p>
        <p className="mt-1 text-gray-400">Czech Republic</p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <a 
          href="https://github.com/redteamer403" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
        >
          <Github className="w-5 h-5" />
          GitHub
        </a>
        <a 
          href="https://www.linkedin.com/in/rustam-fakhrutdinov-1131b96a/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
        >
          <Linkedin className="w-5 h-5" />
          LinkedIn
        </a>
        <a 
          href="https://tryhackme.com/p/redteamer403" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
        >
          <Terminal className="w-5 h-5" />
          TryHackMe
        </a>
        <a 
          href="https://buymeacoffee.com/redteamer403" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
        >
          <img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-2.svg" alt="Buy Me a Coffee" className="h-15" />
        </a>
      </div>
    </div>
  </div>
);

const BlogPost = ({ title, description, date, readTime, image, link }) => (
  <a 
    href={link}
    className="block bg-gray-900 rounded-lg overflow-hidden hover:ring-1 hover:ring-cyan-500 transition-all duration-300"
  >
    <div className="flex h-48 md:h-64">
      <div className="w-1/3">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
          <p className="text-gray-400">{description}</p>
        </div>
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <span>{date}</span>
          <span>{readTime} minute read</span>
        </div>
      </div>
    </div>
  </a>
);

const App = () => {
  const [currentSection, setCurrentSection] = useState("about");
  const welcomeText = useTypingEffect("\>  Welcome to my cybersecurity portfolio_");
  
  const posts = [
    {
      title: "Attack AD CS Now!!",
      description: "DPAPI, CBA Patch, Template Reconfiguration, Certificate Forgery and More!",
      date: "10 Nov 2024",
      readTime: 35,
      image: "/images/openart-image_GQ8_hkFj_1739392570839_raw.jpg",
      link: "/posts/attack-ad-cs"
    },
    {
      title: "3 - Lateral mov & Persistence (Azure)",
      description: "Pass-the-PRT, Runbooks, cloud to on-prem, Golden SAML and More!",
      date: "27 Jul 2024",
      readTime: 20,
      image: "/images/openart-image_PpktvOH5_1739392399365_raw.jpg",
      link: "/posts/azure-lateral-movement"
    },
    {
      title: "HackTheBox - Machine Walkthrough",
      description: "Detailed walkthrough of recent HackTheBox machine, including exploitation techniques and privilege escalation.",
      date: "15 Oct 2024",
      readTime: 25,
      image: "/images/htb.png",
      link: "/posts/htb-walkthrough"
    },
    {
      title: "Bug Bounty - XSS in WebApp",
      description: "Discovery and exploitation of a cross-site scripting vulnerability in a major web application.",
      date: "01 Sep 2024",
      readTime: 15,
      image: "/images/openart-image_WaJxV_Gn_1739392738435_raw.jpg",
      link: "/posts/bug-bounty-xss"
    }
  ];

  const notes = [
    {
      title: "Active Directory",
      description: "Comprehensive guide to Active Directory penetration testing, including attack vectors and defense evasion.",
      date: "Updated regularly",
      readTime: 45,
      image: "/images/ad.png",
      link: "/notes/active-directory"
    },
    {
      title: "Windows",
      description: "Windows security assessment techniques, privilege escalation, and post-exploitation.",
      date: "Updated regularly",
      readTime: 40,
      image: "/images/windows.png",
      link: "/notes/windows"
    },
    {
      title: "Linux",
      description: "Linux security fundamentals, privilege escalation techniques, and hardening guides.",
      date: "Updated regularly",
      readTime: 35,
      image: "/images/linux.png",
      link: "/notes/linux"
    },
    {
      title: "WebApp",
      description: "Web application security testing methodology, common vulnerabilities, and exploitation techniques.",
      date: "Updated regularly",
      readTime: 50,
      image: "/images/webapp.png",
      link: "/notes/webapp"
    },
    {
      title: "Cloud",
      description: "Cloud security assessment guides for AWS, Azure, and GCP environments.",
      date: "Updated regularly",
      readTime: 55,
      image: "/images/cloud.png",
      link: "/notes/cloud"
    },
    {
      title: "CheatSheets",
      description: "Quick reference guides for various penetration testing tools and techniques.",
      date: "Updated regularly",
      readTime: 30,
      image: "/images/cheatsheet.png",
      link: "/notes/cheatsheets"
    }
  ];

  const sections = {
    about: {
      icon: <User className="w-5 h-5" />,
      title: "About",
      content: (
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">
            {welcomeText}
          </h1>
          <div className="space-y-6 text-gray-300">
            <GlowingBorder>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-mono font-bold text-cyan-400 flex items-center gap-2">
                    <Terminal className="w-5 h-5" /> About Me
                  </h2>
                  <p className="font-mono">Passionate penetration tester with expertise in web, cloud, and infrastructure security.</p>
                </div>
                <div>
                  <h2 className="text-xl font-mono font-bold text-cyan-400">🎖️ Certifications</h2>
                  <ul className="list-none space-y-2">
                    {['CRTP', 'eWPTXv2', 'BSCP', 'CRTA', 'MCRTA'].map(cert => (
                      <li key={cert} className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-cyan-400" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-mono font-bold text-cyan-400">🖥️ HackTheBox ProLabs</h2>
                  <ul className="list-none space-y-2">
                    {['BlackSky Cyclone', 'BlackSky Hailstorm', 'Zephyr', 'FullHouse'].map(lab => (
                      <li key={lab} className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span>{lab}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlowingBorder>
          </div>
        </div>
      ),
    },
    posts: {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Posts",
      content: (
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">
            {welcomeText}
          </h1>
          <div className="space-y-6">
            {posts.map((post) => (
              <BlogPost key={post.title} {...post} />
            ))}
          </div>
        </div>
      ),
    },
    notes: {
      icon: <Terminal className="w-5 h-5" />,
      title: "Notes",
      content: (
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">
            {welcomeText}
          </h1>
          <div className="space-y-6">
            {notes.map((note) => (
              <BlogPost key={note.title} {...note} />
            ))}
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono relative overflow-hidden">
      <CRTOverlay />
      <div className="w-full">
        <nav className="flex flex-wrap gap-4 px-6 pt-6 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ${
                currentSection === key 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50" 
                  : "bg-gray-800 hover:bg-gray-700 hover:shadow-md hover:shadow-cyan-500/30"
              }`}
              onClick={() => setCurrentSection(key)}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </nav>
        
        <div className="fade-in flex">
          <SideProfile />
          {sections[currentSection].content}
        </div>
      </div>
    </div>
  );
};

export default App;
