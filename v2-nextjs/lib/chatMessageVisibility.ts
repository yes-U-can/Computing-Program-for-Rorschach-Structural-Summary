function normalize(content: string): string {
  return content.toLowerCase().trim();
}

export function isSystemBootstrapMessage(content: string): boolean {
  const normalized = normalize(content);
  return (
    normalized.includes('[raw_data_csv]') &&
    normalized.includes('[structural_summary_csv]') &&
    normalized.includes('you are assisting with interpretation of a rorschach structural summary')
  );
}

export function isSystemAutoAckMessage(content: string): boolean {
  const normalized = normalize(content);
  return normalized.includes('the primary datasets have been stored for context');
}

export function getCondensedSystemMessage(content: string): string | null {
  if (isSystemBootstrapMessage(content)) {
    return '[시스템] 검사 데이터 컨텍스트를 자동으로 불러왔습니다.';
  }
  if (isSystemAutoAckMessage(content)) {
    return '[시스템] 데이터 준비가 완료되었습니다. 질문을 이어서 입력해 주세요.';
  }
  return null;
}
