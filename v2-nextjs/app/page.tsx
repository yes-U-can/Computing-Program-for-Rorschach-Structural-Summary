'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from '@/hooks/useTranslation';
import { useRorschachForm } from '@/hooks/useRorschachForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useToast } from '@/components/ui/Toast';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LanguageSelector from '@/components/layout/LanguageSelector';

import InputTable from '@/components/input/InputTable';
import MobileCard from '@/components/input/MobileCard';
import InfoTab from '@/components/info/InfoTab';
import UpperSection from '@/components/result/UpperSection';
import LowerSection from '@/components/result/LowerSection';
import SpecialIndices from '@/components/result/SpecialIndices';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

import { exportToCSV, exportSummaryToCSV } from '@/lib/csv';

import ChatWidget from '@/components/chat/ChatWidget';
import {
  CalculatorIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const { showToast } = useToast();
  const {
    responses,
    setResponses,
    result,
    isCalculating,
    showResult,
    calculate,
    reset,
    loadSampleData,
    loadData,
    backToInput,
    validResponseCount
  } = useRorschachForm();

  const handleAutoSave = useCallback(() => {
    showToast({
      type: 'info',
      title: t('toast.autoSaved.title'),
      message: t('toast.autoSaved.message')
    });
  }, [showToast, t]);

  const { load, hasSavedData, clear } = useAutoSave(responses, { onSave: handleAutoSave });

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upper' | 'lower' | 'special'>('lower');
  const [initialTab, setInitialTab] = useState<'scoring' | 'info'>('scoring');
  const [isMobile, setIsMobile] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState('');

  const handleRequestInterpretation = () => {
    if (!result?.data) return;
    const ls = result.data.lower_section;

    const summaryData = {
      "Core Section": {
        R: ls.R,
        Lambda: ls.Lambda,
        EB: ls.EB,
        EA: ls.EA,
        EBPer: ls.EBPer,
        eb: ls.eb,
        es: ls.es,
        D: ls.D,
        AdjD: ls.AdjD,
        AdjEs: ls.AdjEs,
      },
      "Ideation": {
        a_p: ls.a_p,
        Ma_Mp: ls.Ma_Mp,
        _2AB_Art_Ay: ls._2AB_Art_Ay,
        MOR: ls.MOR,
        Sum6: ls.Sum6,
        Lv2: ls.Lv2,
        WSum6: ls.WSum6_ideation,
        M_minus: ls.M_minus_ideation,
        Mnone: ls.Mnone,
      },
      "Affect": {
        FC_CF_C: ls.FC_CF_C,
        PureC: ls.PureC,
        SumC_WSumC: ls.SumC_WSumC,
        Afr: ls.Afr,
        S: ls.S_aff,
        Blends_R: ls.Blends_R,
        CP: ls.CP,
      },
      "Mediation": {
        XA_percent: ls.XA_percent,
        WDA_percent: ls.WDA_percent,
        X_minus_percent: ls.X_minus_percent,
        S_minus: ls.S_minus,
        P: ls.P,
        X_plus_percent: ls.X_plus_percent,
        Xu_percent: ls.Xu_percent,
      },
      "Processing": {
        Zf: ls.Zf,
        Zd: ls.Zd,
        W_D_Dd: ls.W_D_Dd,
        W_M: ls.W_M,
        PSV: ls.PSV,
        DQ_plus: ls.DQ_plus,
        DQ_v: ls.DQ_v,
      },
      "Interpersonal": {
        COP: ls.COP,
        AG: ls.AG,
        a_p: ls.a_p_inter,
        Food: ls.Food,
        SumT: ls.SumT_inter,
        HumanCont: ls.HumanCont,
        PureH: ls.PureH,
        PER: ls.PER,
        ISO_Index: ls.ISO_Index,
      },
      "Self-Perception": {
        _3r_2_R: ls._3r_2_R,
        Fr_rF: ls.Fr_rF,
        SumV: ls.SumV_self,
        FD: ls.FD,
        An_Xy: ls.An_Xy,
        MOR: ls.MOR_self,
        H_ratio: ls.H_ratio,
      },
      "Special Indices": result.data.special_indices
    };

    const message = `Please provide a psychological interpretation based on the following Rorschach structural summary data:\n\n\`\`\`json\n${JSON.stringify(summaryData, null, 2)}\n\`\`\``;
    
    setInitialChatMessage(message);
    setShowChatWidget(true);
  };

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show welcome modal on first load OR if there's saved data to restore
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('rorschach_welcome_seen');
    const hasSaved = hasSavedData();

    // Always show modal if there's saved data (so user can choose to restore)
    // Or show on first visit
    if (!hasSeenWelcome || hasSaved) {
      const timer = window.setTimeout(() => setShowWelcomeModal(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, [hasSavedData]);

  // Handle welcome modal actions
  const handleNewStart = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('rorschach_welcome_seen', 'true');
  };

  const handleLoadSample = () => {
    loadSampleData();
    setShowWelcomeModal(false);
    sessionStorage.setItem('rorschach_welcome_seen', 'true');
  };

  const handleLoadSaved = () => {
    const savedData = load();
    if (savedData) {
      loadData(savedData);
    }
    setShowWelcomeModal(false);
    sessionStorage.setItem('rorschach_welcome_seen', 'true');
  };

  // Handle reset
  const handleReset = () => {
    reset();
    clear();
    setShowResetModal(false);
    showToast({
      type: 'success',
      title: t('toast.resetComplete.title'),
      message: t('toast.resetComplete.message')
    });
  };

  // Handle calculate
  const handleCalculate = () => {
    if (validResponseCount < 14) {
      showToast({
        type: 'warning',
        title: t('toast.validity.title'),
        message: t('toast.validity.message')
      });
    }
    calculate();
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle CSV export
  const handleExportRawData = () => {
    exportToCSV(responses);
  };

  // Scroll to results when they are shown
  useEffect(() => {
    if (showResult) {
      const resultsContainer = document.getElementById('results-container');
      if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [showResult]);

  const handleExportSummary = () => {
    if (result?.data) {
      exportSummaryToCSV(result.data);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#f9f9f9]">
      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {!showResult ? (
            // Input Section
            <div className="space-y-6">
              {/* Initial Tab Navigation */}
              <div className="print:hidden overflow-x-auto">
                <div className="inline-flex min-w-max bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                  <button
                    onClick={() => setInitialTab('scoring')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                      initialTab === 'scoring'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {t('nav.scoring')}
                  </button>
                  <button
                    onClick={() => setInitialTab('info')}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                      initialTab === 'info'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {t('nav.more')}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {initialTab === 'scoring' ? (
                <>
                  {/* Input Table */}
                  <div className="print:hidden">
                    {isMobile ? (
                      <MobileCard
                        responses={responses}
                        onChange={setResponses}
                      />
                    ) : (
                      <InputTable
                        responses={responses}
                        onChange={setResponses}
                      />
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 print:hidden">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCalculate}
                      disabled={isCalculating || validResponseCount === 0}
                    >
                      {isCalculating ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                          {t('loader.calculating')}
                        </>
                      ) : (
                        <>
                          <CalculatorIcon className="w-5 h-5 mr-2" />
                          {t('buttons.calculate')}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setShowResetModal(true)}
                    >
                      <ArrowPathIcon className="w-5 h-5 mr-2" />
                      {t('buttons.reset')}
                    </Button>
                  </div>
                </>
              ) : (
                /* Info Tab Content */
                <InfoTab />
              )}
            </div>
          ) : (
            // Result Section
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden overflow-x-auto pb-1">
                <Button variant="secondary" onClick={backToInput}>
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  {t('buttons.backToInput')}
                </Button>
                <Button variant="secondary" onClick={handleExportRawData}>
                  <TableCellsIcon className="w-4 h-4 mr-2" />
                  {t('buttons.rawData')}
                </Button>
                <Button variant="secondary" onClick={handleExportSummary}>
                  <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                  {t('buttons.summary')}
                </Button>
                <Button variant="secondary" onClick={handlePrint}>
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  {t('buttons.print')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleRequestInterpretation}
                  disabled={!session || !session.user || !session.user.hasSavedApiKeys}
                  title={
                    !session || !session.user 
                      ? t('nav.loginRequired') 
                      : !session.user.hasSavedApiKeys 
                        ? t('account.apiKeys.setupRequired') 
                        : t('buttons.aiInterpret')
                  }
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {t('buttons.aiInterpret')}
                </Button>
              </div>

              {/* Result Tabs */}
              <div className="print:hidden overflow-x-auto">
                <div className="inline-flex min-w-max bg-white p-1 rounded-lg shadow-sm border border-slate-200">
                  {(['upper', 'lower', 'special'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {t(`result.tabs.${tab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Content */}
              {result?.success && result.data && (
                <div id="results-container">
                  <div className={activeTab === 'upper' ? '' : 'hidden print:block'}>
                    <UpperSection data={result.data.upper_section} />
                  </div>
                  <div className={activeTab === 'lower' ? '' : 'hidden print:block'}>
                    <LowerSection data={result.data.lower_section} specialIndices={result.data.special_indices} />
                  </div>
                  <div className={activeTab === 'special' ? '' : 'hidden print:block'}>
                    <SpecialIndices data={result.data.special_indices} />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {result && !result.success && result.errors && (
                <Card variant="glass" padding="lg" className="max-w-lg mx-auto text-center">
                  <div className="text-red-500 mb-4">
                    <ExclamationTriangleIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Calculation Error
                  </h3>
                  <p className="text-slate-600">
                    {result.errors.map(e => e.message).join('\n')}
                  </p>
                </Card>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* AI Chat Widget and Button */}
      <ChatWidget
        isOpen={showChatWidget}
        onClose={() => {
          setShowChatWidget(false);
          setInitialChatMessage('');
        }}
        initialMessage={initialChatMessage}
      />

      {!showChatWidget && (
        <button
          onClick={() => setShowChatWidget(true)}
          disabled={!session}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-sky-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-sky-700 transition-colors z-40 disabled:bg-slate-300 disabled:cursor-not-allowed"
          aria-label="Open AI Chat"
          title={!session ? t('nav.loginRequired') : t('buttons.aiChat')}
        >
          <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Welcome Modal */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        size="md"
      >
        <div className="space-y-4">
          {/* Language Selector - icon buttons */}
          <div className="flex justify-center mb-2">
            <LanguageSelector />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNewStart}
              className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <span className="font-semibold text-slate-800">{t('modal.welcome.new')}</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <span className="font-semibold text-slate-800">{t('modal.welcome.loadSample')}</span>
            </button>

            {hasSavedData() && (
              <button
                onClick={handleLoadSaved}
                className="w-full px-4 py-3 text-left rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <span className="font-semibold text-purple-800">{t('modal.welcome.loadSaved')}</span>
                <span className="block text-sm text-purple-600 mt-1">{t('modal.welcome.continueMsg')}</span>
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={t('modal.reset.title')}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">{t('modal.reset.message')}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowResetModal(false)}>
              {t('buttons.no')}
            </Button>
            <Button variant="danger" onClick={handleReset}>
              {t('buttons.yes')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Interpretation Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title={t('modal.ai.title')}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-slate-600">{t('modal.ai.message')}</p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowAIModal(false)}>
              {t('modal.ai.cancel')}
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                window.open('https://gemini.google.com/share/e73a8ac57bf2', '_blank');
                setShowAIModal(false);
              }}
            >
              {t('modal.ai.open')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
