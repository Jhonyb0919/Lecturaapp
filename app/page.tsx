"use client";

import { useMemo, useState } from "react";
import { Award, BookOpen, Brain, CheckCircle2, ClipboardList, Lock, MapPinned, Medal, Play, Search, Sparkles, Star, Trophy, Users } from "lucide-react";

type View = "home" | "levels" | "dashboard" | "map" | "mission" | "result" | "ranking" | "teacher";

const levels = [
  { id: 1, title: "Explorador Inicial", grades: "1.º y 2.º grado", difficulty: "Suave", words: "70-120 palabras", skills: ["vocabulario", "literal", "secuencia"] },
  { id: 2, title: "Detective Junior", grades: "3.º y 4.º grado", difficulty: "Media", words: "120-180 palabras", skills: ["vocabulario", "inferencia", "secuencia"] },
  { id: 3, title: "Investigador Avanzado", grades: "5.º y 6.º grado", difficulty: "Reto", words: "180-260 palabras", skills: ["inferencia", "literal", "argumentación"] },
];

const missions = [
  { title: "El misterio de la mochila perdida", status: "disponible", points: 160, time: "8 min", skill: "comprensión literal", difficulty: "Suave" },
  { title: "La pista del árbol de mango", status: "completada", points: 140, time: "7 min", skill: "secuencia", difficulty: "Suave" },
  { title: "El secreto de la biblioteca", status: "disponible", points: 180, time: "10 min", skill: "inferencia", difficulty: "Media" },
  { title: "El caso del perro desaparecido", status: "bloqueada", points: 200, time: "12 min", skill: "vocabulario", difficulty: "Media" },
  { title: "La carta escondida", status: "bloqueada", points: 220, time: "14 min", skill: "inferencia", difficulty: "Reto" },
];

const questions = [
  { question: "¿Dónde dejó Camila su mochila?", options: ["En la biblioteca", "Junto a la ventana", "En el patio", "En la dirección"], answer: "Junto a la ventana" },
  { question: "¿Qué significa 'pista' en la historia?", options: ["Una señal que ayuda a descubrir algo", "Un lugar para correr", "Una mochila nueva", "Un recreo largo"], answer: "Una señal que ayuda a descubrir algo" },
  { question: "¿Por qué Camila fue a la biblioteca?", options: ["Porque allí podía estar su mochila", "Porque quería leer un libro", "Porque tenía hambre", "Porque terminó la clase"], answer: "Porque allí podía estar su mochila" },
];

const students = [
  { rank: 1, name: "Ana", points: 850, badges: 5, missions: 8 },
  { rank: 2, name: "Luis", points: 790, badges: 4, missions: 7 },
  { rank: 3, name: "Sofía", points: 720, badges: 4, missions: 7 },
  { rank: 4, name: "Diego", points: 680, badges: 3, missions: 6 },
  { rank: 5, name: "Camila", points: 640, badges: 3, missions: 6 },
];

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [level, setLevel] = useState(levels[1]);
  const [read, setRead] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sequence, setSequence] = useState([
    "Camila llegó a la escuela.",
    "Notó que su mochila no estaba.",
    "Recordó que la dejó junto a la ventana.",
    "Diego vio una mochila cerca de la biblioteca.",
  ]);

  const score = useMemo(() => {
    const correct = questions.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0);
    const perfectSequence = sequence.join("|") === "Camila llegó a la escuela.|Notó que su mochila no estaba.|Recordó que la dejó junto a la ventana.|Diego vio una mochila cerca de la biblioteca.";
    const totalCorrect = correct + (perfectSequence ? 1 : 0);
    return { correct: totalCorrect, points: totalCorrect * 20 + 50 + (totalCorrect === 4 ? 30 : 0) + 25 + 40 };
  }, [answers, sequence]);

  const go = (next: View) => {
    if (next === "mission") {
      setRead(false);
      setAnswers({});
    }
    setView(next);
  };

  return (
    <main className="min-h-screen px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <Header view={view} go={go} />
        {view === "home" && <Landing go={go} />}
        {view === "levels" && <Levels setLevel={setLevel} go={go} />}
        {view === "dashboard" && <Dashboard level={level.title} go={go} />}
        {view === "map" && <MissionMap go={go} />}
        {view === "mission" && <Mission read={read} setRead={setRead} answers={answers} setAnswers={setAnswers} sequence={sequence} setSequence={setSequence} go={go} />}
        {view === "result" && <Result score={score} go={go} />}
        {view === "ranking" && <Ranking />}
        {view === "teacher" && <Teacher />}
      </div>
    </main>
  );
}

function Header({ view, go }: { view: View; go: (view: View) => void }) {
  const items: { label: string; view: View; icon: typeof Search }[] = [
    { label: "Inicio", view: "home", icon: Sparkles },
    { label: "Niveles", view: "levels", icon: ClipboardList },
    { label: "Misiones", view: "map", icon: MapPinned },
    { label: "Ranking", view: "ranking", icon: Trophy },
    { label: "Maestro", view: "teacher", icon: Users },
  ];
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-playful md:flex-row md:items-center md:justify-between">
      <button onClick={() => go("home")} className="flex items-center gap-3 text-left">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink text-white"><Search /></span>
        <span><span className="block text-xl font-black">Misión Lectura</span><span className="text-sm font-semibold text-slate-500">Lee, investiga y resuelve el caso.</span></span>
      </button>
      <nav className="flex flex-wrap gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return <button key={item.view} onClick={() => go(item.view)} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${view === item.view ? "bg-ink text-white" : "bg-slate-100 text-slate-600 hover:bg-white"}`}><Icon className="size-4" />{item.label}</button>;
        })}
      </nav>
    </header>
  );
}

function Landing({ go }: { go: (view: View) => void }) {
  return (
    <section className="grid min-h-[calc(100vh-140px)] items-center gap-8 overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-playful md:grid-cols-[1.05fr_0.95fr] md:p-10">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold"><Sparkles className="size-4 text-gold" /> Aventura lectora para Panamá</p>
        <h1 className="text-4xl font-black leading-tight sm:text-6xl">Misión Lectura</h1>
        <p className="mt-4 text-2xl font-extrabold text-gold">Lee, investiga y resuelve el caso.</p>
        <p className="mt-4 max-w-xl text-lg leading-8 text-blue-50">Misiones interactivas para mejorar comprensión lectora mientras compites con tus compañeros.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => go("levels")} className="rounded-full bg-gold px-6 py-3 font-black text-ink shadow-lg transition hover:-translate-y-1">Iniciar misión</button>
          <button onClick={() => go("ranking")} className="rounded-full bg-white/12 px-6 py-3 font-black text-white ring-1 ring-white/20 transition hover:-translate-y-1">Ver ranking</button>
        </div>
      </div>
      <div className="map-grid min-h-[420px] rounded-3xl bg-paper p-5 text-ink">
        <div className="grid h-full place-items-center rounded-3xl bg-white/70 p-6 text-center shadow-playful">
          <div>
            <div className="mx-auto grid size-28 place-items-center rounded-full bg-gold"><Search className="size-14" /></div>
            <h2 className="mt-6 text-3xl font-black">Mapa de pistas</h2>
            <p className="mt-2 font-bold text-slate-500">Libros, pistas, lupa, medallas y nuevos casos.</p>
            <div className="mt-6 grid grid-cols-5 gap-3">{[BookOpen, Star, Search, Medal, Lock].map((Icon, index) => <span key={index} className={`grid size-12 place-items-center rounded-full ${index < 4 ? "bg-sky text-white" : "bg-slate-200 text-slate-500"}`}><Icon className="size-5" /></span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Levels({ setLevel, go }: { setLevel: (level: typeof levels[number]) => void; go: (view: View) => void }) {
  return <Panel icon={ClipboardList} title="Elige tu nivel" subtitle="Cada nivel adapta historias, pistas y retos a tu grado."><div className="grid gap-4 md:grid-cols-3">{levels.map((item) => <button key={item.id} onClick={() => { setLevel(item); go("dashboard"); }} className="rounded-2xl border-2 border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-gold"><span className="rounded-full bg-sky/15 px-3 py-1 text-sm font-black text-sky">Nivel {item.id}</span><h3 className="mt-4 text-2xl font-black">{item.title}</h3><p className="font-bold text-slate-500">{item.grades}</p><p className="mt-4 text-sm"><b>Dificultad:</b> {item.difficulty}</p><p className="text-sm"><b>Historia:</b> {item.words}</p><div className="mt-4 flex flex-wrap gap-2">{item.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{skill}</span>)}</div></button>)}</div></Panel>;
}

function Dashboard({ level, go }: { level: string; go: (view: View) => void }) {
  const stats = [{ label: "Puntos", value: "850", icon: Star }, { label: "Medallas", value: "5", icon: Medal }, { label: "Misiones", value: "8", icon: CheckCircle2 }, { label: "Progreso", value: "76%", icon: Sparkles }];
  return <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]"><div className="rounded-3xl bg-white/90 p-6 shadow-playful"><p className="font-bold text-slate-500">Estudiante</p><h2 className="text-4xl font-black">Ana</h2><p className="mt-1 font-bold text-sky">Nivel actual: {level}</p><div className="mt-6 grid gap-4 sm:grid-cols-2">{stats.map((stat) => { const Icon = stat.icon; return <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5"><Icon className="size-7 text-gold" /><p className="mt-3 text-3xl font-black">{stat.value}</p><p className="font-bold text-slate-500">{stat.label}</p></div>; })}</div><button onClick={() => go("mission")} className="mt-6 rounded-full bg-ink px-5 py-3 font-black text-white"><span className="inline-flex items-center gap-2">Continuar misión <Play className="size-4" /></span></button></div><div className="rounded-3xl bg-ink p-6 text-white shadow-playful"><h3 className="text-2xl font-black">Medallas de Ana</h3>{["Detective de Pistas", "Lector Constante", "Mente Inferente", "Caso Perfecto"].map((badge) => <div key={badge} className="mt-3 rounded-2xl bg-white/10 p-4 font-black">🏅 {badge}</div>)}</div></section>;
}

function MissionMap({ go }: { go: (view: View) => void }) {
  return <Panel icon={MapPinned} title="Mapa de misiones" subtitle="Elige un caso disponible, reúne pistas y gana puntos."><div className="map-grid grid gap-4 rounded-3xl bg-paper p-4 md:grid-cols-2 xl:grid-cols-3">{missions.map((mission) => <article key={mission.title} className={`rounded-2xl bg-white p-5 shadow-sm ${mission.status === "bloqueada" ? "opacity-70" : "transition hover:-translate-y-1 hover:shadow-playful"}`}><div className="flex items-center justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-sky text-white"><Search /></span><span className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-black text-green-700">{mission.status}</span></div><h3 className="mt-4 text-xl font-black">{mission.title}</h3><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Info label="Puntos" value={String(mission.points)} /><Info label="Tiempo" value={mission.time} /><Info label="Habilidad" value={mission.skill} /><Info label="Dificultad" value={mission.difficulty} /></div><button disabled={mission.status === "bloqueada"} onClick={() => go("mission")} className="mt-5 w-full rounded-full bg-ink px-4 py-3 font-black text-white disabled:bg-slate-300">{mission.status === "bloqueada" ? "Misión bloqueada" : "Entrar al caso"}</button></article>)}</div></Panel>;
}

function Mission({ read, setRead, answers, setAnswers, sequence, setSequence, go }: { read: boolean; setRead: (v: boolean) => void; answers: Record<number, string>; setAnswers: (v: Record<number, string>) => void; sequence: string[]; setSequence: (v: string[]) => void; go: (view: View) => void }) {
  const move = (index: number, direction: -1 | 1) => { const next = [...sequence]; const to = index + direction; if (to < 0 || to >= next.length) return; [next[index], next[to]] = [next[to], next[index]]; setSequence(next); };
  return <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><article className="rounded-3xl bg-white/90 p-6 shadow-playful"><Title icon={Search} title="El misterio de la mochila perdida" subtitle="Lee con atención y marca las pistas importantes." /><div className="mt-5 rounded-3xl bg-paper p-5"><div className="mb-5 grid min-h-48 place-items-center rounded-2xl bg-gradient-to-br from-sky/20 via-gold/20 to-leaf/20"><BookOpen className="size-20 text-sky" /></div><p className="text-lg leading-9 text-slate-700">El lunes por la mañana, Camila llegó a la escuela y notó que su <mark className="rounded bg-gold/35 px-1 font-bold">mochila azul</mark> no estaba en el salón. Recordó que antes del recreo la dejó junto a la <mark className="rounded bg-leaf/25 px-1 font-bold">ventana</mark>. Su amigo Diego vio una mochila parecida cerca de la <mark className="rounded bg-sky/25 px-1 font-bold">biblioteca</mark>. Camila decidió seguir las <mark className="rounded bg-berry/20 px-1 font-bold">pistas</mark> para encontrarla.</p></div><button onClick={() => setRead(true)} className={`mt-5 w-full rounded-full px-5 py-3 font-black text-white ${read ? "bg-leaf" : "bg-ink"}`}>{read ? "Historia leída" : "Ya leí la historia"}</button></article><article className="rounded-3xl bg-white/90 p-6 shadow-playful"><Title icon={ClipboardList} title="Retos de comprensión" subtitle="Resuelve los retos para cerrar el caso." /><div className="mt-5 space-y-4">{questions.map((q, index) => <div key={q.question} className="rounded-2xl border border-slate-100 bg-white p-4"><p className="font-black">{q.question}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{q.options.map((option) => <button key={option} onClick={() => setAnswers({ ...answers, [index]: option })} className={`rounded-xl border px-3 py-3 text-left text-sm font-bold ${answers[index] === option ? "border-sky bg-sky/10 text-sky" : "border-slate-100 bg-slate-50 text-slate-600"}`}>{option}</button>)}</div></div>)}<div className="rounded-2xl border border-slate-100 bg-white p-4"><p className="font-black">Ordena los eventos</p>{sequence.map((item, index) => <div key={item} className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 p-3"><span className="grid size-8 place-items-center rounded-full bg-ink text-sm font-black text-white">{index + 1}</span><span className="flex-1 text-sm font-bold">{item}</span><button onClick={() => move(index, -1)} className="rounded-full bg-white px-3 py-1 font-black">↑</button><button onClick={() => move(index, 1)} className="rounded-full bg-white px-3 py-1 font-black">↓</button></div>)}</div></div><button disabled={!read} onClick={() => go("result")} className="mt-6 w-full rounded-full bg-gold px-5 py-3 font-black text-ink disabled:bg-slate-200 disabled:text-slate-500">Resolver caso</button></article></section>;
}

function Result({ score, go }: { score: { correct: number; points: number }; go: (view: View) => void }) {
  return <section className="rounded-3xl bg-white/90 p-6 text-center shadow-playful md:p-10"><div className="mx-auto grid size-24 place-items-center rounded-full bg-gold"><Trophy className="size-12" /></div><h2 className="mt-5 text-4xl font-black">¡Caso resuelto!</h2><p className="mx-auto mt-3 max-w-2xl text-lg font-bold text-slate-600">Ganaste {score.points} puntos y desbloqueaste la medalla Detective de Pistas.</p><div className="mt-6 grid gap-4 md:grid-cols-3"><Info label="Correctas" value={`${score.correct}/4`} /><Info label="Habilidades" value="Literal, inferencia, secuencia" /><Info label="Medalla" value="Detective de Pistas" /></div><p className="mt-6 rounded-2xl bg-leaf/10 p-4 font-black text-green-800">Cada misión te ayuda a comprender mejor.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={() => go("mission")} className="rounded-full bg-ink px-5 py-3 font-black text-white">Siguiente misión</button><button onClick={() => go("map")} className="rounded-full bg-slate-100 px-5 py-3 font-black">Volver al mapa</button><button onClick={() => go("ranking")} className="rounded-full bg-gold px-5 py-3 font-black text-ink">Ver ranking</button></div></section>;
}

function Ranking() {
  return <Panel icon={Trophy} title="Ranking de compañeros" subtitle="Compite leyendo, mejora aprendiendo."><div className="overflow-hidden rounded-2xl border border-slate-100 bg-white"><table className="w-full min-w-[620px] text-left"><thead className="bg-slate-50 text-sm text-slate-500"><tr><th className="p-4">Posición</th><th className="p-4">Nombre</th><th className="p-4">Puntos</th><th className="p-4">Medallas</th><th className="p-4">Misiones</th></tr></thead><tbody>{students.map((student) => <tr key={student.name} className="border-t border-slate-100"><td className="p-4 font-black">#{student.rank}</td><td className="p-4 font-black">{student.name}</td><td className="p-4 font-bold text-sky">{student.points}</td><td className="p-4">{student.badges}</td><td className="p-4">{student.missions}</td></tr>)}</tbody></table></div></Panel>;
}

function Teacher() {
  return <Panel icon={Users} title="Panel para maestro" subtitle="Vista rápida del avance lector del grupo."><div className="grid gap-4 lg:grid-cols-3"><div className="rounded-2xl bg-ink p-5 text-white"><p className="font-bold text-blue-100">Promedio de comprensión</p><p className="mt-3 text-5xl font-black">78%</p><Bar value={78} /></div><Box title="Mayor avance" items={["Ana", "Sofía", "Luis"]} /><Box title="Necesitan apoyo" items={["Mateo", "Valeria"]} /></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl bg-white p-5"><h3 className="font-black">Misiones más completadas</h3><Bar label="Mochila perdida" value={92} /><Bar label="Árbol de mango" value={84} /><Bar label="Biblioteca" value={71} /></div><div className="rounded-2xl bg-white p-5"><h3 className="font-black">Habilidades más débiles</h3><Bar label="Inferencia" value={54} /><Bar label="Secuencia" value={62} /><Bar label="Vocabulario" value={69} /></div></div></Panel>;
}

function Panel({ icon, title, subtitle, children }: { icon: typeof Search; title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-3xl bg-white/90 p-6 shadow-playful"><Title icon={icon} title={title} subtitle={subtitle} /><div className="mt-6">{children}</div></section>;
}

function Title({ icon: Icon, title, subtitle }: { icon: typeof Search; title: string; subtitle: string }) {
  return <div className="flex items-start gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-white"><Icon className="size-6" /></span><div><h2 className="text-2xl font-black md:text-3xl">{title}</h2><p className="mt-1 font-semibold text-slate-500">{subtitle}</p></div></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">{label}</p><p className="font-black">{value}</p></div>;
}

function Box({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-2xl bg-white p-5"><h3 className="font-black">{title}</h3><div className="mt-4 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-full bg-gold/20 px-3 py-2 text-sm font-black text-amber-700">{item}</span>)}</div></div>;
}

function Bar({ label, value }: { label?: string; value: number }) {
  return <div className="mt-4"><div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}%</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gold" style={{ width: `${value}%` }} /></div></div>;
}
