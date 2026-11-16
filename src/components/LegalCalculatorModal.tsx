import React, { useState } from 'react';
import { X, Calculator, ArrowUpRight } from 'lucide-react';

interface LegalCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToArticle: (systemId: string, articleId: string) => void;
}

export const LegalCalculatorModal: React.FC<LegalCalculatorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToArticle
}) => {
  const [activeTab, setActiveTab] = useState<'m84' | 'm77' | 'm94'>('m84');

  // M84 State (End of Service)
  const [m84Salary, setM84Salary] = useState<number>(10000);
  const [m84Years, setM84Years] = useState<number>(5);
  const [m84Reason, setM84Reason] = useState<'employer_end' | 'resignation'>('employer_end');

  // M77 State (Termination Compensation)
  const [m77ContractType, setM77ContractType] = useState<'fixed' | 'indefinite'>('fixed');
  const [m77Salary, setM77Salary] = useState<number>(10000);
  const [m77RemainingMonths, setM77RemainingMonths] = useState<number>(6);
  const [m77YearsOfService, setM77YearsOfService] = useState<number>(4);

  // M94 State (Deposit / Arboun)
  const [m94ArbounAmount, setM94ArbounAmount] = useState<number>(5000);
  const [m94BreachingParty, setM94BreachingParty] = useState<'buyer' | 'seller'>('seller');

  if (!isOpen) return null;

  // Calculate M84 Gratuity
  const calculateM84 = () => {
    const firstFiveYears = Math.min(m84Years, 5);
    const afterFiveYears = Math.max(0, m84Years - 5);
    const fullGratuity = (firstFiveYears * 0.5 * m84Salary) + (afterFiveYears * 1.0 * m84Salary);

    let payableRatio = 1.0;
    let explanationRatio = 'استحقاق كامل المكافأة بنسبة 100%';

    if (m84Reason === 'resignation') {
      if (m84Years < 2) {
        payableRatio = 0;
        explanationRatio = 'الخدمة أقل من سنتين: لا يستحق مكافأة عند الاستقالة';
      } else if (m84Years <= 5) {
        payableRatio = 1 / 3;
        explanationRatio = 'الخدمة بين سنتين إلى 5 سنوات: يستحق ثلث المكافأة (33.3%)';
      } else if (m84Years < 10) {
        payableRatio = 2 / 3;
        explanationRatio = 'الخدمة بين 5 إلى أقل من 10 سنوات: يستحق ثلثي المكافأة (66.7%)';
      } else {
        payableRatio = 1.0;
        explanationRatio = 'الخدمة 10 سنوات فأكثر: يستحق كامل المكافأة (100%)';
      }
    }

    const finalGratuity = Math.round(fullGratuity * payableRatio);
    return { fullGratuity, finalGratuity, explanationRatio };
  };

  // Calculate M77 Compensation
  const calculateM77 = () => {
    const minCompensation = m77Salary * 2;
    let rawCompensation = 0;
    if (m77ContractType === 'fixed') {
      rawCompensation = m77Salary * m77RemainingMonths;
    } else {
      rawCompensation = (m77Salary * 0.5) * m77YearsOfService;
    }
    const finalCompensation = Math.max(rawCompensation, minCompensation);
    const appliedMinimum = rawCompensation < minCompensation;
    return { finalCompensation, rawCompensation, minCompensation, appliedMinimum };
  };

  // Calculate M94 Arboun
  const calculateM94 = () => {
    if (m94BreachingParty === 'buyer') {
      return {
        result: 'يخسر دافع العربون (المشتري) مبلغه لصالح الطرف الآخر',
        amount: m94ArbounAmount
      };
    }
    return {
      result: 'يلتزم قابض العربون (البائع) برده ودفع مثله (ضعف العربون)',
      amount: m94ArbounAmount * 2
    };
  };

  const m84Res = calculateM84();
  const m77Res = calculateM77();
  const m94Res = calculateM94();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-['Thmanyah_Sans',sans-serif]">
      {/* Modal Card - Exact Thmanyah aesthetic */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-[#18181b] rounded-3xl p-6 sm:p-9 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Close Button at Corner */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-1.5 text-neutral-500 hover:text-black dark:hover:text-white transition cursor-pointer bg-transparent border-0"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Large Thmanyah Wordmark */}
        <div className="pt-1">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
            قانون 01
          </span>
        </div>

        {/* 2. Direct Question & Subtitle */}
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-white tracking-tight">
            حاسبــــة الحقــــوق
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed">
            احتساب فوري دقيق للحقوق العمالية وفق مواد نظام العمل السعودي
          </p>
        </div>

        {/* 3. Minimalist Tab Selector (Pure Text, no heavy rectangles) */}
        <div className="flex items-center justify-center gap-4 text-xs pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('m84')}
            className={`transition cursor-pointer bg-transparent border-0 p-0 font-bold ${
              activeTab === 'm84'
                ? 'text-black dark:text-white underline underline-offset-8 decoration-2'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            نهايــــة الخدمــــة (م 84)
          </button>
          
          <span className="text-neutral-300 dark:text-neutral-700">·</span>

          <button
            type="button"
            onClick={() => setActiveTab('m77')}
            className={`transition cursor-pointer bg-transparent border-0 p-0 font-bold ${
              activeTab === 'm77'
                ? 'text-black dark:text-white underline underline-offset-8 decoration-2'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            تعويــــض الفصــــل (م 77)
          </button>

          <span className="text-neutral-300 dark:text-neutral-700">·</span>

          <button
            type="button"
            onClick={() => setActiveTab('m94')}
            className={`transition cursor-pointer bg-transparent border-0 p-0 font-bold ${
              activeTab === 'm94'
                ? 'text-black dark:text-white underline underline-offset-8 decoration-2'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
            }`}
          >
            العربــــون (م 94)
          </button>
        </div>

        {/* 4. Form Inputs (Exact Thmanyah input style) */}
        <div className="w-full space-y-3 pt-1 text-right">
          
          {/* TAB 1: مكافأة نهاية الخدمة (المادة 84) */}
          {activeTab === 'm84' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  آخر راتب شهري فعلي شامل (ريال)
                </label>
                <input
                  type="number"
                  value={m84Salary}
                  onChange={(e) => setM84Salary(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="مثال: 10000"
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  مدة الخدمة بالسنوات
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={m84Years}
                  onChange={(e) => setM84Years(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="مثال: 5"
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  سبب انتهاء العلاقة العمالية
                </label>
                <select
                  value={m84Reason}
                  onChange={(e) => setM84Reason(e.target.value as any)}
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center cursor-pointer"
                >
                  <option value="employer_end">إنهاء العقد من المنشأة / انتهاء مدة العقد</option>
                  <option value="resignation">استقالة برغبة العامل (المادة 85)</option>
                </select>
              </div>

              {/* Result Preview in Thmanyah Style */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl text-center space-y-1">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  المكافأة النظامية المستحقة
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                  {m84Res.finalGratuity.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-neutral-500">ريال سعودي</span>
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                  {m84Res.explanationRatio}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: تعويض الفصل وإنهاء العقد (المادة 77) */}
          {activeTab === 'm77' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  نوع عقد العمل
                </label>
                <select
                  value={m77ContractType}
                  onChange={(e) => setM77ContractType(e.target.value as any)}
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center cursor-pointer"
                >
                  <option value="fixed">محدد المدة (سنة، سنتين، مدة معينة)</option>
                  <option value="indefinite">غير محدد المدة (عقد مفتوح للسعوديين)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  الراتب الشهري الفعلي الشامل (ريال)
                </label>
                <input
                  type="number"
                  value={m77Salary}
                  onChange={(e) => setM77Salary(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="مثال: 10000"
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                />
              </div>

              {m77ContractType === 'fixed' ? (
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    عدد الشهور المتبقية من مدة العقد
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={m77RemainingMonths}
                    onChange={(e) => setM77RemainingMonths(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                    سنوات الخدمة في المنشأة
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={m77YearsOfService}
                    onChange={(e) => setM77YearsOfService(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                  />
                </div>
              )}

              {/* Result Preview */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl text-center space-y-1">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  التعويض النظامي المستحق عن الإنهاء
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                  {m77Res.finalCompensation.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-neutral-500">ريال سعودي</span>
                </div>
                {m77Res.appliedMinimum && (
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 pt-0.5">
                    طُبّق الحد الأدنى الإلزامي نظاماً (أجر شهرين = {m77Res.minCompensation.toLocaleString()} ريال)
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 3: العربون (المادة 94) */}
          {activeTab === 'm94' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  مبلغ العربون المدفوع (ريال)
                </label>
                <input
                  type="number"
                  value={m94ArbounAmount}
                  onChange={(e) => setM94ArbounAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="مثال: 5000"
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                  الطرف الذي عدل عن إتمام العقد
                </label>
                <select
                  value={m94BreachingParty}
                  onChange={(e) => setM94BreachingParty(e.target.value as any)}
                  className="w-full h-12 px-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition text-center cursor-pointer"
                >
                  <option value="seller">البائع (قابض العربون عدل عن البيع)</option>
                  <option value="buyer">المشتري (دافع العربون عدل عن الشراء)</option>
                </select>
              </div>

              {/* Result Preview */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl text-center space-y-1">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  المبلغ والالتزام النظامي
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
                  {m94Res.amount.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-neutral-500">ريال سعودي</span>
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-300 pt-0.5">
                  {m94Res.result}
                </div>
              </div>
            </>
          )}

        </div>

        {/* 5. Solid Black Thmanyah Primary Action Button */}
        <button
          onClick={() => {
            if (activeTab === 'm84') {
              onNavigateToArticle('labor', 'labor-m84');
            } else if (activeTab === 'm77') {
              onNavigateToArticle('labor', 'labor-m77');
            } else {
              onNavigateToArticle('civil', 'civil-m94');
            }
            onClose();
          }}
          className="w-full h-12 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 rounded-xl font-bold text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <span>استعراض المادة وشرحها في النظام</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
