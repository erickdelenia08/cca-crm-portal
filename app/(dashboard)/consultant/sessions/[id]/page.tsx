"use client";

import Link from "next/link";
import {
  ChevronRight,
  GraduationCap,
  BadgeCheck,
  Mail,
  Phone,
  Clock,
  FileEdit,
  CalendarDays,
  ChevronDown,
  Paperclip,
  Save,
  History,
  Briefcase,
  MessageSquare,
  FileText
} from "lucide-react";

export default function SessionNotesPage() {
  return (
    <div className="flex-1 pb-20">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Breadcrumb */}
        <div className="flex items-center text-body-sm font-body-sm text-on-surface-variant gap-2">
          <Link href="/consultant" className="hover:text-secondary transition-colors">
            My Students
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-medium">Budi Santoso</span>
        </div>

        {/* Student Profile Banner */}
        <section className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
          {/* Subtle background pattern/gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface flex-shrink-0 shadow-sm relative z-10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSz1Vfk8kI5jVeaKJURM1sWgoLYD-FJcRxQJrgixmy1kly7iOvN5QjyR9CA1EvLQ0WLEbLUML_R2Y1RYgQe0RLg-xQOEhUIxmylKZrwLKiE4IxXLR4vEac34cT_z52JfhyVuS4OLUeubtly5MErtsgL27cbgCi9Yu7q9r8OYVRDmDAx-AZUO4i2Zn12mZoR9WL3laDlfjxaBEIYudweHHkjIt7wc70mCx_aje0uX8SN5oS1k8vBzGA-w"
              alt="Budi Santoso"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 z-10 space-y-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <h1 className="font-h1 text-h1 text-primary">Budi Santoso</h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-1 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Target: University of Indonesia - Computer Science
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success border border-success/20 font-label-md text-label-md">
                  <BadgeCheck className="w-4 h-4" />
                  Document Status: Verified
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2 border-t border-outline-variant/50">
              <a href="mailto:budi.santoso@example.com" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">
                <Mail className="w-4 h-4" /> budi.santoso@example.com
              </a>
              <a href="tel:+6281234567890" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" /> +62 812-3456-7890
              </a>
              <span className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Clock className="w-4 h-4" /> Last Session: Oct 12, 2023
              </span>
            </div>
          </div>
        </section>

        {/* Split Layout: Form & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Meeting Notes Form */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-secondary" />
              New Meeting Note
            </h2>
            <form className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">Date</label>
                  <div className="relative">
                    <CalendarDays className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-body-md text-body-md text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant block">Session Category</label>
                  <div className="relative">
                    <select className="w-full pl-3 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-body-md text-body-md text-primary appearance-none">
                      <option>Academic Tutoring</option>
                      <option>Career Consultation</option>
                      <option>Document Review</option>
                      <option>General Check-in</option>
                    </select>
                    <ChevronDown className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant block">Poin Utama Diskusi (Main Discussion Points)</label>
                <textarea
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-body-md text-body-md text-primary resize-y"
                  placeholder="Detail the main topics discussed during this session..."
                  rows={4}
                ></textarea>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant block">Rekomendasi & Action Plan Siswa (Recommendations)</label>
                <textarea
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-body-md text-body-md text-primary resize-y"
                  placeholder="What are the next steps for the student?"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex items-center justify-between border-t border-outline-variant/50 mt-4 pt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  <Paperclip className="w-5 h-5" /> Attach Files
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Save className="w-5 h-5" /> Simpan Catatan Sesi
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Interaction Timeline */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-secondary" /> Log Interaksi (History)
            </h2>
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant h-[600px] overflow-y-auto relative">
              {/* Timeline Line */}
              <div className="absolute left-[39px] top-6 bottom-6 w-px bg-outline-variant/50"></div>
              
              <div className="space-y-6 relative">
                {/* Timeline Item 1 */}
                <div className="relative pl-14 group">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-secondary-container text-secondary flex items-center justify-center border-4 border-surface-container-lowest z-10 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/50 group-hover:border-secondary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface-variant">Academic Tutoring</span>
                      <span className="font-mono-sm text-mono-sm text-on-surface-variant">Oct 12, 2023 • 14:00</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-primary mb-3">
                      Reviewed draft for personal statement. Suggested stronger opening paragraph focusing on early exposure to coding.
                    </p>
                    <button className="text-secondary font-label-sm text-label-sm flex items-center gap-1 hover:underline">
                      <FileText className="w-3.5 h-3.5" /> View Files (1)
                    </button>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative pl-14 group">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center border-4 border-surface-container-lowest z-10 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/50 group-hover:border-tertiary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface-variant">Career Consultation</span>
                      <span className="font-mono-sm text-mono-sm text-on-surface-variant">Sep 28, 2023 • 10:30</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-primary">
                      Discussed potential internships for Summer 2024. Student is leaning towards local tech startups rather than large enterprises.
                    </p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative pl-14 group">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center border-4 border-surface-container-lowest z-10 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/50 group-hover:border-outline-variant transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface-variant">General Check-in</span>
                      <span className="font-mono-sm text-mono-sm text-on-surface-variant">Sep 10, 2023 • 09:15</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-primary">
                      Initial onboarding session. Established communication preferences and mapped out key deadlines for the semester.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
