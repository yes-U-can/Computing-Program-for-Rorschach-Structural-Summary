/**
 * Rorschach Calculator v2.0.0
 * Sample Data (원본 GAS index.html에서 이전)
 * 
 * 원본 샘플 데이터를 그대로 유지
 */

import type { RorschachResponse } from '@/types';

export const SAMPLE_DATA: RorschachResponse[] = [
  {
    card: 'I',
    response: '왠지… 박쥐 같아요.',
    location: 'W',
    dq: 'o',
    determinants: ["FC'"],
    fq: 'o',
    pair: 'none',
    contents: ['A'],
    popular: true,
    z: 'ZW',
    specialScores: ['DR1']
  },
  {
    card: 'II',
    response: '해부학적 구조(근육/내장)처럼 보여요. 색이 먼저 눈에 들어와요.',
    location: 'W',
    dq: 'o',
    determinants: ['CF'],
    fq: 'u',
    pair: 'none',
    contents: ['An'],
    popular: false,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'II',
    response: '곰 두 마리가 하이파이브',
    location: 'D',
    dq: '+',
    determinants: ['Ma'],
    fq: 'o',
    pair: '(2)',
    contents: ['A'],
    popular: false,
    z: 'ZA',
    specialScores: []
  },
  {
    card: 'III',
    response: '두 사람이 나비넥타이를 매고 물건을 옮기고 있네요.',
    location: 'D',
    dq: '+',
    determinants: ['Ma', 'FC'],
    fq: 'u',
    pair: '(2)',
    contents: ['H', 'Cg', 'Hh'],
    popular: true,
    z: 'ZD',
    specialScores: ['COP', 'DR1']
  },
  {
    card: 'IV',
    response: '두 존재가 거대한 사람 곁에서 축 늘어진 채 가만히 흔들리는 느낌이 있고, 회색 음영이 번져 이상하고 뒤죽박죽해 보여요. 사람은 손상된 느낌이고, 동물 부분과 특이한 부분도 보여요.',
    location: 'W',
    dq: '+',
    determinants: ['Mp', 'YF', "C'F", 'FMp', 'mp', 'FV'],
    fq: '-',
    pair: '(2)',
    contents: ['Hx', 'Ad', 'Id'],
    popular: false,
    z: 'ZA',
    specialScores: ['MOR', 'ALOG']
  },
  {
    card: 'V',
    response: '무채색의 박쥐/나방 같아요.',
    location: 'W',
    dq: 'o',
    determinants: ["FC'"],
    fq: 'o',
    pair: 'none',
    contents: ['A'],
    popular: true,
    z: 'ZW',
    specialScores: ['DR2', 'PSV']
  },
  {
    card: 'VI',
    response: '사람의 신체 일부가 둘, 축 늘어진 채 바닥에 펼쳐진 느낌이에요',
    location: 'W',
    dq: '+',
    determinants: ['Mp'],
    fq: '-',
    pair: '(2)',
    contents: ['H', 'Hh'],
    popular: false,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'VI',
    response: '위쪽 구석의 작은 부분이, 퍼져 보이는 음영 때문에 빵 조각 같아요.',
    location: 'Dd',
    dq: 'o',
    determinants: ['FV'],
    fq: '-',
    pair: 'none',
    contents: ['Fd'],
    popular: false,
    z: '',
    specialScores: []
  },
  {
    card: 'VII',
    response: '사람처럼 보이는 형체 두 개가 가만히 마주 서 있어요, 회색 음영 때문에 실루엣 같고, 흐릿하게 움직임이 번지는 느낌이에요.',
    location: 'W',
    dq: '+',
    determinants: ['Mp', 'mp', 'YF'],
    fq: 'o',
    pair: '(2)',
    contents: ['(H)'],
    popular: true,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'VII',
    response: '가운데 흰 공간이 현미경/과학 장치 부품처럼 보여요.',
    location: 'DS',
    dq: 'o',
    determinants: ['F'],
    fq: 'u',
    pair: 'none',
    contents: ['Sc'],
    popular: false,
    z: '',
    specialScores: []
  },
  {
    card: 'VIII',
    response: '갈비뼈처럼 생겼어요.',
    location: 'D',
    dq: 'o',
    determinants: ['F'],
    fq: 'o',
    pair: 'none',
    contents: ['An'],
    popular: false,
    z: '',
    specialScores: ['ALOG']
  },
  {
    card: 'VIII',
    response: '양쪽에 두 마리 동물이 산을 오르고 있어요.',
    location: 'W',
    dq: '+',
    determinants: ['FMa'],
    fq: 'o',
    pair: '(2)',
    contents: ['A'],
    popular: true,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'IX',
    response: '여러 색이 번지며 불꽃이 피어오르는 느낌이에요.',
    location: 'W',
    dq: '+',
    determinants: ['Ma', 'ma', 'CF', 'YF'],
    fq: '-',
    pair: 'none',
    contents: ['Fi'],
    popular: false,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'X',
    response: '불꽃놀이처럼 보이네요, 여러 색깔이 터지는…',
    location: 'W',
    dq: 'o',
    determinants: ['CF', 'ma'],
    fq: 'o',
    pair: '(2)',
    contents: ['Fi'],
    popular: false,
    z: 'ZW',
    specialScores: []
  },
  {
    card: 'X',
    response: '분홍색 부분이 게 두 마리가 집게를 들고 마주보는 모습 같아요.',
    location: 'W',
    dq: '+',
    determinants: ['FMa'],
    fq: 'u',
    pair: '(2)',
    contents: ['A'],
    popular: true,
    z: 'ZW',
    specialScores: []
  }
];

