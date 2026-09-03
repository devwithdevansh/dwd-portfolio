import React from 'react';
import { Helmet } from 'react-helmet-async';

const UnderConstruction = () => {
  return (
    <>
      <Helmet>
        <title>Site under construction</title>
        <style>{`
          body {
            background: #eef8fc;
            margin: 0;
            padding: 0;
          }
          @media (prefers-color-scheme: dark){
            body { background:#0d1b2a; }
          }
        `}</style>
      </Helmet>
      
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 box-border" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div className="w-full max-w-[900px]">
          <svg width="100%" viewBox="0 0 680 480" xmlns="http://www.w3.org/2000/svg" role="img" className="scene w-full h-auto block">
            <title>Website under construction billboard animation</title>
            <desc>An animated illustration of a roadside billboard against a blue sky with drifting clouds, showing a "site under construction" message with a pulsing loading indicator, an animated progress bar, and a small block tower building itself up.</desc>
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop className="sky-top-stop" offset="0%"/>
                <stop className="sky-bottom-stop" offset="100%"/>
              </linearGradient>
              <clipPath id="trackClip"><rect x="228" y="290" width="300" height="10" rx="5"/></clipPath>
              <style>{`
                .scene .sky-top-stop{stop-color:#bfe4f7}
                .scene .sky-bottom-stop{stop-color:#eef8fc}
                .scene .cloud{fill:#ffffff;opacity:0.95}
                .scene .leaf{fill:#7fb069}
                .scene .frame{fill:#20242b}
                .scene .panel{fill:#12151b}
                .scene .structure{fill:#5b6670}
                .scene .strut{stroke:#5b6670}
                .scene .text-main{fill:#f5f7fa}
                .scene .text-sub{fill:#a7afba}
                .scene .accent{fill:#f2a54a}
                .scene .track{fill:#232830}
                .scene .bird{stroke:#5b6670}
                @media (prefers-color-scheme: dark){
                  .scene .sky-top-stop{stop-color:#0d1b2a}
                  .scene .sky-bottom-stop{stop-color:#1c2c3e}
                  .scene .cloud{fill:#3d4c5e;opacity:0.55}
                  .scene .leaf{fill:#3f5d3a}
                }
                .cloud{animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}
                .c1{animation-name:drift1;animation-duration:26s}
                .c2{animation-name:drift2;animation-duration:34s}
                .c3{animation-name:drift3;animation-duration:22s}
                .c4{animation-name:drift1;animation-duration:30s}
                @keyframes drift1{from{transform:translate(0,0)}to{transform:translate(22px,-4px)}}
                @keyframes drift2{from{transform:translate(0,0)}to{transform:translate(-18px,3px)}}
                @keyframes drift3{from{transform:translate(0,0)}to{transform:translate(16px,4px)}}
                .leafgrp{transform-origin:30px 30px;animation:sway 5s ease-in-out infinite alternate}
                @keyframes sway{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
                .blink{animation:blink 1.6s ease-in-out infinite}
                @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
                .bird{animation-name:fly;animation-timing-function:linear;animation-iteration-count:infinite}
                .b1{animation-duration:16s}
                .b2{animation-duration:21s;animation-delay:-6s}
                @keyframes fly{0%{transform:translate(-40px,0)}25%{transform:translate(160px,-10px)}50%{transform:translate(360px,4px)}75%{transform:translate(560px,-8px)}100%{transform:translate(760px,0)}}
              `}</style>
            </defs>

            <rect x="0" y="0" width="680" height="480" fill="url(#skyGrad)"/>

            <g transform="translate(60,55)">
              <g className="cloud c1">
                <ellipse cx="0" cy="0" rx="34" ry="16"/>
                <ellipse cx="26" cy="-8" rx="24" ry="14"/>
                <ellipse cx="-24" cy="-4" rx="20" ry="12"/>
              </g>
            </g>

            <g transform="translate(430,40)">
              <g className="cloud c2">
                <ellipse cx="0" cy="0" rx="46" ry="18"/>
                <ellipse cx="34" cy="-6" rx="26" ry="15"/>
                <ellipse cx="-30" cy="-2" rx="24" ry="13"/>
              </g>
            </g>

            <g transform="translate(590,95)">
              <g className="cloud c3">
                <ellipse cx="0" cy="0" rx="30" ry="14"/>
                <ellipse cx="20" cy="-6" rx="18" ry="11"/>
              </g>
            </g>

            <g transform="translate(250,90)">
              <g className="cloud c4">
                <ellipse cx="0" cy="0" rx="26" ry="12"/>
                <ellipse cx="18" cy="-5" rx="16" ry="10"/>
              </g>
            </g>

            <g className="leafgrp">
              <path className="leaf" d="M10 15 Q30 0 55 10 Q35 25 10 15Z"/>
              <path className="leaf" d="M5 35 Q28 25 48 38 Q26 48 5 35Z"/>
            </g>

            <path className="bird b1" d="M0 70 q8 -8 16 0 q8 -8 16 0" fill="none" strokeWidth="2" strokeLinecap="round"/>
            <path className="bird b2" d="M0 105 q6 -6 12 0 q6 -6 12 0" fill="none" strokeWidth="1.6" strokeLinecap="round"/>

            <rect className="structure" x="330" y="345" width="20" height="135" rx="3"/>
            <line className="strut" x1="340" y1="345" x2="100" y2="340" strokeWidth="4" strokeLinecap="round"/>
            <line className="strut" x1="340" y1="345" x2="580" y2="340" strokeWidth="4" strokeLinecap="round"/>
            <rect className="structure" x="90" y="336" width="500" height="9" rx="3"/>

            <line className="strut" x1="120" y1="150" x2="120" y2="128" strokeWidth="3"/>
            <circle className="accent blink" cx="120" cy="124" r="4"/>
            <line className="strut" x1="560" y1="150" x2="560" y2="128" strokeWidth="3"/>
            <circle className="accent blink" cx="560" cy="124" r="4" style={{animationDelay: '0.8s'}}/>

            <rect className="frame" x="70" y="150" width="540" height="190" rx="8"/>
            <rect className="panel" x="82" y="162" width="516" height="166" rx="4"/>

            <g>
              <rect className="accent" x="110" y="270" width="16" height="30">
                <animate attributeName="height" values="30;60;30" dur="2.4s" repeatCount="indefinite"/>
                <animate attributeName="y" values="270;240;270" dur="2.4s" repeatCount="indefinite"/>
              </rect>
              <rect className="accent" x="134" y="255" width="16" height="45">
                <animate attributeName="height" values="45;75;45" dur="2.4s" begin="0.3s" repeatCount="indefinite"/>
                <animate attributeName="y" values="255;225;255" dur="2.4s" begin="0.3s" repeatCount="indefinite"/>
              </rect>
              <rect className="accent" x="158" y="240" width="16" height="60">
                <animate attributeName="height" values="60;35;60" dur="2.4s" begin="0.6s" repeatCount="indefinite"/>
                <animate attributeName="y" values="240;265;240" dur="2.4s" begin="0.6s" repeatCount="indefinite"/>
              </rect>
              <rect className="accent" x="182" y="260" width="16" height="40">
                <animate attributeName="height" values="40;65;40" dur="2.4s" begin="0.9s" repeatCount="indefinite"/>
                <animate attributeName="y" values="260;235;260" dur="2.4s" begin="0.9s" repeatCount="indefinite"/>
              </rect>
              <rect className="structure" x="100" y="300" width="108" height="4" rx="2"/>
            </g>

            <text className="text-main" x="228" y="225" fontSize="28" fontWeight="500">Site under construction</text>
            <text className="text-sub" x="228" y="255" fontSize="16">We'll be back soon</text>
            
            <circle className="accent" cx="396" cy="251" r="3">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
            </circle>
            <circle className="accent" cx="408" cy="251" r="3">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>
            </circle>
            <circle className="accent" cx="420" cy="251" r="3">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" begin="0.4s" repeatCount="indefinite"/>
            </circle>

            <rect className="track" x="228" y="290" width="300" height="10" rx="5"/>
            <rect className="accent" x="228" y="290" width="90" height="10" rx="5" clipPath="url(#trackClip)">
              <animate attributeName="x" values="128;528" dur="2.6s" repeatCount="indefinite"/>
            </rect>

          </svg>
        </div>
      </div>
    </>
  );
};

export default UnderConstruction;
