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
    changeImage: '이미지 변경',
    edit: '수정',
    save: '저장',
    cancel: '취소',
    addReference: '참고 문헌 추가',
    editReference: '참고 문헌 수정',
    referenceTitle: '제목',
    noReferences: '참고 문헌이 없습니다',
    removeCitationFromText: '인용 제거',
    uploadImage: '이미지 업로드',
    imageUrl: '이미지 URL',
    orDragDrop: '여기에 파일을 끌어다 놓으세요',
    selectFile: '파일 선택',

    // VocabularySection
    keyVocabulary: '핵심 어휘 사전',
    addVocabulary: '어휘 추가',
    editVocabulary: '어휘 수정',

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

    // QuestionEditorModal
    addChoiceQuestion: '객관식 문제 추가',
    addShortAnswerQuestion: '서술형 문제 추가',
    addOpenEndedQuestion: '창의 사고력 문제 추가',
    editChoiceQuestion: '객관식 문제 수정',
    editShortAnswerQuestion: '서술형 문제 수정',
    editOpenEndedQuestion: '창의 사고력 문제 수정',

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
    changeImage: 'Change Image',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    addReference: 'Add Reference',
    editReference: 'Edit Reference',
    referenceTitle: 'Title',
    noReferences: 'No references available',
    removeCitationFromText: 'Remove Citation',
    uploadImage: 'Upload Image',
    imageUrl: 'Image URL',
    orDragDrop: 'Drag and drop a file here',
    selectFile: 'Select File',

    // VocabularySection
    keyVocabulary: 'Key Vocabulary',
    addVocabulary: 'Add Vocabulary',
    editVocabulary: 'Edit Vocabulary',

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

    // QuestionEditorModal
    addChoiceQuestion: 'Add Multiple Choice Question',
    addShortAnswerQuestion: 'Add Short Answer Question',
    addOpenEndedQuestion: 'Add Creative Thinking Question',
    editChoiceQuestion: 'Edit Multiple Choice Question',
    editShortAnswerQuestion: 'Edit Short Answer Question',
    editOpenEndedQuestion: 'Edit Creative Thinking Question',

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
    changeImage: 'Cambiar Imagen',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    addReference: 'Agregar Referencia',
    editReference: 'Editar Referencia',
    referenceTitle: 'Título',
    noReferences: 'No hay referencias disponibles',
    removeCitationFromText: 'Eliminar Cita',
    uploadImage: 'Subir Imagen',
    imageUrl: 'URL de Imagen',
    orDragDrop: 'Arrastra y suelta un archivo aquí',
    selectFile: 'Seleccionar Archivo',

    // VocabularySection
    keyVocabulary: 'Vocabulario Clave',
    addVocabulary: 'Agregar Vocabulario',
    editVocabulary: 'Editar Vocabulario',

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

    // QuestionEditorModal
    addChoiceQuestion: 'Agregar Pregunta de Opción Múltiple',
    addShortAnswerQuestion: 'Agregar Pregunta de Respuesta Corta',
    addOpenEndedQuestion: 'Agregar Pregunta de Pensamiento Creativo',
    editChoiceQuestion: 'Editar Pregunta de Opción Múltiple',
    editShortAnswerQuestion: 'Editar Pregunta de Respuesta Corta',
    editOpenEndedQuestion: 'Editar Pregunta de Pensamiento Creativo',

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
    changeImage: "Changer l'Image",
    edit: 'Modifier',
    save: 'Enregistrer',
    cancel: 'Annuler',
    addReference: 'Ajouter une Référence',
    editReference: 'Modifier la Référence',
    referenceTitle: 'Titre',
    noReferences: 'Aucune référence disponible',
    removeCitationFromText: 'Supprimer la Citation',
    uploadImage: 'Télécharger une Image',
    imageUrl: "URL de l'Image",
    orDragDrop: 'Glissez et déposez un fichier ici',
    selectFile: 'Sélectionner un Fichier',

    // VocabularySection
    keyVocabulary: 'Vocabulaire Clé',
    addVocabulary: 'Ajouter du Vocabulaire',
    editVocabulary: 'Modifier le Vocabulaire',

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

    // QuestionEditorModal
    addChoiceQuestion: 'Ajouter une Question à Choix Multiple',
    addShortAnswerQuestion: 'Ajouter une Question à Réponse Courte',
    addOpenEndedQuestion: 'Ajouter une Question de Pensée Créative',
    editChoiceQuestion: 'Modifier la Question à Choix Multiple',
    editShortAnswerQuestion: 'Modifier la Question à Réponse Courte',
    editOpenEndedQuestion: 'Modifier la Question de Pensée Créative',

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
    changeImage: '画像を変更',
    edit: '編集',
    save: '保存',
    cancel: 'キャンセル',
    addReference: '参考文献を追加',
    editReference: '参考文献を編集',
    referenceTitle: 'タイトル',
    noReferences: '参考文献がありません',
    removeCitationFromText: '引用を削除',
    uploadImage: '画像をアップロード',
    imageUrl: '画像URL',
    orDragDrop: 'ここにファイルをドラッグ＆ドロップ',
    selectFile: 'ファイルを選択',

    // VocabularySection
    keyVocabulary: '重要語彙',
    addVocabulary: '語彙を追加',
    editVocabulary: '語彙を編集',

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

    // QuestionEditorModal
    addChoiceQuestion: '選択問題を追加',
    addShortAnswerQuestion: '記述式問題を追加',
    addOpenEndedQuestion: '創造的思考問題を追加',
    editChoiceQuestion: '選択問題を編集',
    editShortAnswerQuestion: '記述式問題を編集',
    editOpenEndedQuestion: '創造的思考問題を編集',

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
