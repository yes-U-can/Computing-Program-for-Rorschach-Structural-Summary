/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPdf() {
  const resultsContainer = document.getElementById('results-container');
  if (!resultsContainer) {
    alert('결과가 없습니다. 먼저 계산을 완료해주세요.');
    return;
  }

  try {
    const originalStyles: { [key: string]: { element: HTMLElement; styles: { [key: string]: string } } } = {};
    
    const sections = ['Upper_Section', 'Lower_Section', 'Special_Indices'];
    const noPrintElements = document.querySelectorAll('.no-print');
    const resultsTab = document.getElementById('results-tab');
    
    noPrintElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      originalStyles[`no-print-${Date.now()}-${Math.random()}`] = {
        element: htmlEl,
        styles: { display: htmlEl.style.display }
      };
      htmlEl.style.display = 'none';
    });

    if (resultsTab) {
      originalStyles['results-tab'] = {
        element: resultsTab,
        styles: { display: resultsTab.style.display }
      };
      resultsTab.style.display = 'none';
    }

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        originalStyles[sectionId] = {
          element: section,
          styles: { display: section.style.display }
        };
        section.style.display = 'block';
      }
    });

    const responseList = document.getElementById('response-list-container');
    if (responseList) {
      originalStyles['response-list'] = {
        element: responseList,
        styles: { display: responseList.style.display }
      };
      responseList.style.display = 'block';
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(resultsContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: resultsContainer.scrollWidth,
      height: resultsContainer.scrollHeight,
      windowWidth: 210 * 3.779527559,
      windowHeight: 297 * 3.779527559,
    });

    Object.values(originalStyles).forEach(({ element, styles }) => {
      Object.entries(styles).forEach(([prop, value]) => {
        (element.style as any)[prop] = value;
      });
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 6;
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = pdfHeight - (margin * 2);
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = contentWidth / imgWidth;
    const imgScaledWidth = contentWidth;
    const imgScaledHeight = imgHeight * ratio;
    
    let heightLeft = imgScaledHeight;
    let position = margin;

    pdf.addImage(imgData, 'PNG', margin, position, imgScaledWidth, imgScaledHeight);
    heightLeft -= contentHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgScaledHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgScaledWidth, imgScaledHeight);
      heightLeft -= contentHeight;
    }

    const fileName = `rorschach_structural_summary_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('PDF export error:', error);
    alert('PDF 내보내기 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}
