import { BookOpen, Clock, Calendar, AlertTriangle, Award, GraduationCap, Shield } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import ProgressBar from '../components/ProgressBar';

export default function ExamHome() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center pt-8 md:pt-12 px-4">
      <div className="w-full max-w-3xl mb-6">
        
        {/* Blue Header Banner */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#0052D4] via-[#4364F7] to-[#6FB1FC] shadow-lg shadow-blue-900/20 mb-8 p-5 md:p-8 text-center border border-white/20">
          
          {/* Dot Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Side Ornaments (Simulated with SVG/Icons) */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center pt-2">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1.5 tracking-tight drop-shadow-md">
              វិទ្យាល័យអង្គរកា
            </h1>
            <h2 className="text-sm text-blue-100 mb-4 drop-shadow">
              ប្រឡងឆមាសលើកទី២ ឆ្នាំសិក្សា ២០២៣-២០២៤
            </h2>

            {/* Separator Line */}
            <div className="w-12 h-0.5 bg-white/50 rounded-full mb-4 mx-auto"></div>
            <div className="w-6 h-0.5 bg-white/30 rounded-full mb-6 mx-auto mt-[-12px]"></div>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-white mb-6">
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
                <span>វិញ្ញាសារ៖ <strong>IT</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-200" />
                <span>រយៈពេល៖ <strong>១ម៉ោង</strong></span>
              </div>
            </div>

            {/* Warning Alert Inside Header */}
            <div className="bg-red-500/20 border border-red-400/30 p-3 rounded-lg flex gap-3 text-left backdrop-blur-md shadow-sm relative overflow-hidden w-full max-w-2xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
              <div className="text-red-300 mt-0.5 ml-1">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-100 mb-1">បម្រាម និងការព្រមាន!</h3>
                <p className="text-sm text-red-100/90 leading-relaxed">
                  បម្រាម៖ ហាមចាកចេញពីផ្ទាំងប្រឡង (Switch Tabs) ឬប្តូរកម្មវិធី។ នោះវានឹងចាប់ ២ នាទី ដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            </div>
          </div>
        </div>

        <ProgressBar currentStep={1} totalSteps={2} />
      </div>

      <div className="w-full max-w-3xl mb-12">
        <StudentForm />
      </div>
    </div>
  );
}
