import type {
  Paper,
  PaperMetadata,
  Author,
  Folder,
  CitationGraphData,
  SearchQuery,
  SearchResponse,
  VideoData,
} from '@/types';

// ============================================
// مؤلفون وهميون
// ============================================

const authors: Author[] = [
  {
    firstName: 'Yoshua',
    lastName: 'Bengio',
    fullName: 'Yoshua Bengio',
    orcid: '0000-0002-9322-3514',
    affiliation: 'Université de Montréal',
    hIndex: 120,
  },
  {
    firstName: 'Geoffrey',
    lastName: 'Hinton',
    fullName: 'Geoffrey Hinton',
    orcid: '0000-0001-9242-639X',
    affiliation: 'University of Toronto',
    hIndex: 175,
  },
  {
    firstName: 'Yann',
    lastName: 'LeCun',
    fullName: 'Yann LeCun',
    orcid: '0000-0002-3821-6323',
    affiliation: 'Meta AI / NYU',
    hIndex: 130,
  },
  {
    firstName: 'Fei-Fei',
    lastName: 'Li',
    fullName: 'Fei-Fei Li',
    orcid: '0000-0003-4088-4918',
    affiliation: 'Stanford University',
    hIndex: 105,
  },
  {
    firstName: 'Andrew',
    lastName: 'Ng',
    fullName: 'Andrew Ng',
    orcid: '0000-0002-6156-5434',
    affiliation: 'Stanford University / DeepLearning.AI',
    hIndex: 140,
  },
  {
    firstName: 'Demis',
    lastName: 'Hassabis',
    fullName: 'Demis Hassabis',
    orcid: '0000-0003-2216-8941',
    affiliation: 'Google DeepMind',
    hIndex: 90,
  },
  {
    firstName: 'Sara',
    lastName: 'Hooker',
    fullName: 'Sara Hooker',
    orcid: '0000-0002-9384-5321',
    affiliation: 'Cohere For AI',
    hIndex: 45,
  },
  {
    firstName: 'Percy',
    lastName: 'Liang',
    fullName: 'Percy Liang',
    orcid: '0000-0001-7654-1234',
    affiliation: 'Stanford University',
    hIndex: 78,
  },
  {
    firstName: 'Emily',
    lastName: 'Bender',
    fullName: 'Emily M. Bender',
    orcid: '0000-0002-2866-9802',
    affiliation: 'University of Washington',
    hIndex: 55,
  },
  {
    firstName: 'Timnit',
    lastName: 'Gebru',
    fullName: 'Timnit Gebru',
    orcid: '0000-0002-0914-7658',
    affiliation: 'DAIR Institute',
    hIndex: 48,
  },
  {
    firstName: 'Jennifer',
    lastName: 'Doudna',
    fullName: 'Jennifer A. Doudna',
    orcid: '0000-0002-4694-2386',
    affiliation: 'UC Berkeley',
    hIndex: 110,
  },
  {
    firstName: 'Emmanuelle',
    lastName: 'Charpentier',
    fullName: 'Emmanuelle Charpentier',
    orcid: '0000-0001-5024-005X',
    affiliation: 'Max Planck Institute',
    hIndex: 75,
  },
  {
    firstName: 'Katalin',
    lastName: 'Karikó',
    fullName: 'Katalin Karikó',
    orcid: '0000-0002-4459-8927',
    affiliation: 'BioNTech / University of Pennsylvania',
    hIndex: 68,
  },
  {
    firstName: 'John',
    lastName: 'Hopfield',
    fullName: 'John J. Hopfield',
    orcid: '0000-0002-7784-1223',
    affiliation: 'Princeton University',
    hIndex: 85,
  },
];

// ============================================
// بيانات وصفية للأوراق
// ============================================

const paperMetadataList: PaperMetadata[] = [
  {
    doi: '10.1038/s41586-024-08000-1',
    title: 'Attention Is All You Need: A Decade of Transformer Architectures',
    authors: [authors[0], authors[1], authors[2]],
    abstract:
      'We present a comprehensive survey of transformer architectures that have emerged since the seminal "Attention Is All You Need" paper. Transformers have become the dominant architecture in natural language processing and are increasingly applied to computer vision, speech processing, and multimodal learning. We review the key innovations including sparse attention mechanisms, linear transformers, and mixture-of-experts approaches. We identify emerging trends and open challenges in scaling, efficiency, and interpretability of transformer models.',
    journal: 'Nature Reviews Computer Science',
    publisher: 'Nature Publishing Group',
    year: 2024,
    volume: '5',
    issue: '3',
    pages: '145-162',
    citations: 2450,
    impactQuartile: 'Q1',
    accessType: 'open',
    source: 'arxiv',
    pdfUrl: 'https://arxiv.org/pdf/2401.00001',
    landingPageUrl: 'https://doi.org/10.1038/s41586-024-08000-1',
    keywords: ['transformers', 'deep learning', 'attention mechanism', 'NLP', 'survey'],
    publicationDate: '2024-03-15',
  },
  {
    doi: '10.1126/science.ade1234',
    title: 'CRISPR-Cas9: Mechanisms and Applications in Therapeutic Genome Editing',
    authors: [authors[10], authors[11]],
    abstract:
      'The CRISPR-Cas9 system has revolutionized the field of genome editing, enabling precise modifications to DNA sequences in living cells. This review discusses the molecular mechanisms of CRISPR-Cas9, recent advances in delivery methods, and the expanding landscape of therapeutic applications. We address the challenges of off-target effects, immunogenicity, and ethical considerations surrounding germline editing.',
    journal: 'Science',
    publisher: 'AAAS',
    year: 2023,
    volume: '382',
    issue: '6672',
    pages: 'ead1234',
    citations: 1890,
    impactQuartile: 'Q1',
    accessType: 'restricted',
    source: 'pubmed',
    pdfUrl: null,
    landingPageUrl: 'https://doi.org/10.1126/science.ade1234',
    keywords: ['CRISPR', 'genome editing', 'gene therapy', 'Cas9', 'biotechnology'],
    publicationDate: '2023-11-10',
  },
  {
    doi: '10.48550/arXiv.2312.17654',
    title: 'Large Language Models as Scientific Reasoning Engines',
    authors: [authors[4], authors[7]],
    abstract:
      'This paper investigates the capability of large language models to perform scientific reasoning tasks, including hypothesis generation, experimental design, and data interpretation. We benchmark several state-of-the-art LLMs on a curated dataset of scientific problems across physics, chemistry, and biology. Our findings suggest that while LLMs demonstrate impressive pattern recognition, they struggle with causal reasoning and quantitative precision required for rigorous scientific work.',
    journal: 'arXiv preprint',
    publisher: 'arXiv',
    year: 2023,
    volume: null,
    issue: null,
    pages: null,
    citations: 320,
    impactQuartile: 'unranked',
    accessType: 'open',
    source: 'arxiv',
    pdfUrl: 'https://arxiv.org/pdf/2312.17654',
    landingPageUrl: 'https://arxiv.org/abs/2312.17654',
    keywords: ['LLM', 'scientific reasoning', 'benchmark', 'NLP', 'AI for science'],
    publicationDate: '2023-12-28',
  },
  {
    doi: '10.1038/s42256-024-00900-5',
    title: 'On the Dangers of Stochastic Parrots: Can Language Models Be Too Large?',
    authors: [authors[8], authors[9]],
    abstract:
      'We examine the risks associated with the rapid scaling of language models. As models grow in size and capability, they increasingly encode and amplify biases present in training data, consume vast computational resources, and create challenges for accountability and transparency. We propose a framework for responsible AI development that prioritizes human agency, environmental sustainability, and equitable access to AI technologies.',
    journal: 'Nature Machine Intelligence',
    publisher: 'Nature Publishing Group',
    year: 2024,
    volume: '6',
    issue: '1',
    pages: '23-35',
    citations: 1560,
    impactQuartile: 'Q1',
    accessType: 'open',
    source: 'semantic_scholar',
    pdfUrl: 'https://example.com/stochastic-parrots.pdf',
    landingPageUrl: 'https://doi.org/10.1038/s42256-024-00900-5',
    keywords: ['language models', 'AI ethics', 'bias', 'environmental impact', 'responsible AI'],
    publicationDate: '2024-01-20',
  },
  {
    doi: '10.1016/j.cell.2023.10.045',
    title: 'mRNA Vaccine Technology: From COVID-19 to Cancer Immunotherapy',
    authors: [authors[12]],
    abstract:
      'The rapid development of mRNA vaccines for COVID-19 demonstrated the potential of this technology platform. This review discusses the scientific principles underlying mRNA vaccine design, including nucleoside modifications, lipid nanoparticle delivery systems, and antigen optimization. We explore the expanding pipeline of mRNA-based therapeutics for infectious diseases, cancer, and genetic disorders.',
    journal: 'Cell',
    publisher: 'Elsevier',
    year: 2023,
    volume: '186',
    issue: '24',
    pages: '5234-5250',
    citations: 870,
    impactQuartile: 'Q1',
    accessType: 'embargoed',
    source: 'pubmed',
    pdfUrl: null,
    landingPageUrl: 'https://doi.org/10.1016/j.cell.2023.10.045',
    keywords: ['mRNA', 'vaccines', 'immunotherapy', 'lipid nanoparticles', 'COVID-19'],
    publicationDate: '2023-12-05',
  },
  {
    doi: '10.48550/arXiv.2405.01234',
    title: 'Vision-Language Models for Scientific Figure Understanding',
    authors: [authors[3], authors[5]],
    abstract:
      'Scientific figures contain rich information that is often inaccessible to text-only processing pipelines. We introduce SciFigure-VL, a vision-language model fine-tuned on a large corpus of scientific figures from diverse disciplines. Our model achieves state-of-the-art performance on tasks including figure captioning, data extraction from plots, and visual question answering on scientific diagrams. We release the model and evaluation benchmark to the research community.',
    journal: 'arXiv preprint',
    publisher: 'arXiv',
    year: 2024,
    volume: null,
    issue: null,
    pages: null,
    citations: 45,
    impactQuartile: 'unranked',
    accessType: 'open',
    source: 'arxiv',
    pdfUrl: 'https://arxiv.org/pdf/2405.01234',
    landingPageUrl: 'https://arxiv.org/abs/2405.01234',
    keywords: ['vision-language', 'scientific figures', 'multimodal', 'deep learning'],
    publicationDate: '2024-05-03',
  },
  {
    doi: '10.1073/pnas.2401234',
    title: 'Neural Scaling Laws for Protein Structure Prediction',
    authors: [authors[5], authors[6]],
    abstract:
      'We study the scaling behavior of deep learning models for protein structure prediction. By systematically varying model size, training data, and compute budget, we identify power-law relationships that govern prediction accuracy. Our analysis provides practical guidance for resource allocation in computational biology and suggests that further scaling could enable accurate prediction of protein dynamics and interactions.',
    journal: 'Proceedings of the National Academy of Sciences',
    publisher: 'National Academy of Sciences',
    year: 2024,
    volume: '121',
    issue: '15',
    pages: 'e2401234',
    citations: 290,
    impactQuartile: 'Q1',
    accessType: 'open',
    source: 'semantic_scholar',
    pdfUrl: 'https://www.pnas.org/doi/pdf/10.1073/pnas.2401234',
    landingPageUrl: 'https://doi.org/10.1073/pnas.2401234',
    keywords: ['protein structure', 'AlphaFold', 'scaling laws', 'deep learning', 'biology'],
    publicationDate: '2024-04-08',
  },
  {
    doi: '10.48550/arXiv.2403.09876',
    title: 'Hopfield Networks: From Statistical Physics to Modern Machine Learning',
    authors: [authors[13], authors[0]],
    abstract:
      'This paper traces the intellectual journey from John Hopfield\'s seminal 1982 paper on neural networks as physical systems to their modern interpretations in the context of transformer attention mechanisms and energy-based models. We highlight how insights from statistical physics continue to inform the design of modern machine learning architectures, particularly in the areas of memory, attention, and representation learning.',
    journal: 'arXiv preprint',
    publisher: 'arXiv',
    year: 2024,
    volume: null,
    issue: null,
    pages: null,
    citations: 120,
    impactQuartile: 'unranked',
    accessType: 'open',
    source: 'arxiv',
    pdfUrl: 'https://arxiv.org/pdf/2403.09876',
    landingPageUrl: 'https://arxiv.org/abs/2403.09876',
    keywords: ['Hopfield networks', 'statistical physics', 'transformers', 'energy-based models', 'history'],
    publicationDate: '2024-03-18',
  },
];

// ============================================
// أوراق كاملة (Papers)
// ============================================

export const mockPapers: Paper[] = paperMetadataList.map((metadata, index) => ({
  id: `paper-${index + 1}`,
  metadata,
  addedToLibrary: index < 3, // أول 3 أوراق في المكتبة
  readingProgress: index === 0 ? 65 : index === 1 ? 30 : 0,
  notes: '',
  tags: metadata.keywords.slice(0, 2),
  folderId: index < 2 ? 'folder-1' : index === 2 ? 'folder-2' : null,
  lastOpened: index < 4 ? new Date(Date.now() - index * 86400000).toISOString() : null,
  aiSummary: index === 0
    ? 'This comprehensive survey reviews a decade of transformer architectures, highlighting key innovations in sparse attention, linear transformers, and mixture-of-experts. The authors identify scaling challenges and future research directions in efficiency and interpretability.'
    : null,
}));

// ============================================
// مجلدات
// ============================================

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Deep Learning & NLP',
    parentId: null,
    paperCount: 3,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'folder-2',
    name: 'Bioinformatics & Genomics',
    parentId: null,
    paperCount: 2,
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'folder-3',
    name: 'AI Ethics & Safety',
    parentId: null,
    paperCount: 1,
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: 'folder-4',
    name: 'Reading List',
    parentId: null,
    paperCount: 3,
    createdAt: '2024-04-05T16:45:00Z',
  },
];

// ============================================
// رسم الاستشهادات الوهمي
// ============================================

export const mockCitationGraph: CitationGraphData = {
  nodes: [
    { id: 'paper-1', title: 'A Decade of Transformer Architectures', authors: 'Bengio, Hinton, LeCun', year: 2024, citations: 2450, isMainPaper: true },
    { id: 'paper-2', title: 'CRISPR-Cas9 Mechanisms', authors: 'Doudna, Charpentier', year: 2023, citations: 1890, isMainPaper: false },
    { id: 'paper-3', title: 'LLMs as Scientific Reasoning Engines', authors: 'Ng, Liang', year: 2023, citations: 320, isMainPaper: false },
    { id: 'paper-4', title: 'On the Dangers of Stochastic Parrots', authors: 'Bender, Gebru', year: 2024, citations: 1560, isMainPaper: true },
    { id: 'paper-5', title: 'mRNA Vaccine Technology', authors: 'Karikó', year: 2023, citations: 870, isMainPaper: false },
    { id: 'paper-6', title: 'Vision-Language Models for Scientific Figures', authors: 'Li, Hassabis', year: 2024, citations: 45, isMainPaper: false },
    { id: 'paper-7', title: 'Neural Scaling Laws for Protein Structure', authors: 'Hassabis, Hooker', year: 2024, citations: 290, isMainPaper: false },
    { id: 'paper-8', title: 'Hopfield Networks to Modern ML', authors: 'Hopfield, Bengio', year: 2024, citations: 120, isMainPaper: false },
  ],
  links: [
    { source: 'paper-1', target: 'paper-3', type: 'cites' },
    { source: 'paper-1', target: 'paper-8', type: 'cites' },
    { source: 'paper-3', target: 'paper-1', type: 'cited_by' },
    { source: 'paper-4', target: 'paper-1', type: 'cites' },
    { source: 'paper-6', target: 'paper-1', type: 'cites' },
    { source: 'paper-7', target: 'paper-2', type: 'cites' },
    { source: 'paper-8', target: 'paper-1', type: 'cited_by' },
    { source: 'paper-5', target: 'paper-2', type: 'cites' },
  ],
};

// ============================================
// بيانات فيديو وهمي
// ============================================

export const mockVideo: VideoData = {
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Deep Learning for Scientific Discovery - Keynote Presentation',
  source: 'youtube',
  duration: 3600, // 60 دقيقة
  currentTime: 0,
  isPlaying: false,
  volume: 0.8,
  playbackRate: 1,
  transcript: [
    { startTime: 0, endTime: 15, text: 'Welcome to this keynote on deep learning for scientific discovery.' },
    { startTime: 15, endTime: 45, text: 'Today I will discuss how neural networks are transforming fields from physics to biology.' },
    { startTime: 45, endTime: 75, text: 'We begin with the fundamental concepts of representation learning and its application to scientific data.' },
    { startTime: 75, endTime: 120, text: 'Recent advances in graph neural networks have enabled breakthroughs in molecular dynamics simulation.' },
    { startTime: 120, endTime: 180, text: 'In protein structure prediction, AlphaFold has demonstrated the power of attention mechanisms applied to biological sequences.' },
  ],
  aiSummary: 'This keynote explores the intersection of deep learning and scientific research. Key topics include representation learning for scientific data, graph neural networks for molecular dynamics, and attention mechanisms for protein structure prediction. The speaker highlights recent breakthroughs and discusses future directions for AI-driven scientific discovery.',
};

// ============================================
// استعلام بحث افتراضي
// ============================================

export const defaultSearchQuery: SearchQuery = {
  keywords: '',
  booleanOperator: 'AND',
  authors: '',
  journal: '',
  yearFrom: null,
  yearTo: null,
  source: 'arxiv',
  openAccessOnly: false,
  impactQuartile: null,
  contentType: 'paper',
};

// ============================================
// دوال محاكاة API (تستخدم في التطوير)
// ============================================

/** محاكاة بحث أكاديمي مع تأخير */
export async function mockSearchPapers(
  query: Partial<SearchQuery>,
  delayMs: number = 800
): Promise<SearchResponse> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const { keywords, authors, yearFrom, yearTo, source, openAccessOnly, impactQuartile } = query;

  let filtered = [...mockPapers];

  // فلترة بالكلمات المفتاحية
  if (keywords && keywords.trim()) {
    const searchTerms = keywords.toLowerCase().split(/\s+/);
    filtered = filtered.filter((paper) => {
      const searchText = [
        paper.metadata.title,
        paper.metadata.abstract,
        ...paper.metadata.keywords,
      ]
        .join(' ')
        .toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    });
  }

  // فلترة بالمؤلف
  if (authors && authors.trim()) {
    const authorTerm = authors.toLowerCase();
    filtered = filtered.filter((paper) =>
      paper.metadata.authors.some(
        (a) =>
          a.fullName.toLowerCase().includes(authorTerm) ||
          a.lastName.toLowerCase().includes(authorTerm)
      )
    );
  }

  // فلترة بالسنة
  if (yearFrom) {
    filtered = filtered.filter((paper) => paper.metadata.year >= yearFrom);
  }
  if (yearTo) {
    filtered = filtered.filter((paper) => paper.metadata.year <= yearTo);
  }

  // فلترة بالمصدر
  if (source) {
    filtered = filtered.filter((paper) => paper.metadata.source === source);
  }

  // فلترة الوصول المفتوح
  if (openAccessOnly) {
    filtered = filtered.filter((paper) => paper.metadata.accessType === 'open');
  }

  // فلترة معامل التأثير
  if (impactQuartile && impactQuartile !== 'unranked') {
    filtered = filtered.filter((paper) => paper.metadata.impactQuartile === impactQuartile);
  }

  return {
    query: { ...defaultSearchQuery, ...query },
    results: filtered,
    totalResults: filtered.length,
    page: 1,
    pageSize: 20,
    timeTakenMs: Math.floor(Math.random() * 200) + 50,
  };
}

/** محاكاة جلب ورقة عبر DOI */
export async function mockFetchPaperByDOI(doi: string): Promise<Paper | null> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockPapers.find((paper) => paper.metadata.doi === doi) || null;
}

/** محاكاة تلخيص بالذكاء الاصطناعي */
export async function mockAISummarize(paperId: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const paper = mockPapers.find((p) => p.id === paperId);
  if (!paper) return 'Paper not found.';
  return `Summary: "${paper.metadata.title}" by ${paper.metadata.authors.map((a) => a.lastName).join(', ')} (${paper.metadata.year}). This paper investigates key aspects of ${paper.metadata.keywords.slice(0, 2).join(' and ')}. The work has received ${paper.metadata.citations} citations and contributes to the field of ${paper.metadata.keywords[0]}.`;
      }
