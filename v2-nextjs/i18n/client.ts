import type { Language } from './config';
import en from './locales/en.json';

type TranslationShape = typeof en;

const translations: Record<Language, TranslationShape> = {
  ko: en,
  en,
  ja: en,
  es: en,
  pt: en,
};

const LANGUAGE_OVERRIDES: Record<Language, Record<string, string>> = {
  en: {},
  ko: {
    'nav.scoring': '채점 & 구조요약',
    'nav.more': '더보기',
    'nav.login': '로그인 / 회원가입',
    'nav.logout': '로그아웃',
    'nav.account': '내 계정',
    'nav.loginRequired': '로그인이 필요합니다',
    'buttons.calculate': '결과 계산하기',
    'buttons.reset': '입력값 초기화',
    'buttons.add': '추가',
    'buttons.delete': '삭제',
    'buttons.backToInput': '입력으로 돌아가기',
    'links.privacy': '개인정보처리방침',
    'auth.googleContinue': 'Google로 로그인/회원가입',
  },
  ja: {
    'nav.scoring': '採点と構造要約',
    'nav.more': '詳細',
    'nav.login': 'ログイン / 新規登録',
    'nav.logout': 'ログアウト',
    'nav.account': 'マイアカウント',
    'nav.loginRequired': 'ログインが必要です',
    'buttons.calculate': '結果を計算',
    'buttons.reset': '入力をリセット',
    'buttons.add': '追加',
    'buttons.delete': '削除',
    'buttons.backToInput': '入力へ戻る',
    'links.privacy': 'プライバシーポリシー',
    'auth.googleContinue': 'Google で続行',
  },
  es: {
    'nav.scoring': 'Codificación y Resumen Estructural',
    'nav.more': 'Más',
    'nav.login': 'Iniciar sesión / Registrarse',
    'nav.logout': 'Cerrar sesión',
    'nav.account': 'Mi cuenta',
    'nav.loginRequired': 'Se requiere iniciar sesión',
    'buttons.calculate': 'Calcular resultados',
    'buttons.reset': 'Restablecer entrada',
    'buttons.add': 'Agregar',
    'buttons.delete': 'Eliminar',
    'buttons.backToInput': 'Volver a la entrada',
    'links.privacy': 'Política de Privacidad',
    'auth.googleContinue': 'Continuar con Google',
  },
  pt: {
    'nav.scoring': 'Pontuação e Resumo Estrutural',
    'nav.more': 'Mais',
    'nav.login': 'Entrar / Cadastrar',
    'nav.logout': 'Sair',
    'nav.account': 'Minha conta',
    'nav.loginRequired': 'É necessário fazer login',
    'buttons.calculate': 'Calcular resultados',
    'buttons.reset': 'Redefinir entrada',
    'buttons.add': 'Adicionar',
    'buttons.delete': 'Excluir',
    'buttons.backToInput': 'Voltar para entrada',
    'links.privacy': 'Política de Privacidade',
    'auth.googleContinue': 'Continuar com Google',
  },
};

/**
 * Get nested value from object using dot notation
 * e.g., getNestedValue(obj, 'result.core.R') returns obj.result.core.R
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key itself if path not found
    }
  }

  return typeof current === 'string' ? current : path;
}

/**
 * Get translation for a key in the specified language, with optional interpolation
 */
export function getTranslation(language: Language, key: string, params?: Record<string, string>): string {
  const override = LANGUAGE_OVERRIDES[language]?.[key];
  if (override) {
    let result = override;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
    }
    return result;
  }

  const langTranslations = translations[language] || translations.en;
  let result = getNestedValue(langTranslations as unknown as Record<string, unknown>, key);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return result;
}

/**
 * Get all translations for a language
 */
export function getTranslations(language: Language): TranslationShape {
  return translations[language] || translations.ko;
}
