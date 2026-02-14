/* eslint-disable @typescript-eslint/no-explicit-any */
export function escapeCsvCell(cell: any): string {
  if (cell === null || cell === undefined) return '';
  let str = String(cell);
  str = str.replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    str = '"' + str + '"';
  }
  return str;
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateSummaryCsv(results: any): string {
  const headers: string[] = [];
  const values: string[] = [];

  if (results.upper_section) {
    Object.entries(results.upper_section).forEach(([key, value]) => {
      if (typeof value !== 'object' || value === null) {
        headers.push(key);
        values.push(escapeCsvCell(value));
      }
    });
  }

  if (results.lower_section) {
    Object.entries(results.lower_section).forEach(([key, value]) => {
      if (typeof value !== 'object' || value === null) {
        headers.push(key);
        values.push(escapeCsvCell(value));
      }
    });
  }

  if (results.special_indices) {
    headers.push('PTI', 'DEPI', 'CDI', 'SCON', 'HVI', 'OBS', 'GHR', 'PHR');
    values.push(
      escapeCsvCell(results.special_indices.PTI),
      escapeCsvCell(results.special_indices.DEPI),
      escapeCsvCell(results.special_indices.CDI),
      escapeCsvCell(results.special_indices.SCON),
      escapeCsvCell(results.special_indices.HVI),
      escapeCsvCell(results.special_indices.OBS),
      escapeCsvCell(results.special_indices.GHR),
      escapeCsvCell(results.special_indices.PHR)
    );
  }

  return headers.join(',') + '\n' + values.join(',');
}

export function generateRawDataCsv(responses: any[]): string {
  const headers = [
    'Card', 'Response', 'Location', 'DQ', 'Determinants', 'FQ', 'Pair', 'Contents', 'Popular', 'Z', 'Special Scores'
  ];

  const rows = responses.map(r => [
    escapeCsvCell(r.card),
    escapeCsvCell(r.response),
    escapeCsvCell(r.location),
    escapeCsvCell(r.dq),
    escapeCsvCell(r.determinants?.join(';') || ''),
    escapeCsvCell(r.fq),
    escapeCsvCell(r.pair),
    escapeCsvCell(r.contents?.join(';') || ''),
    escapeCsvCell(r.popular ? '1' : ''),
    escapeCsvCell(r.z),
    escapeCsvCell(r.specialScores?.join(';') || '')
  ]);

  return headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
}

export function exportToCSV(responses: any[]) {
  const csv = generateRawDataCsv(responses);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `rorschach_rawdata_${timestamp}.csv`);
}

export function exportSummaryToCSV(results: any) {
  const csv = generateSummaryCsv(results);
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `rorschach_summary_${timestamp}.csv`);
}

