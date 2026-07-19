import React from 'react';
import { motion } from 'framer-motion';

const TEAM = [
  { name: 'Devansh Ganatra', link: 'https://www.linkedin.com/in/devansh-ganatra-254336317?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
  { name: 'Dev Kacha', link: 'https://www.linkedin.com/in/dev-kacha-6bba66291?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
  { name: 'Mitrajsinh Rana', link: 'https://www.linkedin.com/in/rana-mitrajsinh-b06a45376?utm_source=share_via&utm_content=profile&utm_medium=member_ios' }
];

export default function AgencyFooter() {
  return (
    <section className="relative w-full bg-[#050505] text-[#F3F4F6] py-32 z-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* The Brains (Team) */}
        <div className="mb-32">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-16 opacity-50 border-b border-gray-800 pb-4">
            The Brains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <a 
                key={i} 
                href={member.link} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col items-start border border-gray-800 p-8 hover:bg-[#F3F4F6] hover:text-[#050505] transition-colors duration-500"
                data-cursor="hover"
              >
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{member.name}</h3>
                <p className="font-mono opacity-60 group-hover:opacity-100">{member.role}</p>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  Connect on LinkedIn ↗
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* The Close (Contact) */}
        <div>
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-16 opacity-50 border-b border-gray-800 pb-4">
            The Close
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div className="flex flex-col mb-16 md:mb-0">
              <h1 className="text-[10vw] sm:text-[8vw] font-black tracking-tighter leading-none uppercase mb-8">
                LET'S TALK
              </h1>
              <a href="mailto:devwithdevansh@gmail.com" className="text-2xl sm:text-4xl font-mono hover:text-[#EAB308] transition-colors" data-cursor="hover">
                devwithdevansh@gmail.com
              </a>
              <a href="tel:+919687629341" className="text-2xl sm:text-4xl font-mono mt-2 hover:text-[#EAB308] transition-colors" data-cursor="hover">
                +91 9687629341
              </a>
            </div>

            {/* Socials */}
            <div className="flex flex-col space-y-4 text-xl font-bold uppercase tracking-widest text-right">
              <a href="https://www.instagram.com/devwithdevansh?igsh=MTNqd2sxdTkwYzNlNw==" target="_blank" rel="noreferrer" className="hover:text-[#EAB308]" data-cursor="hover">Instagram</a>
              <a href="https://www.facebook.com/share/1EP8Ywtj8B/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="hover:text-[#EAB308]" data-cursor="hover">Facebook</a>
              <a href="http://www.youtube.com/@devwithdevansh" target="_blank" rel="noreferrer" className="hover:text-[#EAB308]" data-cursor="hover">YouTube</a>
              <a href="https://www.linkedin.com/in/dev-with-devansh-1aa665406?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer" className="hover:text-[#EAB308]" data-cursor="hover">LinkedIn (Company)</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
