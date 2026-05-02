import React from 'react';

import HeroOrbitShapes from './HeroOrbitShapes';



const PinkElephantShowcase = React.memo(function PinkElephantShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[1280px] lg:justify-self-end">
      <HeroOrbitShapes />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(196,236,255,0.28),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(216,214,255,0.28),transparent_20%),radial-gradient(circle_at_65%_70%,rgba(255,210,222,0.24),transparent_24%)]" />
       
      
       <div className="absolute right-8 top-14 h-18 w-18 rounded-full bg-[radial-gradient(circle,_rgba(167,206,255,0.9),_rgba(187,205,255,0.45)_62%,_transparent_75%)] blur-sm" />
       <div className="absolute right-0 top-1/2 h-[430px] w-[430px] -translate-y-1/2 rounded-full border-[10px] border-calm-primary/10" />
       <div className="absolute right-6 top-1/2 h-[390px] w-[390px] -translate-y-1/2 rounded-full border-[8px] border-calm-primary/8" />
       <div className="absolute right-12 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full border-[6px] border-calm-primary/6" />

       <div className="relative aspect-[1.02/1]">

         
      

         <div className="absolute left-[38%] top-[28%] h-[34%] w-[34%] rounded-full border-[22px] border-[#bfd0ff]/58 bg-transparent" />
         <div className="absolute left-[41.5%] top-[31.5%] h-[27%] w-[27%] rounded-full border-[18px] border-[#cce4ff]/72 bg-transparent" />
         <div className="absolute left-[45%] top-[35%] h-[20%] w-[20%] rounded-full bg-[radial-gradient(circle,_rgba(137,226,233,0.66),_rgba(182,217,255,0.56)_55%,_rgba(255,214,224,0.52))] shadow-[0_0_35px_rgba(135,210,244,0.35)]" />

         <div className="absolute left-[29%] top-[12%] h-14 w-14 rounded-full bg-[radial-gradient(circle,_rgba(140,228,237,0.78),_rgba(164,192,255,0.74)_58%,_rgba(255,255,255,0.1))] blur-[1px]" />
         <div className="absolute left-[58%] top-[2%] h-14 w-14 rounded-full bg-[radial-gradient(circle,_rgba(161,187,255,0.8),_rgba(183,214,255,0.62)_58%,_transparent)] blur-[1px]" />
         <div className="absolute right-[13%] top-[44%] h-14 w-14 rounded-full bg-[radial-gradient(circle,_rgba(255,201,210,0.82),_rgba(255,216,230,0.62)_60%,_transparent)] blur-[1px]" />
         <div className="absolute right-[28%] bottom-[3%] h-14 w-14 rounded-full bg-[radial-gradient(circle,_rgba(133,226,225,0.78),_rgba(172,209,255,0.68)_58%,_transparent)] blur-[1px]" />
         <div className="absolute left-[17%] top-[39%] flex h-16 w-16 items-center justify-center rounded-full border-2 border-calm-primary/22 bg-white/38 shadow-subtle backdrop-blur-sm">
           <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle,_rgba(137,226,233,0.78),_rgba(164,192,255,0.74)_58%,_transparent)]" />
         </div>
        </div>
    </div>
  );
});

export default PinkElephantShowcase;
