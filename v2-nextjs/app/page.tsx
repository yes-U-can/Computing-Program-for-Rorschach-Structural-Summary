'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
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
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';

import { exportToCSV, exportSummaryToCSV, generateRawDataCsv, generateSummaryCsv } from '@/lib/csv';

import DraggableFab from '@/components/ui/DraggableFab';
import AdModal from '@/components/ads/AdModal';

// Lazy-loaded heavy components (only loaded when actually needed)
const UpperSection = lazy(() => import('@/components/result/UpperSection'));
const LowerSection = lazy(() => import('@/components/result/LowerSection'));
const SpecialIndices = lazy(() => import('@/components/result/SpecialIndices'));
const ChatWidget = lazy(() => import('@/components/chat/ChatWidget'));
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
  const { data: session, status } = useSession();
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

  const { load, hasSavedData, clear } = useAutoSave(responses);

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'upper' | 'lower' | 'special'>('upper');
  const [isMobile, setIsMobile] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState('');
  const [showAdModal, setShowAdModal] = useState(false);
  const [adModalKey, setAdModalKey] = useState(0);

  const buildInterpretationBootstrapPrompt = () => {
    if (!result?.data) return '';
    const rawCsv = generateRawDataCsv(responses);
    const summaryCsv = generateSummaryCsv(result.data);

    return [
      'You are assisting with interpretation of a Rorschach Structural Summary.',
      'Read both CSV datasets below and store them as the primary context for this chat session.',
      'Do not provide a full interpretation yet. Wait for follow-up clinical questions.',
      '',
      '[RAW_DATA_CSV]',
      '```csv',
      rawCsv,
      '```',
      '',
      '[STRUCTURAL_SUMMARY_CSV]',
      '```csv',
      summaryCsv,
      '```',
    ].join('\n');
  };

  const handleRequestInterpretation = () => {
    if (status !== 'authenticated' || !session?.user) {
      showToast({
        type: 'warning',
        title: t('toast.aiInterpretLogin.title'),
        message: t('toast.aiInterpretLogin.message'),
      });
      return;
    }

    if (!session.user.hasSavedApiKeys) {
      showToast({
        type: 'info',
        title: t('toast.aiInterpretApiKey.title'),
        message: t('toast.aiInterpretApiKey.message'),
      });
      return;
    }

    if (!result?.data) return;

    const bootstrapPrompt = buildInterpretationBootstrapPrompt();
    if (!bootstrapPrompt) return;

    setInitialChatMessage(bootstrapPrompt);
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
    if (isCalculating || status === 'loading') return;

    if (validResponseCount < 14) {
      showToast({
        type: 'warning',
        title: t('toast.validity.title'),
        message: t('toast.validity.message')
      });
      return;
    }

    // Non-logged-in users see ad modal first
    if (status !== 'authenticated') {
      setAdModalKey((prev) => prev + 1);
      setShowAdModal(true);
      return;
    }

    calculate();
  };

  // Called when ad modal countdown completes and user clicks continue
  const handleAdComplete = () => {
    setShowAdModal(false);
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
    <div className="min-h-screen relative bg-[#F7F9FB]">
      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {!showResult ? (
            // Input Section
            <div className="space-y-6">
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
                    disabled={isCalculating || validResponseCount === 0 || status === 'loading'}
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
                  variant="secondary" 
                  onClick={handleRequestInterpretation}
                  disabled={status !== 'authenticated'}
                  title={
                    status !== 'authenticated'
                      ? t('nav.loginRequired')
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
                      className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? 'bg-[var(--brand-700)] text-white shadow-sm'
                          : 'text-slate-600 hover:text-[var(--brand-700)] hover:bg-[#EEF3F7]'
                      }`}
                    >
                      {t(`result.tabs.${tab}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Content */}
              {result?.success && result.data && (
                <Suspense fallback={null}>
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
                </Suspense>
              )}

              {/* Error Message */}
              {result && !result.success && result.errors && (
                <Card variant="glass" padding="lg" className="max-w-lg mx-auto text-center">
                  <div className="text-red-500 mb-4">
                    <ExclamationTriangleIcon className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {t('errors.calculation')}
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
      {showChatWidget && (
        <Suspense fallback={null}>
          <ChatWidget
            isOpen={showChatWidget}
            onClose={() => {
              setShowChatWidget(false);
              setInitialChatMessage('');
            }}
            initialMessage={initialChatMessage}
          />
        </Suspense>
      )}

      {session && !showChatWidget && (
        <DraggableFab
          onClick={() => setShowChatWidget(true)}
          label={t('nav.aiAssistant')}
          className="border border-white/20 bg-gradient-to-br from-[var(--brand-700)] to-[var(--brand-500)] px-4 py-3 text-white shadow-[0_12px_30px_rgba(36,72,114,0.35)] transition-shadow hover:shadow-[0_16px_34px_rgba(36,72,114,0.45)]"
        >
          <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-sm font-semibold tracking-tight">{t('nav.aiAssistant')}</span>
        </DraggableFab>
      )}

      {/* Welcome Modal */}
      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        size="md"
        showCloseButton={false}
      >
        <div className="space-y-4">
          {/* Language Selector - icon buttons */}
          <div className="flex justify-center mb-5">
            <LanguageSelector />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleNewStart}
              className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-[var(--brand-200)] hover:bg-[var(--brand-200)]/20 transition-colors"
            >
              <span className="font-semibold text-slate-800">{t('modal.welcome.new')}</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="w-full px-4 py-3 text-left rounded-xl border border-slate-200 hover:border-[var(--brand-200)] hover:bg-[var(--brand-200)]/20 transition-colors"
            >
              <span className="font-semibold text-slate-800">{t('modal.welcome.loadSample')}</span>
            </button>

            {hasSavedData() && (
              <button
                onClick={handleLoadSaved}
                className="w-full px-4 py-3 text-left rounded-xl border border-[var(--brand-200)] bg-[var(--brand-200)]/20 hover:bg-[var(--brand-200)]/30 transition-colors"
              >
                <span className="font-semibold text-[var(--brand-700)]">{t('modal.welcome.loadSaved')}</span>
                <span className="block text-sm text-[var(--brand-700)] mt-1">{t('modal.welcome.continueMsg')}</span>
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Ad Modal (non-logged-in users) */}
      <AdModal key={adModalKey} isOpen={showAdModal} onComplete={handleAdComplete} />

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

    </div>
  );
}






