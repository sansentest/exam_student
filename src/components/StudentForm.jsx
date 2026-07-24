import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useExamStore from '../store/useExamStore';
import { User, Hash, GraduationCap, ArrowRight, UserCircle2, ChevronDown, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { studentData, classList, classPasswords } from '../data/students';

export default function StudentForm() {
  const navigate = useNavigate();
  const { setStudentInfo, startExam } = useExamStore();
  
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    className: '',
    studentCode: '',
    password: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [isNameOpen, setIsNameOpen] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Get students for selected class, and filter by nameSearch
  const studentsInClass = studentData.filter(s => s.className === formData.className);
  const filteredStudents = studentsInClass.filter(s => s.name.includes(nameSearch));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.className || !formData.name) {
      alert('សូមជ្រើសរើសថ្នាក់ និងឈ្មោះឱ្យបានត្រឹមត្រូវ!');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handleStartExam = (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('សូមបញ្ចូលលេខសំងាត់!');
      return;
    }
    
    // Verify password against class password
    const correctPassword = classPasswords[formData.className];
    if (formData.password !== correctPassword) {
      setError('លេខសំងាត់មិនត្រឹមត្រូវទេ! សូមព្យាយាមម្តងទៀត។');
      return;
    }
    
    setError('');
    setStudentInfo(formData);
    startExam(); 
    navigate('/section-2');
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="bg-white/90 backdrop-blur-2xl p-6 md:p-10 shadow-2xl shadow-blue-900/5 border border-white rounded-3xl relative overflow-hidden">
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"></div>

      <div className={`flex items-center gap-3 pb-4 border-b border-gray-100 ${currentStep === 1 ? 'mb-8' : 'mb-4'}`}>
        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
          {currentStep === 1 ? <UserCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {currentStep === 1 ? 'ព័ត៌មានបេក្ខជន' : 'លេខសំងាត់'}
        </h2>
      </div>
      
      {currentStep === 1 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <label className={labelClass}>ថ្នាក់រៀន <span className="text-red-500">*</span></label>
              <div className="relative group">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors w-5 h-5 z-10" />
                
                {/* Custom Dropdown Trigger */}
                <div 
                  onClick={() => setIsClassOpen(!isClassOpen)}
                  className={`${inputClass} flex items-center cursor-pointer select-none`}
                >
                  <span className={`flex-1 ${formData.className ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formData.className || "សូមជ្រើសរើសថ្នាក់"}
                  </span>
                </div>
                
                <ChevronDown 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 transition-transform duration-200 z-10 ${isClassOpen ? 'rotate-180 text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} 
                />

                {/* Custom Dropdown Menu */}
                {isClassOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsClassOpen(false)}></div>
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden z-20 max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                      {classList.length > 0 ? (
                        classList.map((cls) => (
                          <div 
                            key={cls}
                            onClick={() => { 
                              setFormData({...formData, className: cls, name: '', studentCode: '', gender: 'Male'}); 
                              setIsClassOpen(false); 
                              setNameSearch('');
                            }}
                            className={`px-11 py-3 cursor-pointer transition-colors flex items-center ${formData.className === cls ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            {cls}
                          </div>
                        ))
                      ) : (
                        <div className="px-11 py-3 text-gray-500 text-sm">មិនមានថ្នាក់រៀនទេ</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>ឈ្មោះសិស្ស <span className="text-red-500">*</span></label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5 z-10" />
                <input 
                  type="text" 
                  value={nameSearch || formData.name}
                  onChange={(e) => {
                    setNameSearch(e.target.value);
                    setIsNameOpen(true);
                  }}
                  onFocus={() => {
                    if (formData.className) setIsNameOpen(true);
                  }}
                  disabled={!formData.className}
                  className={`${inputClass} pr-10 ${!formData.className ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
                  placeholder={formData.className ? "ស្វែងរក ឬរើសឈ្មោះ..." : "សូមជ្រើសរើសថ្នាក់រៀនជាមុន"}
                  required
                  autoComplete="off"
                />
                <ChevronDown 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5 transition-transform duration-200 z-10 ${isNameOpen ? 'rotate-180 text-blue-500' : 'text-gray-400 group-hover:text-gray-600'} ${!formData.className ? 'opacity-50' : ''}`} 
                  onClick={() => { if(formData.className) setIsNameOpen(!isNameOpen); }}
                />

                {/* Students Dropdown */}
                {isNameOpen && formData.className && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNameOpen(false)}></div>
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl shadow-blue-900/10 border border-gray-100 overflow-hidden z-20 max-h-52 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div 
                            key={student.studentCode}
                            onClick={() => { 
                              setFormData({...formData, name: student.name, studentCode: student.studentCode, gender: student.gender}); 
                              setNameSearch('');
                              setIsNameOpen(false); 
                            }}
                            className={`px-11 py-2.5 cursor-pointer transition-colors flex items-center ${formData.name === student.name ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                          >
                            {student.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-11 py-3 text-gray-500 text-sm">មិនមានឈ្មោះនេះទេ</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className={labelClass}>លេខរៀង</label>
              <div className="relative group">
                 <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.studentCode}
                  readOnly
                  className={`${inputClass} bg-gray-100 text-gray-600 font-medium cursor-not-allowed`}
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>ភេទ</label>
              <div className="relative group">
                <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input 
                  type="text" 
                  value={formData.name ? (formData.gender === 'Male' ? 'ប្រុស' : 'ស្រី') : ''}
                  readOnly
                  className={`${inputClass} bg-gray-100 text-gray-600 font-medium cursor-not-allowed`}
                  placeholder="Auto-filled"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button 
              type="button" 
              onClick={handleNextStep}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              បន្ទាប់ <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-lg flex gap-3 text-left relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="text-red-500 mt-0.5 ml-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-red-700 leading-relaxed">
                បេក្ខជនឈ្មោះ <strong className="font-bold">{formData.name}</strong> សូមបញ្ចូលលេខសម្ងាត់ថ្នាក់ <strong className="font-bold">{formData.className}</strong>
              </p>
            </div>
          </div>

          <div className="mb-8 max-w-2xl mx-auto">
            <label className={labelClass}>លេខសម្ងាត់<span className="text-red-500">*</span></label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input 
                type="text" 
                name="secret_key"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if(error) setError('');
                }}
                className={inputClass}
                style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                placeholder="សូមបញ្ចូលលេខសម្ងាត់..."
                autoComplete="off"
                spellCheck="false"
                required
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartExam(e);
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <div className="mt-2 text-red-500 text-sm flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4 md:gap-0">
            <button 
              type="button" 
              onClick={() => setCurrentStep(1)}
              className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center text-sm md:text-base"
            >
              ត្រលប់ក្រោយ
            </button>
            <button 
              type="button" 
              onClick={handleStartExam}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              ចាប់ផ្តើមប្រឡង <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
