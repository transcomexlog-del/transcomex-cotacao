import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const C = {
  orange:"#E57836", accent:"#FF9A5C", deep:"#C85E1F",
  ink:"#08090E", card:"#0E1118", elevated:"#141A24",
  white:"#F4F8FC", muted:"rgba(244,248,252,.58)",
  subtle:"rgba(244,248,252,.28)", border:"rgba(244,248,252,.09)"
};
const ports = [
  "Itajaí / SC","Navegantes / SC","São Francisco do Sul / SC",
  "Itapoá / SC","Imbituba / SC","Paranaguá / PR","Rio Grande / RS"
];
const containerTypes = ["20' Dry","40' Dry","40' High Cube","Flat Rack","Open Top","Reefer (frigorificado)"];
const packagingTypes = ["Palete","Caixa","Engradado","Máquina ou equipamento","Peça avulsa"];
const reveal: Variants = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:.65}} };
const stepLabels = ["Contato","Operação","Carga","Mercadoria","Revisão"];

function Btn({children,onClick,secondary=false,full=false,disabled=false}:{children:ReactNode;onClick?:()=>void;secondary?:boolean;full?:boolean;disabled?:boolean}) {
  return (
    <motion.button whileHover={disabled?undefined:{scale:1.025}} whileTap={disabled?undefined:{scale:.97}} onClick={onClick} disabled={disabled}
      style={{cursor:disabled?"not-allowed":"pointer",border:secondary?`1px solid ${C.border}`:"0",borderRadius:100,
        padding:secondary?"14px 20px":"16px 26px",
        background:secondary?"rgba(244,248,252,.07)":`linear-gradient(135deg,${C.orange},${C.deep})`,
        color:C.white,font:`700 14px Montserrat`,boxShadow:secondary?"none":"0 12px 32px rgba(229,120,54,.28)",
        display:"inline-flex",alignItems:"center",gap:8,width:full?"100%":"auto",justifyContent:"center",
        opacity:disabled?.6:1,
        animation:secondary||disabled?"none":"transcomex-pulse 2.8s infinite"}}>
      {children}
    </motion.button>
  );
}

function Field({label,type="text",placeholder,value,onChange}:{label:string;type?:string;placeholder?:string;value:string;onChange:(v:string)=>void}) {
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:6,textTransform:"uppercase"}}>{label}</div>
      <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
        style={{display:"block",width:"100%",padding:"13px 16px",borderRadius:10,border:`1px solid ${C.border}`,
          background:C.elevated,color:C.white,font:"500 13px Montserrat",outline:"none",boxSizing:"border-box"}}/>
    </div>
  );
}

function OptionCard({label,sub,selected,onClick}:{label:string;sub?:string;selected:boolean;onClick:()=>void}) {
  return (
    <button onClick={onClick}
      style={{display:"block",width:"100%",textAlign:"left",padding:"14px 16px",margin:"8px 0",borderRadius:12,
        border:`1px solid ${selected?C.orange:C.border}`,background:selected?"rgba(229,120,54,.1)":"transparent",
        color:C.white,cursor:"pointer",font:"600 13px Montserrat"}}>
      {label}
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:3,fontWeight:400}}>{sub}</div>}
    </button>
  );
}

function SectionTitle({eyebrow,title,muted}:{eyebrow:string;title:string;muted:string}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{once:true,margin:"-80px"}} variants={reveal}>
      <div style={{color:C.orange,fontSize:10,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase"}}>{eyebrow}</div>
      <h2 style={{fontSize:44,lineHeight:1.04,letterSpacing:"-.055em",margin:"14px 0 0",fontWeight:800}}>
        {title} <span style={{color:C.muted}}>{muted}</span>
      </h2>
    </motion.div>
  );
}

function Counter({n,label}:{n:number;label:string}) {
  const ref=useRef<HTMLDivElement>(null);
  const on=useInView(ref,{once:true,margin:"-80px"});
  const [v,setV]=useState(0);
  useEffect(()=>{
    if(!on)return;
    let f=0;const s=performance.now();
    const t=(x:number)=>{const p=Math.min((x-s)/1500,1);setV(Math.floor(n*(1-Math.pow(1-p,4))));if(p<1)f=requestAnimationFrame(t)};
    f=requestAnimationFrame(t);return()=>cancelAnimationFrame(f);
  },[on,n]);
  return (
    <div ref={ref}>
      <div style={{color:C.orange,fontSize:72,fontWeight:900,letterSpacing:"-.08em"}}>
        {v}{n===20||n===5000?"+":n===100?"%":""}
      </div>
      <div style={{color:C.muted,fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginTop:12}}>{label}</div>
    </div>
  );
}

function SumRow({label,value}:{label:string;value:string}) {
  if(!value) return null;
  return (
    <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
      <span style={{color:C.muted,fontSize:12}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,maxWidth:200,textAlign:"right"}}>{value}</span>
    </div>
  );
}

export function CotacaoLanding() {
  const [step,setStep]=useState(1);
  const [name,setName]=useState(""); const [company,setCompany]=useState("");
  const [email,setEmail]=useState(""); const [operation,setOperation]=useState("");
  const [port,setPort]=useState(""); const [cargoMode,setCargoMode]=useState("");
  const [containerType,setContainerType]=useState(""); const [packaging,setPackaging]=useState("");
  const [qtdVolumes,setQtdVolumes]=useState(""); const [comprimento,setComprimento]=useState("");
  const [largura,setLargura]=useState(""); const [altura,setAltura]=useState("");
  const [cep,setCep]=useState(""); const [weight,setWeight]=useState("");
  const [mercType,setMercType]=useState(""); const [mercValue,setMercValue]=useState("");
  const [special,setSpecial]=useState<string[]>([]);
  const [deliveryCity,setDeliveryCity]=useState(""); const [submitted,setSubmitted]=useState(false);
  const [sending,setSending]=useState(false); const [error,setError]=useState("");
  const convertedRef=useRef(false);

  const go=()=>document.getElementById("cotacao")?.scrollIntoView({behavior:"smooth"});

  const cards=[
    ["⏱","Cada hora parada no porto custa dinheiro","Demurrage, armazenagem e multas se acumulam a cada dia. A Transcomex age rápido: coleta em até 24h após o desembaraço."],
    ["◈","Carga sem seguro real é prejuízo garantido","Operamos com apólices RCTR-C e RCF-DC junto à Seguradora Fairfax do Brasil — cobertura integral contra dano, avaria e desaparecimento."],
    ["⌁","Porto no Sul, cliente no Brasil inteiro","Do Porto de Itajaí até São Paulo, Rio de Janeiro, Manaus ou Brasília — com rastreamento em tempo real e prazo garantido em contrato."]
  ];

  const diff=[
    ["▣","RCTR-C + RCF-DC","Apólices ativas com Seguradora Fairfax do Brasil. Cobertura total para dano, avaria e desaparecimento da carga."],
    ["◉","Gerenciadora GLOBAL 5","Todos os veículos monitorados pela GLOBAL 5 — uma das maiores gerenciadoras de risco do Brasil."],
    ["▤","Registro ANTT","Empresa regularmente registrada na Agência Nacional de Transporte Terrestre. Você está seguro."],
    ["⌾","Rastreamento em tempo real","Acompanhe sua carga do momento da coleta até a entrega final. Visibilidade 100% da operação."],
    ["⚗","Químicos e cargas especiais","Licenciados para transporte de produtos químicos perigosos e não perigosos com todos os certificados exigidos."],
    ["✦","GPTW® Certificada","Great Place to Work® — porque empresas que cuidam de pessoas cuidam também da sua carga."]
  ];

  const toggleSpecial=(v:string)=>setSpecial(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const canNext:Record<number,boolean>={
    1:!!(name.trim()&&company.trim()&&email.trim()),
    2:!!(operation&&port),
    3:!!(cargoMode&&(cargoMode==="conteiner"?containerType:(packaging&&qtdVolumes))),
    4:!!(weight&&mercType&&deliveryCity),
    5:true
  };

  const handleSubmit=async()=>{
    if(sending) return;
    if(!canNext[1]||!canNext[2]||!canNext[3]||!canNext[4]){
      setError("Alguns campos obrigatórios não foram preenchidos. Revise os dados antes de enviar.");
      return;
    }
    setError("");
    setSending(true);

    const cubagem=(()=>{
      const q=parseFloat(qtdVolumes)||0,c=parseFloat(comprimento)||0,l=parseFloat(largura)||0,a=parseFloat(altura)||0;
      return q&&c&&l&&a?(q*c*l*a/1_000_000).toLocaleString("pt-BR",{minimumFractionDigits:3,maximumFractionDigits:3})+" m³":"";
    })();

    const payload:Record<string,string>={
      access_key:"fb46852c-7aa8-4f5a-9b7a-879c888ca0ac",
      subject:"🚛 Nova cotação - Landing Premium",
      from_name:"Landing Premium — Transcomex",
      "Nome":name,
      "Empresa":company,
      "E-mail":email,
      "Operação":operation,
      "Porto":port,
      "Modo de transporte":cargoMode==="conteiner"?"Contêiner":cargoMode==="solta"?"Carga solta":"",
      "Tipo de contêiner":cargoMode==="conteiner"?containerType:"",
      "Embalagem":cargoMode==="solta"?packaging:"",
      "Quantidade de volumes":cargoMode==="solta"?qtdVolumes:"",
      "Dimensões por volume (cm)":cargoMode==="solta"?[comprimento,largura,altura].filter(Boolean).join(" × "):"",
      "Cubagem total":cargoMode==="solta"?cubagem:"",
      "Peso aproximado (kg)":weight,
      "Tipo de mercadoria":mercType,
      "Valor aproximado da mercadoria (R$)":mercValue,
      "Características especiais":special.join(", ")||"Nenhuma",
      "Cidade de entrega":deliveryCity,
      "CEP de entrega":cep,
      "Origem da Landing":"Landing Premium",
      "URL":"https://transcomex-cotacao.pages.dev",
      botcheck:""
    };

    try{
      const res=await fetch("https://api.web3forms.com/submit",{
        method:"POST",
        headers:{"Content-Type":"application/json",Accept:"application/json"},
        body:JSON.stringify(payload)
      });
      const data:{success?:boolean}=await res.json();
      if(res.ok&&data.success){
        setSubmitted(true);
        // Conversão Google Ads — mesma ação "Lead - Cotação Transcomex" da Campanha 1.
        // Dispara apenas no sucesso do Web3Forms, uma única vez por envio; se o gtag não
        // carregar, o formulário segue funcionando normalmente.
        if(!convertedRef.current){
          convertedRef.current=true;
          const w=window as unknown as {gtag?:(...args:unknown[])=>void};
          if(typeof w.gtag==="function"){
            w.gtag("event","conversion",{send_to:"AW-927420803/wY6RCIyM8dwcEIOjnboD"});
          }
        }
      }else{
        setError("Não foi possível enviar sua solicitação agora. Seus dados foram preservados — verifique a conexão e tente novamente em instantes.");
      }
    }catch{
      setError("Não foi possível enviar sua solicitação agora. Seus dados foram preservados — verifique a conexão e tente novamente em instantes.");
    }finally{
      setSending(false);
    }
  };

  return (
    <div style={{width:"100%",minHeight:"100vh",background:C.ink,color:C.white,fontFamily:"Montserrat,sans-serif",overflowX:"hidden"}}>

      {/* NAV */}
      <motion.nav initial={{y:-40,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.1}}
        style={{position:"fixed",zIndex:100,top:16,left:"50%",transform:"translateX(-50%)",
          width:"calc(100% - 64px)",height:68,border:`1px solid ${C.border}`,
          background:"rgba(8,9,14,.75)",backdropFilter:"blur(24px)",borderRadius:100,
          display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px 0 24px"}}>
        <img src="/images/logo-white.png" alt="Transcomex" style={{width:140}}/>
        <div style={{fontSize:11,fontWeight:600,color:C.muted}}>
          <i style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#68D391",boxShadow:"0 0 12px #68D391",marginRight:8}}/>
          Online · Atendimento em andamento
        </div>
        <Btn onClick={go}>Solicitar cotação</Btn>
      </motion.nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",position:"relative",display:"flex",alignItems:"center",
        backgroundImage:"linear-gradient(105deg,rgba(8,9,14,.97),rgba(8,9,14,.82) 48%,rgba(8,9,14,.92)),url('/images/cotacao-hero-dark.png')",
        backgroundSize:"cover",backgroundPosition:"center"}}>
        {Array.from({length:20},(_,i)=>(
          <i key={i} style={{position:"absolute",left:`${5+(i*31)%92}%`,top:`${15+(i*23)%75}%`,
            width:i%4===0?5:3,height:i%4===0?5:3,borderRadius:"50%",background:C.accent,
            animation:`transcomex-float ${4+i%4}s ease-in-out ${-i*.35}s infinite`}}/>
        ))}
        <div style={{width:"min(1310px,calc(100% - 130px))",margin:"0 auto",paddingTop:70,position:"relative",zIndex:1}}>
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.1}}
            style={{display:"inline-block",padding:"9px 16px",borderRadius:100,
              border:"1px solid rgba(229,120,54,.35)",background:"rgba(229,120,54,.12)",color:"#FFC39E",fontSize:11,fontWeight:700}}>
            Portos do Sul → Qualquer estado do Brasil
          </motion.div>
          <h1 style={{fontSize:"clamp(52px,6.5vw,90px)",lineHeight:.92,letterSpacing:"-.07em",fontWeight:900,margin:"24px 0 25px",maxWidth:820}}>
            {["Sua","carga","chegou","ao","porto."].map((w,i)=>(
              <motion.span key={w} initial={{y:24,opacity:0}} animate={{y:0,opacity:1}}
                transition={{delay:.15+i*.065}} style={{display:"inline-block",marginRight:20}}>{w}</motion.span>
            ))}
            <br/>
            <span style={{color:C.accent}}>
              {["Nós","cuidamos","do","resto."].map((w,i)=>(
                <motion.span key={w} initial={{y:24,opacity:0}} animate={{y:0,opacity:1}}
                  transition={{delay:.55+i*.065}} style={{display:"inline-block",marginRight:20}}>{w}</motion.span>
              ))}
            </span>
          </h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}
            style={{fontSize:19,lineHeight:1.6,color:C.muted,maxWidth:580,margin:"0 0 32px"}}>
            Transporte rodoviário porta-a-porta para importadores, exportadores e embarcadores.
            20 anos servindo o comércio exterior brasileiro com comprometimento e segurança.
          </motion.p>
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:1.05}}>
            <Btn onClick={go}>Quero minha cotação agora</Btn>
          </motion.div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:24,fontSize:11,fontWeight:600}}>
            {["Resposta em até 2h","RCTR-C e RCF-DC","Registrada na ANTT","Rastreamento em tempo real","Sem compromisso"].map(x=>(
              <span key={x} style={{color:C.muted}}>✓ {x}</span>
            ))}
          </div>
        </div>
        <div style={{position:"absolute",bottom:28,left:"50%",color:C.muted,fontSize:9,letterSpacing:".18em",textAlign:"center"}}>
          CONHEÇA O CAMINHO<div style={{fontSize:24,animation:"transcomex-bounce 1.6s infinite"}}>↓</div>
        </div>
      </section>

      {/* PAIN CARDS */}
      <section style={{padding:"110px 65px 120px",background:"#0A0D14"}}>
        <div style={{maxWidth:1310,margin:"auto"}}>
          <SectionTitle eyebrow="O custo de esperar" title="Você importa." muted="Nós entregamos."/>
          <p style={{fontSize:20,color:C.muted,marginTop:16}}>Sem surpresas. Sem sumiços. Sem desculpas.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginTop:60}}>
            {cards.map(([icon,t,b],i)=>(
              <motion.article key={t as string} initial="hidden" whileInView="visible" viewport={{once:true}}
                variants={{...reveal,visible:{...reveal.visible,transition:{delay:i*.12}}}}
                style={{background:C.card,borderLeft:`3px solid ${C.orange}`,borderRadius:"0 14px 14px 0",padding:32,minHeight:220}}>
                <div style={{fontSize:32,color:C.accent,marginBottom:20}}>{icon}</div>
                <h3 style={{fontSize:18,lineHeight:1.3,margin:0}}>{t}</h3>
                <p style={{fontSize:13,lineHeight:1.6,color:C.muted}}>{b}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:"110px 65px",background:C.ink}}>
        <div style={{maxWidth:1310,margin:"auto"}}>
          <SectionTitle eyebrow="Do porto ao destino" title="Três movimentos." muted="Zero complicação."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:50,marginTop:70}}>
            {[["01","Preencha em 2 minutos","Informe porto de origem, destino e tipo de carga. Sem burocracia, sem papelada inicial."],
              ["02","Cotação personalizada em até 2h","Nossa equipe comercial analisa a rota, o volume e as particularidades da sua operação. Nada de proposta genérica."],
              ["03","Coleta e entrega com rastreamento","Veículo rastreado, motorista identificado, RCTR-C ativo. Acompanhe a carga em tempo real."]
            ].map(([n,t,b],i)=>(
              <motion.div key={n} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.15}}>
                <div style={{width:52,height:52,border:`1px solid ${C.orange}`,borderRadius:"50%",display:"grid",placeItems:"center",color:C.accent,fontWeight:800}}>{n}</div>
                <h3 style={{fontSize:19,margin:"25px 0 10px"}}>{t}</h3>
                <p style={{fontSize:13,lineHeight:1.6,color:C.muted,maxWidth:280}}>{b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTERS */}
      <section style={{padding:"90px 65px",background:"linear-gradient(180deg,#08090E,#0C0F17)",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:30,textAlign:"center"}}>
        {([[20,"Anos de experiência"],[5000,"Cotações realizadas"],[7,"Portos atendidos"],[100,"Carga assegurada"]] as [number,string][]).map(([n,l])=>(
          <Counter key={l} n={n} label={l}/>
        ))}
      </section>

      {/* DIFERENCIAIS */}
      <section style={{padding:"110px 65px",background:"#0A0D14"}}>
        <div style={{maxWidth:1310,margin:"auto"}}>
          <SectionTitle eyebrow="Estrutura real" title="Porque quem entrega" muted="sabe o que promete."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginTop:60}}>
            {diff.map(([ic,t,b],n)=>(
              <motion.article key={t as string} whileHover={{y:-4}} initial="hidden" whileInView="visible"
                viewport={{once:true}} variants={{...reveal,visible:{...reveal.visible,transition:{delay:n*.06}}}}
                style={{background:C.elevated,border:`1px solid ${C.border}`,borderRadius:16,padding:32}}>
                <div style={{fontSize:26,color:C.accent}}>{ic}</div>
                <h3 style={{fontSize:17,margin:"20px 0 10px"}}>{t}</h3>
                <p style={{fontSize:13,lineHeight:1.6,color:C.muted,margin:0}}>{b}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PORT ROUTE */}
      <section style={{padding:"100px 65px",background:C.ink}}>
        <div style={{maxWidth:1310,margin:"auto"}}>
          <div style={{textAlign:"center"}}>
            <SectionTitle eyebrow="Uma frota, sete portas" title="De onde sua carga vem," muted="não limita onde ela vai."/>
          </div>
          <div style={{display:"flex",alignItems:"center",marginTop:70}}>
            {[...ports,"Todo o Brasil"].map((p,i)=>{const last=i===ports.length;return(
              <div key={p} style={{display:"flex",alignItems:"center",flex:last?"0 0 auto":1}}>
                <div style={{minWidth:last?130:100,textAlign:"center"}}>
                  <div style={{width:last?16:10,height:last?16:10,margin:"0 auto 12px",borderRadius:"50%",
                    background:last?C.accent:C.orange,boxShadow:"0 0 0 6px rgba(229,120,54,.12)"}}/>
                  <div style={{fontSize:9,fontWeight:700,lineHeight:1.4,color:last?C.accent:C.white}}>{p}</div>
                </div>
                {!last&&<motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}}
                  transition={{delay:i*.1}} style={{transformOrigin:"left",flex:1,borderTop:"1px dashed rgba(229,120,54,.45)",margin:"0 6px 24px"}}/>}
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="cotacao" style={{padding:"110px 65px 120px",background:"radial-gradient(circle at 50% 0%,rgba(229,120,54,.22),transparent 60%),#08090E"}}>
        <div style={{maxWidth:1310,margin:"auto",display:"grid",gridTemplateColumns:"1fr 480px",gap:80}}>
          <div>
            <div style={{color:C.orange,fontSize:10,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase"}}>A próxima entrega começa agora</div>
            <h2 style={{fontSize:62,lineHeight:1,letterSpacing:"-.07em",margin:"18px 0"}}>Peça sua cotação.</h2>
            <p style={{color:C.muted,fontSize:17,lineHeight:1.6,maxWidth:500}}>
              Preencha as informações da sua operação. Nossa equipe comercial analisa e entra em contato em até 2 horas com uma proposta personalizada.
            </p>
            <div style={{display:"grid",gap:14,marginTop:32,fontSize:13}}>
              {["Sem compromisso de contratação","Proposta personalizada para sua rota","Atendimento humano — não é robô","RCTR-C ativo em todas as operações","Seus dados estão protegidos"].map(x=>(
                <span key={x} style={{color:C.muted}}>✓ <b style={{color:C.accent}}>{x}</b></span>
              ))}
            </div>
            <div style={{marginTop:40,color:C.muted,fontSize:13}}>comercial@transcomexlog.com.br</div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:36,alignSelf:"start"}}>
            {submitted?(
              <div style={{padding:"50px 0",textAlign:"center"}}>
                <div style={{fontSize:54,color:C.accent}}>✓</div>
                <h3 style={{fontSize:23,margin:"20px 0 12px"}}>Solicitação enviada!</h3>
                <p style={{color:C.muted,lineHeight:1.6,fontSize:14}}>Nossa equipe comercial vai analisar os dados e entrar em contato em até 2 horas úteis.</p>
              </div>
            ):(
              <>
                <div style={{marginBottom:28}}>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {stepLabels.map((_,i)=>(
                      <div key={i} style={{height:4,flex:1,borderRadius:4,
                        background:step>i+1?C.orange:step===i+1?`linear-gradient(90deg,${C.orange},${C.accent})`:"rgba(255,255,255,.08)",transition:"background .3s"}}/>
                    ))}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    {stepLabels.map((l,i)=>(
                      <span key={l} style={{fontSize:9,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",
                        color:step===i+1?C.accent:step>i+1?C.orange:C.subtle}}>{l}</span>
                    ))}
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{opacity:0,x:28}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-28}} transition={{duration:.28}}>

                    {step===1&&<div>
                      <h3 style={{fontSize:17,margin:"0 0 4px"}}>Olá! Vamos preparar sua cotação.</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:20,lineHeight:1.5}}>Conte rapidamente sobre você e sua empresa.</p>
                      <Field label="Nome completo" placeholder="Seu nome" value={name} onChange={setName}/>
                      <Field label="Empresa" placeholder="Nome da empresa" value={company} onChange={setCompany}/>
                      <Field label="E-mail corporativo" type="email" placeholder="seuemail@empresa.com.br" value={email} onChange={setEmail}/>
                      <div style={{marginTop:20}}><Btn full onClick={()=>canNext[1]&&setStep(2)}>Próximo →</Btn></div>
                    </div>}

                    {step===2&&<div>
                      <h3 style={{fontSize:17,margin:"0 0 4px"}}>Qual operação você deseja cotar?</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>Selecione o tipo e o porto de referência.</p>
                      <OptionCard label="Importação" sub="Do porto ou terminal até o destino." selected={operation==="Importação"} onClick={()=>setOperation("Importação")}/>
                      <OptionCard label="Exportação" sub="Da origem até o porto ou terminal." selected={operation==="Exportação"} onClick={()=>setOperation("Exportação")}/>
                      {operation&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{marginTop:16}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Porto da operação</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          {ports.map(p=>(
                            <button key={p} onClick={()=>setPort(p)}
                              style={{padding:"10px 12px",textAlign:"left",borderRadius:10,fontSize:11,fontWeight:600,
                                border:`1px solid ${port===p?C.orange:C.border}`,background:port===p?"rgba(229,120,54,.1)":"transparent",
                                color:C.white,cursor:"pointer",fontFamily:"Montserrat"}}>{p}</button>
                          ))}
                        </div>
                      </motion.div>}
                      <div style={{display:"flex",gap:10,marginTop:20}}>
                        <Btn secondary onClick={()=>setStep(1)}>← Voltar</Btn>
                        <Btn full onClick={()=>canNext[2]&&setStep(3)}>Próximo →</Btn>
                      </div>
                    </div>}

                    {step===3&&<div>
                      <h3 style={{fontSize:17,margin:"0 0 4px"}}>Como a mercadoria será transportada?</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>Selecione o modo de transporte da carga.</p>
                      <OptionCard label="Carga em contêiner" sub="Mercadoria transportada em equipamento marítimo." selected={cargoMode==="conteiner"} onClick={()=>{setCargoMode("conteiner");setPackaging("")}}/>
                      <OptionCard label="Carga solta" sub="Paletes, caixas, máquinas, peças ou outros volumes." selected={cargoMode==="solta"} onClick={()=>{setCargoMode("solta");setContainerType("")}}/>

                      {cargoMode==="conteiner"&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{marginTop:14}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Tipo de contêiner</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                          {containerTypes.map(c=>(
                            <button key={c} onClick={()=>setContainerType(c)}
                              style={{padding:"10px 12px",textAlign:"left",borderRadius:10,fontSize:11,fontWeight:600,
                                border:`1px solid ${containerType===c?C.orange:C.border}`,background:containerType===c?"rgba(229,120,54,.1)":"transparent",
                                color:C.white,cursor:"pointer",fontFamily:"Montserrat"}}>{c}</button>
                          ))}
                        </div>
                      </motion.div>}

                      {cargoMode==="solta"&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{marginTop:14}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Embalagem / apresentação</div>
                        {packagingTypes.map(p=>(
                          <button key={p} onClick={()=>setPackaging(p)}
                            style={{display:"block",width:"100%",textAlign:"left",padding:"11px 14px",margin:"6px 0",borderRadius:10,fontSize:12,fontWeight:600,
                              border:`1px solid ${packaging===p?C.orange:C.border}`,background:packaging===p?"rgba(229,120,54,.1)":"transparent",
                              color:C.white,cursor:"pointer",fontFamily:"Montserrat"}}>{p}</button>
                        ))}
                        {packaging&&<motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} style={{marginTop:16}}>
                          <Field label="Quantidade de volumes" placeholder="Ex.: 10" value={qtdVolumes} onChange={setQtdVolumes}/>
                          <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:8,textTransform:"uppercase"}}>Dimensões por volume (cm)</div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                            {([["Comp.",comprimento,setComprimento],["Larg.",largura,setLargura],["Alt.",altura,setAltura]] as [string,string,(v:string)=>void][]).map(([lbl,val,set])=>(
                              <div key={lbl}>
                                <div style={{fontSize:9,color:C.subtle,marginBottom:4,fontWeight:600}}>{lbl}</div>
                                <input placeholder="cm" value={val} onChange={e=>set(e.target.value)}
                                  style={{width:"100%",padding:"11px 10px",borderRadius:10,border:`1px solid ${C.border}`,
                                    background:C.elevated,color:C.white,font:"500 13px Montserrat",boxSizing:"border-box",outline:"none"}}/>
                              </div>
                            ))}
                          </div>
                          {(()=>{
                            const q=parseFloat(qtdVolumes)||0,c=parseFloat(comprimento)||0,l=parseFloat(largura)||0,a=parseFloat(altura)||0;
                            if(!q||!c||!l||!a)return null;
                            const m3=(q*c*l*a/1_000_000);
                            return<motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}}
                              style={{marginTop:14,padding:"12px 16px",borderRadius:10,background:"rgba(229,120,54,.08)",border:`1px solid rgba(229,120,54,.3)`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                              <span style={{fontSize:11,color:C.muted,fontWeight:600}}>Cubagem total calculada</span>
                              <span style={{fontSize:15,fontWeight:800,color:C.orange}}>{m3.toLocaleString("pt-BR",{minimumFractionDigits:3,maximumFractionDigits:3})} m³</span>
                            </motion.div>;
                          })()}
                        </motion.div>}
                      </motion.div>}

                      <div style={{display:"flex",gap:10,marginTop:20}}>
                        <Btn secondary onClick={()=>setStep(2)}>← Voltar</Btn>
                        <Btn full onClick={()=>canNext[3]&&setStep(4)}>Próximo →</Btn>
                      </div>
                    </div>}

                    {step===4&&<div>
                      <h3 style={{fontSize:17,margin:"0 0 4px"}}>Dados da mercadoria</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:16,lineHeight:1.5}}>Estamos quase terminando.</p>
                      <Field label="Peso aproximado (kg)" placeholder="Ex.: 24.000" value={weight} onChange={setWeight}/>
                      <Field label="Tipo de mercadoria" placeholder="Ex.: máquinas, alimentos, produtos químicos" value={mercType} onChange={setMercType}/>
                      <Field label="Valor aproximado da mercadoria (R$)" placeholder="Ex.: 150.000" value={mercValue} onChange={setMercValue}/>
                      <div style={{marginBottom:14}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:".1em",marginBottom:10,textTransform:"uppercase"}}>Característica especial da carga</div>
                        {["IMO — Carga perigosa","Excesso de dimensões","Nenhuma"].map(v=>(
                          <button key={v} onClick={()=>toggleSpecial(v)}
                            style={{display:"block",width:"100%",textAlign:"left",padding:"11px 14px",margin:"6px 0",borderRadius:10,fontSize:12,fontWeight:600,
                              border:`1px solid ${special.includes(v)?C.orange:C.border}`,background:special.includes(v)?"rgba(229,120,54,.1)":"transparent",
                              color:C.white,cursor:"pointer",fontFamily:"Montserrat"}}>
                            {special.includes(v)?"✓ ":""}{v}
                          </button>
                        ))}
                      </div>
                      <Field label="Cidade de entrega" placeholder="Ex.: São Paulo / SP" value={deliveryCity} onChange={setDeliveryCity}/>
                      <Field label="CEP de entrega (opcional)" placeholder="Ex.: 01310-100" value={cep} onChange={setCep}/>
                      <div style={{display:"flex",gap:10,marginTop:20}}>
                        <Btn secondary onClick={()=>setStep(3)}>← Voltar</Btn>
                        <Btn full onClick={()=>canNext[4]&&setStep(5)}>Revisar →</Btn>
                      </div>
                    </div>}

                    {step===5&&<div>
                      <h3 style={{fontSize:17,margin:"0 0 4px"}}>Tudo certo! Confira os dados.</h3>
                      <p style={{color:C.muted,fontSize:12,marginBottom:18,lineHeight:1.5}}>Se estiver correto, envie a solicitação.</p>
                      <div style={{background:C.elevated,borderRadius:12,padding:16,marginBottom:20}}>
                        <SumRow label="Nome" value={name}/>
                        <SumRow label="Empresa" value={company}/>
                        <SumRow label="E-mail" value={email}/>
                        <SumRow label="Operação" value={operation}/>
                        <SumRow label="Porto" value={port}/>
                        <SumRow label="Tipo de carga" value={cargoMode==="conteiner"?`Contêiner — ${containerType}`:`Carga solta — ${packaging}`}/>
                        {cargoMode==="solta"&&(()=>{
                          const q=parseFloat(qtdVolumes)||0,c=parseFloat(comprimento)||0,l=parseFloat(largura)||0,a=parseFloat(altura)||0;
                          const m3=q&&c&&l&&a?(q*c*l*a/1_000_000).toLocaleString("pt-BR",{minimumFractionDigits:3,maximumFractionDigits:3})+" m³":"—";
                          return<><SumRow label="Qtd. volumes" value={qtdVolumes}/><SumRow label="Dimensões (cm)" value={[comprimento,largura,altura].filter(Boolean).join(" × ")||"—"}/><SumRow label="Cubagem total" value={m3}/></>;
                        })()}
                        <SumRow label="Peso" value={weight?`${weight} kg`:""}/>
                        <SumRow label="Mercadoria" value={mercType}/>
                        <SumRow label="Valor aprox." value={mercValue?`R$ ${mercValue}`:""}/>
                        <SumRow label="Características" value={special.join(", ")||"Nenhuma"}/>
                        <SumRow label="Entrega" value={deliveryCity}/>
                        {cep&&<SumRow label="CEP" value={cep}/>}
                      </div>
                      <Btn full onClick={handleSubmit} disabled={sending}>{sending?"Enviando...":"Enviar solicitação"}</Btn>
                      {error&&<div style={{marginTop:14,padding:"12px 14px",borderRadius:10,background:"rgba(255,107,107,.1)",border:"1px solid rgba(255,107,107,.32)",color:"#FFB4B4",fontSize:12,lineHeight:1.5,textAlign:"center"}}>{error}</div>}
                      <div style={{display:"flex",justifyContent:"center",marginTop:14}}>
                        <button onClick={()=>setStep(4)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,fontFamily:"Montserrat"}}>← Editar dados</button>
                      </div>
                      <div style={{color:C.subtle,fontSize:10,marginTop:12,textAlign:"center"}}>Seus dados ficam protegidos. Sem spam, jamais.</div>
                    </div>}

                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"40px 65px",background:"#05060A",borderTop:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",alignItems:"center",color:C.subtle,fontSize:11}}>
        <div>
          <img src="/images/logo-white.png" alt="Transcomex" style={{width:130,opacity:.8}}/>
          <div style={{marginTop:12}}>© 2026 Transcomex Transporte e Logística Ltda.</div>
        </div>
        <div style={{display:"flex",gap:18,justifyContent:"center"}}>
          <span>Site Oficial</span><span>Fale Conosco</span><span>Política de Privacidade</span>
        </div>
        <div style={{textAlign:"right"}}>Itajaí/SC | (47) 3404-7200 | comercial@transcomexlog.com.br</div>
      </footer>

    </div>
  );
}
