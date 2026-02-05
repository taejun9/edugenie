/**
 * ResultView 컴포넌트 다국어 지원
 * content.language 값에 따라 적절한 언어로 텍스트를 반환합니다.
 * 지원 언어: Korean, English, Spanish, French, Japanese
 */

const translations = {
  Korean: {
    // ResultHeader
    language: '언어',

    // PassageSection
    readingPassage: '학습 지문',
    copyText: '지문 텍스트 복사',
    summary: '내용 요약',
    wikipediaReferences: '위키피디아 참고 문헌',

    // VocabularySection
    keyVocabulary: '핵심 어휘 사전',

    // MapSection
    knowledgeMap: '지식 구조 맵',
    mapHoverHint: '노드에 마우스를 올리면 연결된 관계가 선명하게 표시됩니다',

    // AssessmentSection
    comprehensionAssessment: '지문 이해도 평가',
    mapAnalysis: '지식 구조 분석',
    multipleChoice: '객관식 퀴즈',
    shortAnswer: '서술형 평가',
    creativeThinking: '창의 사고력 문제',

    // AnswerExplanation
    answer: '정답',
    sampleAnswer: '정답 예시',
    showAnswer: '정답 해설 보기',
    explanation: '해설',

    // EdgeDetailModal
    relationshipDetail: '관계 상세 정보',
    contextSnippet: '지문 내 근거 문장',
    deepExplanation: '심층 관계 해설',
    confirmClose: '확인 완료',
    closeModal: '모달 닫기',
  },
  English: {
    // ResultHeader
    language: 'Language',

    // PassageSection
    readingPassage: 'Reading Passage',
    copyText: 'Copy Text',
    summary: 'Summary',
    wikipediaReferences: 'Wikipedia References',

    // VocabularySection
    keyVocabulary: 'Key Vocabulary',

    // MapSection
    knowledgeMap: 'Knowledge Map',
    mapHoverHint: 'Hover over a node to highlight its connections',

    // AssessmentSection
    comprehensionAssessment: 'Comprehension Assessment',
    mapAnalysis: 'Map Analysis',
    multipleChoice: 'Multiple Choice Quiz',
    shortAnswer: 'Short Answer',
    creativeThinking: 'Creative Thinking',

    // AnswerExplanation
    answer: 'Answer',
    sampleAnswer: 'Sample Answer',
    showAnswer: 'Show Answer',
    explanation: 'Explanation',

    // EdgeDetailModal
    relationshipDetail: 'Relationship Details',
    contextSnippet: 'Context from Passage',
    deepExplanation: 'Detailed Explanation',
    confirmClose: 'Close',
    closeModal: 'Close modal',
  },
  Spanish: {
    // ResultHeader
    language: 'Idioma',

    // PassageSection
    readingPassage: 'Texto de Lectura',
    copyText: 'Copiar Texto',
    summary: 'Resumen',
    wikipediaReferences: 'Referencias de Wikipedia',

    // VocabularySection
    keyVocabulary: 'Vocabulario Clave',

    // MapSection
    knowledgeMap: 'Mapa de Conocimiento',
    mapHoverHint: 'Pasa el cursor sobre un nodo para ver sus conexiones',

    // AssessmentSection
    comprehensionAssessment: 'Evaluación de Comprensión',
    mapAnalysis: 'Análisis del Mapa',
    multipleChoice: 'Opción Múltiple',
    shortAnswer: 'Respuesta Corta',
    creativeThinking: 'Pensamiento Creativo',

    // AnswerExplanation
    answer: 'Respuesta',
    sampleAnswer: 'Ejemplo de Respuesta',
    showAnswer: 'Ver Respuesta',
    explanation: 'Explicación',

    // EdgeDetailModal
    relationshipDetail: 'Detalles de la Relación',
    contextSnippet: 'Contexto del Texto',
    deepExplanation: 'Explicación Detallada',
    confirmClose: 'Cerrar',
    closeModal: 'Cerrar modal',
  },
  French: {
    // ResultHeader
    language: 'Langue',

    // PassageSection
    readingPassage: 'Texte de Lecture',
    copyText: 'Copier le Texte',
    summary: 'Résumé',
    wikipediaReferences: 'Références Wikipédia',

    // VocabularySection
    keyVocabulary: 'Vocabulaire Clé',

    // MapSection
    knowledgeMap: 'Carte des Connaissances',
    mapHoverHint: 'Survolez un nœud pour voir ses connexions',

    // AssessmentSection
    comprehensionAssessment: 'Évaluation de Compréhension',
    mapAnalysis: 'Analyse de la Carte',
    multipleChoice: 'Choix Multiple',
    shortAnswer: 'Réponse Courte',
    creativeThinking: 'Pensée Créative',

    // AnswerExplanation
    answer: 'Réponse',
    sampleAnswer: 'Exemple de Réponse',
    showAnswer: 'Voir la Réponse',
    explanation: 'Explication',

    // EdgeDetailModal
    relationshipDetail: 'Détails de la Relation',
    contextSnippet: 'Contexte du Texte',
    deepExplanation: 'Explication Détaillée',
    confirmClose: 'Fermer',
    closeModal: 'Fermer le modal',
  },
  Japanese: {
    // ResultHeader
    language: '言語',

    // PassageSection
    readingPassage: '学習テキスト',
    copyText: 'テキストをコピー',
    summary: '要約',
    wikipediaReferences: 'Wikipedia参考文献',

    // VocabularySection
    keyVocabulary: '重要語彙',

    // MapSection
    knowledgeMap: '知識構造マップ',
    mapHoverHint: 'ノードにカーソルを合わせると関連する接続が表示されます',

    // AssessmentSection
    comprehensionAssessment: '読解力評価',
    mapAnalysis: 'マップ分析',
    multipleChoice: '選択問題',
    shortAnswer: '記述式問題',
    creativeThinking: '創造的思考問題',

    // AnswerExplanation
    answer: '正解',
    sampleAnswer: '解答例',
    showAnswer: '解答を見る',
    explanation: '解説',

    // EdgeDetailModal
    relationshipDetail: '関係の詳細',
    contextSnippet: '本文からの引用',
    deepExplanation: '詳細な解説',
    confirmClose: '閉じる',
    closeModal: 'モーダルを閉じる',
  },
}

/**
 * 언어에 맞는 번역 텍스트를 반환합니다
 * @param {string} language - 언어 (Korean, English 등)
 * @param {string} key - 번역 키
 * @returns {string} 번역된 텍스트
 */
export function t(language, key) {
  const lang = translations[language] || translations.Korean
  return lang[key] || translations.Korean[key] || key
}

/**
 * 언어에 맞는 전체 번역 객체를 반환합니다
 * @param {string} language - 언어
 * @returns {Object} 번역 객체
 */
export function getTranslations(language) {
  return translations[language] || translations.Korean
}

export default translations
