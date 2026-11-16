import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Briefcase,
  Building2,
  Scale,
  Users,
  ShieldAlert,
  Car,
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface LegalConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface CommonConsultation {
  id: string;
  category: string;
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  question: string;
  answerSummary: string;
  systemArticle: string;
  recommendedAction: string;
  jurisdiction: string;
}

const COMMON_CONSULTATIONS: CommonConsultation[] = [
  {
    id: 'c-1',
    category: 'labor',
    categoryLabel: 'نظام العمل',
    icon: Briefcase,
    iconColor: 'text-[#0284c7] dark:text-[#38bdf8]',
    title: 'فصل الموظف فجأة دون سبب مشروع',
    question: 'تم إنهاء خدماتي من الشركة فجأة بحجة إعادة هيكلة، ماذا يحق لي وما هي الخطوات النظامية؟',
    answerSummary: 'إذا لم يتضمن العقد تعويضاً محدداً، تستحق بموجب المادة 77 أجر 15 يوماً عن كل سنة خدمة (عقد غير محدد المدة) أو أجر باقي المدة (عقد محدد المدة) بشرط ألا يقل عن أجر شهرين، بالإضافة لكامل مكافأة نهاية الخدمة ورصيد الإجازات وشهادة الخدمة.',
    systemArticle: 'المادة 77 و84 و88 من نظام العمل السعودي',
    recommendedAction: 'تقديم دعوى تسوية ودية فوراً عبر بوابة «ودّي» خلال مهلة 12 شهراً كحد أقصى من تاريخ انتهاء العلاقة.',
    jurisdiction: 'التسوية الودية (وزارة الموارد البشرية) ثم المحكمة العمالية'
  },
  {
    id: 'c-2',
    category: 'commercial',
    categoryLabel: 'الشركات والتجارة',
    icon: Building2,
    iconColor: 'text-[#059669] dark:text-[#34d399]',
    title: 'نزاع بين الشركاء في شركة ذات مسؤولية محدودة',
    question: 'أحد الشركاء استأثر بالإدارة ويرفض إطلاعي على السجلات المالية أو توزيع الأرباح، كيف أتصرف؟',
    answerSummary: 'لكل شريك بموجب نظام الشركات حق الاطلاع على وثائق الشركة وحساباتها وتقارير مراجع الحسابات، ولا يجوز لمدير الشركة حجبها، كما يحق للشريك طلب عزل المدير أو رفع دعوى محاسبة في حال سوء الإدارة.',
    systemArticle: 'المواد 26 و29 و68 من نظام الشركات الجديد',
    recommendedAction: 'توجيه إنذار كتابي للمدير بطلب عقد الجمعية العامة للاطلاع على القوائم المالية، ثم اللجوء للقضاء التجاري.',
    jurisdiction: 'المحكمة التجارية المختصة'
  },
  {
    id: 'c-3',
    category: 'civil',
    categoryLabel: 'المعاملات المدنية',
    icon: Scale,
    iconColor: 'text-[#d97706] dark:text-[#fbbf24]',
    title: 'مماطلة المدين في سداد مبالغ مستحقة دون مبرر',
    question: 'سلّمت شخصاً بضاعة أو قدمت له خدمة ولديه إقرار استلام وفاتورة موقعة وماطل في السداد، ما هو الحل؟',
    answerSummary: 'بموجب نظام المعاملات المدنية، العقد شريعة المتعاقدين، ويلتزم المدين بالوفاء في الأجل المحدد. وإذا ثبت إخلاله ومماطلته، يحق للدائن المطالبة بأصل الدين والتعويض عن الضرر الفعلي المباشر المترتب على المماطلة.',
    systemArticle: 'المادة 128 و138 من نظام المعاملات المدنية',
    recommendedAction: 'إذا كانت الفاتورة أو السند مسجلة كسند لأمر في منصة «نافذ»، توجه فوراً لمحكمة التنفيذ، وإلا فارفع دعوى مطالبة مالية عبر «ناجز».',
    jurisdiction: 'محكمة التنفيذ (للسندات التنفيذية) أو المحكمة العامة'
  },
  {
    id: 'c-4',
    category: 'family',
    categoryLabel: 'الأحوال الشخصية',
    icon: Users,
    iconColor: 'text-[#8b5cf6] dark:text-[#a78bfa]',
    title: 'حضانة الأبناء والنفقة بعد الانفصال',
    question: 'ما هي ضوابط استحقاق حضانة الأطفال ونفقتهم بعد الطلاق، وهل الحضانة للأم تلقائياً؟',
    answerSummary: 'الأصل أن الحضانة للأم ما لم يثبت ما يمنع ذلك، وتكون مصلحة المحضون هي المعيار الحاكم دائماً. والنفقة على الأب واجبة شرعاً ونظاماً فور وقوع الانفصال، ولا تسقط نفقة الأبناء إلا بالأداء.',
    systemArticle: 'المواد 124 و127 و135 من نظام الأحوال الشخصية',
    recommendedAction: 'توثيق الحضانة والنفقة عبر منصة «تراضي» صلحاً للحصول على سند تنفيذي فوري دون جلسات محاكمة، أو رفع دعوى إلكترونية في «ناجز».',
    jurisdiction: 'منصة تراضي ثم محكمة الأحوال الشخصية'
  },
  {
    id: 'c-5',
    category: 'penal_cyber',
    categoryLabel: 'الجرائم والسلامة',
    icon: ShieldAlert,
    iconColor: 'text-[#dc2626] dark:text-[#f87171]',
    title: 'السب أو التشهير عبر منصات التواصل (واتساب أو تويتر/إكس)',
    question: 'شخص قام بشتمي أو التشهير بي في قروب واتساب أو تغريدة، كيف أحفظ حقي نظامياً؟',
    answerSummary: 'السب أو التشهير الإلكتروني عبر وسائل تقنية المعلومات يعد جريمة معلوماتية معاقباً عليها بالسجن مدة لا تزيد على سنة وبغرامة لا تزيد على 500,000 ريال، مع حقك الكامل في طلب التعويض بالحق الخاص.',
    systemArticle: 'المادة الثالثة (الفقرة 5) من نظام مكافحة جرائم المعلوماتية',
    recommendedAction: 'توثيق المحادثة أو التغريدة فوراً (تصوير شاشة ورابط الحساب) دون الرد بالمثل، وتقديم بلاغ رسمي عبر تطبيق «كلنا أمن».',
    jurisdiction: 'النيابة العامة ثم المحكمة الجزائية'
  },
  {
    id: 'c-6',
    category: 'judiciary',
    categoryLabel: 'نظام الإثبات والقضاء',
    icon: Scale,
    iconColor: 'text-[#6d1a24] dark:text-[#f87171]',
    title: 'إثبات الديون والمعاملات وحجية محادثات الواتساب',
    question: 'أقرضت شخصاً مبلغاً ولا يوجد بيننا عقد ورقي مختوم، لكن لدي رسائل واتساب يقر فيها باستلام المبلغ وموعد السداد، هل تكفي أمام القاضي؟',
    answerSummary: 'نعم بالتأكيد! بموجب المادتين 53 و54 من نظام الإثبات الجديد، المحررات الرقمية ورسائل الواتساب لها نفس الحجية القانونية للمحرر الكتابي الموقع. كما يلزم الانتباه للمادة 66 التي تمنع شهادة الشهود فوق 100 ألف ريال وتشترط الكتابة أو الدليل الرقمي.',
    systemArticle: 'المادتان 53 و66 من نظام الإثبات (مرسوم ملكي م/43)',
    recommendedAction: 'حفظ وتصدير سجل المحادثة كاملاً، والتأكد من توثيق رقم الجوال باسم المدعى عليه، ثم تقديم صحيفة دعوى مطالبة مالية عبر منصة «ناجز».',
    jurisdiction: 'المحكمة العامة المختصة أو المحكمة التجارية'
  }
];

export const LegalConsultationModal: React.FC<LegalConsultationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'instant' | 'official' | 'guide'>('instant');
  const [selectedConsultation, setSelectedConsultation] = useState<CommonConsultation | null>(COMMON_CONSULTATIONS[0]);
  
  // Custom query analyzer state
  const [queryCategory, setQueryCategory] = useState('labor');
  const [queryText, setQueryText] = useState('');
  const [analyzedResult, setAnalyzedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    // Simulate instant legal classification based on selected category & keywords
    let assessment = '';
    if (queryCategory === 'labor') {
      assessment = `التكييف المبدئي: نزاع عمالي يندرج تحت نظام العمل السعودي. الخطوة النظامية الأولى الإلزامية هي التقدم بطلب تسوية ودية عبر بوابة «ودّي» بوزارة الموارد البشرية. جهة الاختصاص بعد تعذر الصلح: المحكمة العمالية. احرص على حصر كافة المستندات (عقد العمل الموثق بقوى، مسيرات الرواتب، وإشعار إنهاء الخدمة).`;
    } else if (queryCategory === 'commercial') {
      assessment = `التكييف المبدئي: نزاع تجاري أو شراكة خاضع لنظام الشركات والأنظمة التجارية. يوصى بمراجعة عقد التأسيس وبنود التحكيم أو تسوية النزاعات، وتوجيه إخطار رسمي كتابي. جهة الاختصاص: المحكمة التجارية.`;
    } else if (queryCategory === 'civil') {
      assessment = `التكييف المبدئي: مطالبة مالية أو التزام عقدي بموجب نظام المعاملات المدنية ونظام الإثبات. تحقق أولاً من طبيعة السند (عقد موقع، فواتير، مراسلات). إذا كان لديك سند لأمر مسجل بنافذ يحال فوراً لمحكمة التنفيذ، وإلا يرفع عبر منصة ناجز بالمحكمة العامة.`;
    } else if (queryCategory === 'family') {
      assessment = `التكييف المبدئي: مسألة أحوال شخصية تخضع لنظام الأحوال الشخصية السعودي. يُنصح بشدة بالبدء عبر بوابة «تراضي» للوصول إلى محضر صلح تنفيذي دون الحاجة للمرافعات. جهة الاختصاص: محكمة الأحوال الشخصية.`;
    } else if (queryCategory === 'judiciary') {
      assessment = `التكييف المبدئي: مسألة قضائية وإثبات تخضع لنظام الإثبات ونظام المرافعات الشرعية. انتبه لشرط المادة 66 (منع شهادة الشهود فوق 100 ألف ريال) وحجية المحررات الرقمية ورسائل الواتساب وفق المادة 53. جهة الاختصاص: الدوائر القضائية المختصة عبر منصة ناجز.`;
    } else {
      assessment = `التكييف المبدئي: واقعة جزائية أو معلوماتية تتطلب توثيق الأدلة الرقمية وتقديم بلاغ لدى مركز الشرطة المختص أو عبر تطبيق «كلنا أمن». جهة التحقيق: النيابة العامة، وجهة الفصل: المحكمة الجزائية.`;
    }

    setAnalyzedResult(assessment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[var(--container-bg)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Headphones icon without background box */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--card-bg)]">
          <div className="flex items-center gap-2.5">
            <Headphones className="w-5 h-5 text-[#059669] dark:text-[#34d399] shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                الاستشارة والتوجيه العدلي
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                إرشادات نظامية وقنوات الترافع المعتمدة وفق الأنظمة السعودية
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition cursor-pointer bg-transparent border-0"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[var(--border-subtle)] px-4 bg-[var(--container-bg)] gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer bg-transparent border-0 ${
              activeTab === 'instant'
                ? 'border-[#059669] text-[#059669] dark:border-[#34d399] dark:text-[#34d399]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
            }`}
          >
            استشارات ومسائل شائعة
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer bg-transparent border-0 ${
              activeTab === 'guide'
                ? 'border-[#059669] text-[#059669] dark:border-[#34d399] dark:text-[#34d399]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
            }`}
          >
            تحليل مسألتك القانونية
          </button>
          <button
            onClick={() => setActiveTab('official')}
            className={`py-2.5 px-3 border-b-2 transition cursor-pointer bg-transparent border-0 ${
              activeTab === 'official'
                ? 'border-[#059669] text-[#059669] dark:border-[#34d399] dark:text-[#34d399]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]'
            }`}
          >
            المنصات العدلية الرسمية
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* TAB 1: مسارات واستشارات شائعة */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="text-[11px] text-[var(--text-secondary)] bg-[var(--card-bg)] p-3 rounded-xl border border-[var(--border-subtle)] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37] dark:text-[#facc15] shrink-0 mt-0.5" />
                <span>
                  اختر أحد الموضوعات القضائية الأكثر تكراراً للاطلاع على التكييف النظامي الفوري، والحلول الموصى بها والمحكمة المختصة:
                </span>
              </div>

              {/* Consultation Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_CONSULTATIONS.map((c) => {
                  const isSel = selectedConsultation?.id === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConsultation(c)}
                      className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5 border bg-transparent ${
                        isSel
                          ? 'border-[#059669] dark:border-[#34d399] text-[#059669] dark:text-[#34d399] font-bold'
                          : 'border-[var(--border-subtle)] text-[var(--text-main)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${c.iconColor}`} />
                      <span>{c.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Consultation Detailed Breakdown */}
              {selectedConsultation && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <selectedConsultation.icon className={`w-4 h-4 ${selectedConsultation.iconColor}`} />
                      <span className="font-bold text-sm text-[var(--text-main)]">
                        {selectedConsultation.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      {selectedConsultation.categoryLabel}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-[11px] text-[var(--text-secondary)] mb-1">
                      السؤال والواقعة:
                    </h5>
                    <p className="text-xs text-[var(--text-main)] leading-relaxed bg-[var(--container-bg)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                      {selectedConsultation.question}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-bold text-[11px] text-[#059669] dark:text-[#34d399] mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>الرأي النظامي الموجز:</span>
                    </h5>
                    <p className="text-xs text-[var(--text-main)] leading-relaxed">
                      {selectedConsultation.answerSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-subtle)] text-[11px]">
                    <div className="p-2 rounded-lg bg-[var(--container-bg)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] block font-medium">السند النظامي:</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedConsultation.systemArticle}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--container-bg)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-secondary)] block font-medium">الجهة القضائية المختصة:</span>
                      <span className="font-bold text-[var(--text-main)]">{selectedConsultation.jurisdiction}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#059669]/5 dark:bg-[#34d399]/10 border border-[#059669]/20 text-[11px] text-[var(--text-main)]">
                    <span className="font-bold text-[#059669] dark:text-[#34d399] block mb-0.5">الإجراء العملي الموصى به:</span>
                    <span>{selectedConsultation.recommendedAction}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: أداة تحليل المسألة القانونية المباشرة */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <form onSubmit={handleAnalyze} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    تصنيف المسألة أو المجال القضائي:
                  </label>
                  <select
                    value={queryCategory}
                    onChange={(e) => setQueryCategory(e.target.value)}
                    className="w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl py-2 px-3 text-xs text-[var(--text-main)] outline-none cursor-pointer"
                  >
                    <option value="labor">نظام العمل والتوظيف (فصل، رواتب، مكافأة نهاية الخدمة)</option>
                    <option value="judiciary">القضاء ونظام الإثبات (إثبات الديون، الواتساب، الشهود، اليمين)</option>
                    <option value="commercial">التجارة والشركات (عقود، نزاع شركاء، سجلات)</option>
                    <option value="civil">المعاملات المدنية (مماطلة مالية، إيجار، بيع، تعويض)</option>
                    <option value="family">الأحوال الشخصية (حضانة، نفقة، زيارة، تركات)</option>
                    <option value="penal">الجرائم المعلوماتية والسلامة المرورية (سب، احتيال، حوادث)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    صف وقائع مسألتك أو استفسارك باختصار:
                  </label>
                  <textarea
                    rows={4}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    placeholder="مثال: تم إبلاغي بإنهاء خدماتي بعد 3 سنوات دون إنذار مسبق، أو لم يتم سداد مبلغ الفاتورة المتفق عليها في الموعد..."
                    className="w-full bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none focus:border-[#059669] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!queryText.trim()}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#059669] hover:bg-[#047857] text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تحليل الموقف النظامي والتوجيه الإجرائي</span>
                </button>
              </form>

              {analyzedResult && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl p-4 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 text-[#059669] dark:text-[#34d399] font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>نتيجة التوجيه النظامي الأولي:</span>
                  </div>
                  <p className="text-xs text-[var(--text-main)] leading-relaxed">
                    {analyzedResult}
                  </p>
                  <div className="text-[10px] text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#d4af37]" />
                    <span>تنبيه: التوجيه استرشادي مبني على القواعد العامة للأنظمة، ولا يغني عن توكيل محامٍ مرخص للقضايا المعقدة.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: القنوات والمنصات العدلية الرسمية */}
          {activeTab === 'official' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-secondary)]">
                الجهات والقنوات الرسمية المعتمدة في المملكة العربية السعودية للتقاضي والصلح والاستفسارات العدلية:
              </p>

              <div className="space-y-2.5">
                
                {/* ناجز */}
                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Scale className="w-4 h-4 text-[#d4af37] dark:text-[#facc15] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-[var(--text-main)]">بوابة ناجز (وزارة العدل)</h5>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        رفع صحائف الدعوى الإلكترونية، محاكم التنفيذ، الوكالات وعقود الزواج والإنهاءات.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-[var(--container-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shrink-0">
                    najiz.sa
                  </span>
                </div>

                {/* تراضي */}
                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-[#34d399] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-[var(--text-main)]">منصة تراضي (مركز المصالحة)</h5>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        حل النزاعات ودياً عبر مصلحين معتمدين واعتماد محاضر الصلح كسندات تنفيذية دون رسوم.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-[var(--container-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shrink-0">
                    taradhi.moj.gov.sa
                  </span>
                </div>

                {/* مركز الاتصال 1950 */}
                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <PhoneCall className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-[var(--text-main)]">مركز الاتصال العدلي الموحد (1950)</h5>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        استفسارات الجلسات، مواعيد الدوائر القضائية ومتابعة المعاملات العدلية على مدار الساعة.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0284c7] dark:text-[#38bdf8] shrink-0">
                    1950
                  </span>
                </div>

                {/* التسوية الودية / ودي */}
                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Briefcase className="w-4 h-4 text-[#8b5cf6] dark:text-[#a78bfa] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs text-[var(--text-main)]">بوابة «ودّي» للتسوية العمالية</h5>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        المرحلة الأولى الإلزامية لنظر أي خلاف بين العامل وصاحب العمل قبل الإحالة للمحكمة العمالية.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-[var(--container-bg)] border border-[var(--border-subtle)] text-[var(--text-secondary)] shrink-0">
                    qiwa.sa
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--card-bg)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>قانون 01 • استشارات وتوجيه نظامي موثق</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--container-bg)] transition cursor-pointer bg-transparent"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
