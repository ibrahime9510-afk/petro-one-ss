import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Fuel, 
  MapPin, 
  Activity, 
  HardHat, 
  CheckCircle2, 
  Globe, 
  Map as MapIcon,
  ChevronRight,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { translations } from "./constants";
import { Station, Language } from "./types";
import { cn } from "@/lib/utils";

const userEmail = "petroone2650@gmail.com";

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];

  const [stations, setStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState<Partial<Station>>({
    name: "",
    owner: "",
    contractType: "",
    lat: "",
    lng: "",
    status: "construction",
    progress: 0,
    license: "",
  });

  // Derived stats
  const stats = useMemo(() => {
    const active = stations.filter(s => s.status === "active");
    const construction = stations.filter(s => s.status === "construction");
    const avgProgress = construction.length > 0 
      ? Math.round(construction.reduce((acc, curr) => acc + curr.progress, 0) / construction.length) 
      : 0;

    return {
      total: stations.length,
      active: active.length,
      construction: construction.length,
      avgProgress
    };
  }, [stations]);

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.owner) return;

    const newStation: Station = {
      ...form as Station,
      id: crypto.randomUUID(),
      status: (form.progress || 0) >= 100 ? "active" : "construction",
      updatedAt: new Date().toISOString(),
    };

    setStations(prev => [newStation, ...prev]);
    setForm({ 
      name: "", owner: "", contractType: "", lat: "", lng: "", 
      status: "construction", progress: 0, license: "" 
    });
  };

  return (
    <div className={cn("flex min-h-screen bg-[#f1f5f9] text-[#1e293b] font-sans h-screen overflow-hidden", lang === 'ar' ? 'font-arabic flex-row-reverse' : 'flex-row')} dir={t.dir}>
      {/* Sidebar - Fixed Width Column */}
      <aside className={cn(
        "w-[320px] bg-white border-[#e2e8f0] h-screen p-6 flex flex-col shrink-0 overflow-y-auto",
        lang === 'en' ? 'border-r' : 'border-l'
      )}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#15803d] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
            P
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[#15803d] leading-none uppercase">Petro One</h1>
        </div>

        <div className="space-y-6">
          <header>
            <h3 className="text-xs font-semibold text-[#64748b] tracking-wider uppercase">{t.addStation}</h3>
          </header>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.stationName}</Label>
              <Input 
                className="h-9 text-sm border-[#cbd5e1] rounded-md focus-visible:ring-[#15803d]" 
                placeholder="e.g. Riyadh Central 04"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.ownerOperator}</Label>
              <Input 
                className="h-9 text-sm border-[#cbd5e1] rounded-md" 
                placeholder="Al-Fahd Energy Co."
                value={form.owner} 
                onChange={e => setForm({...form, owner: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.latitude}</Label>
                <Input 
                  className="h-9 text-sm border-[#cbd5e1] rounded-md" 
                  placeholder="24.7136"
                  value={form.lat} 
                  onChange={e => setForm({...form, lat: e.target.value})} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.longitude}</Label>
                <Input 
                  className="h-9 text-sm border-[#cbd5e1] rounded-md" 
                  placeholder="46.6753"
                  value={form.lng} 
                  onChange={e => setForm({...form, lng: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.progress} (%)</Label>
              <Input 
                type="number" 
                className="h-9 text-sm border-[#cbd5e1] rounded-md" 
                value={form.progress} 
                onChange={e => setForm({...form, progress: Number(e.target.value)})} 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] font-semibold text-[#94a3b8] uppercase">{t.license}</Label>
              <Input 
                className="h-9 text-sm border-[#cbd5e1] rounded-md" 
                value={form.license} 
                onChange={e => setForm({...form, license: e.target.value})} 
              />
            </div>

            <Button onClick={handleAdd} className="w-full bg-[#15803d] hover:bg-[#166534] text-white rounded-lg h-10 font-semibold transition-colors mt-2">
              {t.save}
            </Button>
          </form>
        </div>

        <div className="mt-auto pt-6 border-t border-[#f1f5f9] text-[10px] text-[#94a3b8] text-center uppercase tracking-widest font-bold">
          Petro One Fuel Services v2.1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto h-screen">
        <header className="flex justify-between items-center bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h2 className="text-xl font-bold tracking-tight">{lang === 'en' ? 'Asset Dashboard' : 'لوحة الأصول'}</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input 
                placeholder={lang === 'en' ? "Search assets..." : "بحث في الأصول..."}
                className="h-10 pl-9 bg-[#f8fafc] border-[#e2e8f0]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="h-10 px-4 border-[#cbd5e1] text-[#64748b] hover:bg-slate-50 font-semibold transition-all"
              >
                {t.switchLang}
              </Button>
              <div className="w-10 h-10 rounded-full bg-[#e2e8f0] flex items-center justify-center font-bold text-[#475569] text-xs shadow-sm">
                PO
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
            <div className="text-[11px] text-[#64748b] font-bold uppercase tracking-widest">{t.totalStations}</div>
            <div className="text-3xl font-bold mt-2 tracking-tight">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
            <div className="text-[11px] text-[#166534] font-bold uppercase tracking-widest">{t.operating}</div>
            <div className="text-3xl font-bold mt-2 tracking-tight text-[#15803d]">{stats.active}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
            <div className="text-[11px] text-[#a16207] font-bold uppercase tracking-widest">{t.underConstruction}</div>
            <div className="text-3xl font-bold mt-2 tracking-tight text-[#a16207]">{stats.construction}</div>
          </div>
        </section>

        {/* Two Column Lists */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Construction List */}
          <Card className="rounded-xl border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col h-full bg-white">
            <div className="p-4 border-b border-[#f1f5f9] flex justify-between items-center bg-white">
              <h3 className="font-bold text-sm text-[#1e293b]">{t.listConstruction}</h3>
              <span className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider">{stats.construction} {lang === 'en' ? 'Active Sites' : 'مواقع في التنفيذ'}</span>
            </div>
            <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
              {filteredStations.filter(s => s.status === 'construction').map(station => (
                <div key={station.id} className="p-4 border border-[#f1f5f9] rounded-xl bg-[#fffdfa] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-[#1e293b]">{station.name}</span>
                    <span className="bg-[#fef9c3] text-[#854d0e] text-[11px] font-bold py-1 px-3 rounded-full uppercase">{station.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ca8a04]" style={{ width: `${station.progress}%` }} />
                  </div>
                  <p className="text-[11px] text-[#94a3b8] font-semibold uppercase tracking-wide">Owner: {station.owner}</p>
                </div>
              ))}
              {stats.construction === 0 && (
                 <div className="text-center py-10 text-[#94a3b8] text-xs font-bold uppercase tracking-widest italic">{t.noStations}</div>
              )}
            </div>
          </Card>

          {/* Operating Assets */}
          <Card className="rounded-xl border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col h-full bg-white">
            <div className="p-4 border-b border-[#f1f5f9] flex justify-between items-center bg-white">
              <h3 className="font-bold text-sm text-[#1e293b]">{t.listActive}</h3>
              <span className="text-[#64748b] text-[11px] font-bold uppercase tracking-wider">{stats.active} {lang === 'en' ? 'Online' : 'نشطة'}</span>
            </div>
            <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
              {filteredStations.filter(s => s.status === 'active').map(station => (
                <div key={station.id} className="p-4 border border-[#f1f5f9] rounded-xl flex items-center gap-4 bg-white hover:border-[#15803d]/30 transition-colors">
                  <div className="w-2.5 h-2.5 bg-[#22c55e] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)] shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-[#1e293b]">{station.name}</div>
                    <div className="text-[11px] text-[#94a3b8] font-bold uppercase mt-1">Licensed: {station.license || '#PT-XXX'} • {station.owner}</div>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-[#cbd5e1]", lang === 'ar' ? 'rotate-180' : '')} />
                </div>
              ))}
              {stats.active === 0 && (
                 <div className="text-center py-10 text-[#94a3b8] text-xs font-bold uppercase tracking-widest italic">{t.noStations}</div>
              )}
            </div>
          </Card>
        </section>

        {/* GIS Map Placeholder */}
        <section className="bg-[#f8fafc] border-2 border-dashed border-[#cbd5e1] rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-3 text-[#94a3b8]">
          <div className="text-sm">
            <strong className="text-[#475569]">GIS Map Interface (Under Integration)</strong><br/>
            Visualizing 42 fuel stations across the Kingdom with coordinate-mapped P markers.
          </div>
        </section>
      </main>
    </div>
  );
}
