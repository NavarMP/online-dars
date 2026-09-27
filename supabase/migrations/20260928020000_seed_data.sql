-- ============================================================
-- Seed Data: Realistic demo content for Suffa Platform
-- ============================================================

-- ─── Additional Categories ───
INSERT INTO kutub_categories (name, description) VALUES 
  ('Nahw', 'Arabic Grammar (Syntax) — the science of sentence structure in Arabic'),
  ('Sarf', 'Arabic Morphology — the science of word forms and patterns'),
  ('Tasawwuf', 'Islamic Spirituality — the inner dimensions of worship and purification of the heart'),
  ('Usul al-Fiqh', 'Principles of Jurisprudence — the methodology of deriving Islamic rulings'),
  ('Mantiq', 'Logic — the science of valid reasoning as taught in classical Islamic tradition'),
  ('Balagha', 'Arabic Rhetoric — the art of eloquent expression')
ON CONFLICT (name) DO NOTHING;

-- ─── Instructors ───
INSERT INTO instructors (name, bio, title, specialization, years_of_experience) VALUES 
(
  'Ustadh Muhammad Faizal Musliyar',
  'A distinguished scholar from Kerala, India, with over 25 years of teaching experience in traditional Islamic sciences. He holds ijazah in multiple disciplines including Fiqh, Aqidah, and Tafsir. His methodical approach to teaching complex texts has earned him recognition as one of the foremost educators at Alathurpadi Dars.',
  'Ustadh',
  'Fiqh & Aqidah',
  25
),
(
  'Moulavi Abdul Rasheed Darimi',
  'An accomplished scholar specializing in Hadith sciences and Seerah. He graduated from Darul Huda Islamic University and pursued advanced studies under renowned scholars. His deep understanding of prophetic traditions and their practical applications makes his classes invaluable for students seeking authentic knowledge.',
  'Moulavi',
  'Hadith & Seerah',
  18
),
(
  'Ustadh Ibrahim Faizi',
  'A master of Arabic linguistics with expertise in Nahw (Grammar) and Sarf (Morphology). He has been instrumental in developing curricula that make classical Arabic accessible to modern students. His innovative teaching methods blend traditional pedagogy with contemporary educational techniques.',
  'Ustadh',
  'Nahw & Sarf',
  15
),
(
  'Qari Ahmad Hasan Musliyar',
  'A renowned Qari and scholar of Tafsir with deep expertise in Quranic sciences. He carries an unbroken chain of transmission (Isnad) in Quranic recitation. His tafsir classes illuminate the deeper meanings of the Quran, connecting classical commentary with contemporary understanding.',
  'Qari',
  'Tafsir & Quran',
  30
);

-- ─── Kutub (Classical Texts) ───
INSERT INTO kutub (title, arabic_title, category, description, is_featured) VALUES
(
  'Fathul Mueen',
  'فتح المعين',
  'Fiqh',
  'One of the most studied texts in Shafi''i jurisprudence, authored by Zainuddin al-Malibari. This comprehensive manual covers the entire spectrum of Islamic law from purification and prayer to transactions and family law. It remains the cornerstone text of traditional Dars education in Kerala.',
  true
),
(
  'Aqeedatut-Tahawiyyah',
  'العقيدة الطحاوية',
  'Aqidah',
  'A seminal creed composed by Imam Abu Ja''far at-Tahawi, summarizing the beliefs of Ahl al-Sunnah wal-Jama''ah. This concise text has been a standard reference for Islamic theology for over a millennium, studied and commented upon by scholars across the Muslim world.',
  true
),
(
  'Alfiyyah Ibn Malik',
  'ألفية ابن مالك',
  'Nahw',
  'The magnum opus of Arabic grammar in verse form, composed by Ibn Malik. Its 1000 lines of poetry encapsulate the entire science of Arabic syntax, making it the gold standard for grammar studies in traditional Islamic seminaries worldwide.',
  true
),
(
  'Riyadhus Saliheen',
  'رياض الصالحين',
  'Hadith',
  'Compiled by Imam an-Nawawi, this beloved collection organizes prophetic traditions thematically to guide Muslims in their daily lives. Covering topics from sincerity and repentance to social etiquette and remembrance of Allah, it remains one of the most widely-read hadith compilations.',
  false
),
(
  'Tafsir al-Jalalayn',
  'تفسير الجلالين',
  'Tafsir',
  'A concise yet comprehensive Quranic commentary authored by two Jalals — Jalal al-Din al-Mahalli and his student Jalal al-Din al-Suyuti. Known for its clarity and brevity, it is typically the first tafsir text studied in traditional Dars curricula.',
  false
),
(
  'Hidayatul Mustafeed',
  'هداية المستفيد',
  'Fiqh',
  'A widely-studied manual of Shafi''i fiqh in Kerala''s traditional educational system. This text provides detailed rulings on worship, transactions, and personal status law with clear explanations that make it accessible to intermediate students.',
  false
),
(
  'Minhajul Abidin',
  'منهاج العابدين',
  'Tasawwuf',
  'Imam al-Ghazali''s guide for the seekers of the spiritual path. This text outlines seven stages of spiritual development, addressing the obstacles and means of progress on the journey toward Allah. A cornerstone of Islamic spirituality studies.',
  false
),
(
  'Al-Waraqat',
  'الورقات',
  'Usul al-Fiqh',
  'A foundational primer on Islamic legal theory by Imam al-Juwayni. Despite its brevity, this text covers the essential principles of jurisprudence and has been a standard introductory text in Islamic seminaries for centuries.',
  false
),
(
  'Nukhbatul Fikr',
  'نخبة الفكر',
  'Hadith',
  'A masterful treatise on hadith methodology by Ibn Hajar al-Asqalani. This compact text provides a systematic classification of hadith types and evaluative criteria, serving as the gateway to advanced hadith criticism.',
  false
),
(
  'Ar-Rahbiyyah',
  'الرحبية',
  'Fiqh',
  'A classical text on Islamic inheritance law (Ilm al-Faraid) in didactic verse form by al-Rahbi. This poem covers the precise rules of distributing inheritance according to the Quran and Sunnah, making complex mathematical principles memorable.',
  false
),
(
  'Sullam al-Mantiq',
  'سلم المنطق',
  'Mantiq',
  'A widely-studied introductory text on formal logic in verse form. It covers the basics of definitions, propositions, and syllogisms as they are understood and applied in the Islamic scholarly tradition.',
  false
),
(
  'Jawahirul Balagha',
  'جواهر البلاغة',
  'Balagha',
  'An essential text in Arabic rhetoric covering the three branches of Balagha: Ma''ani (meanings), Bayan (clarity), and Badi'' (embellishment). This text trains students to appreciate the linguistic miraculousness of the Quran.',
  false
);

-- ─── Courses ───
-- We reference instructors and kutub by name-matching subqueries since we don't know the UUIDs

INSERT INTO courses (title, description, instructor_id, kutub_id, price, is_free, status, difficulty, duration_minutes, enrollment_count) VALUES
(
  'Complete Fathul Mueen — Shafi''i Fiqh Masterclass',
  'A comprehensive, chapter-by-chapter study of Fathul Mueen, the definitive Shafi''i jurisprudence manual. This course covers purification (Taharah), prayer (Salah), fasting (Siyam), Zakat, and Hajj with detailed explanations and practical applications. Ideal for intermediate students with basic Arabic knowledge.',
  (SELECT id FROM instructors WHERE name LIKE '%Faizal%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Fathul Mueen' LIMIT 1),
  0, true, 'published', 'intermediate', 2400, 47
),
(
  'Aqeedatut-Tahawiyyah — Foundations of Belief',
  'Explore the core tenets of Sunni theology through this systematic study of Imam Tahawi''s celebrated creed. Each session carefully unpacks a set of articles, tracing their roots in the Quran and Sunnah while addressing historical and contemporary theological discussions.',
  (SELECT id FROM instructors WHERE name LIKE '%Faizal%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Aqeedatut-Tahawiyyah' LIMIT 1),
  0, true, 'published', 'beginner', 960, 82
),
(
  'Alfiyyah Ibn Malik — Mastering Arabic Grammar',
  'A deep dive into the 1000 lines of Ibn Malik''s grammar poem. This advanced course equips students with the tools to read and understand classical Arabic texts independently. Each session covers a chapter of the Alfiyyah with extensive practice exercises.',
  (SELECT id FROM instructors WHERE name LIKE '%Ibrahim%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Alfiyyah Ibn Malik' LIMIT 1),
  29.99, false, 'published', 'advanced', 3600, 23
),
(
  'Riyadhus Saliheen — Gardens of the Righteous',
  'A heartfelt journey through Imam Nawawi''s timeless collection of prophetic traditions. This course covers selected chapters with deep commentary on each hadith, emphasizing practical application in daily life. Perfect for all levels.',
  (SELECT id FROM instructors WHERE name LIKE '%Rasheed%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Riyadhus Saliheen' LIMIT 1),
  0, true, 'published', 'beginner', 1800, 125
),
(
  'Tafsir al-Jalalayn — Understanding the Quran',
  'A verse-by-verse study of the Quran using the widely-studied commentary of the two Jalals. Students will gain a foundational understanding of Quranic interpretation (Tafsir) methodology and the deeper meanings behind the divine text.',
  (SELECT id FROM instructors WHERE name LIKE '%Ahmad%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Tafsir al-Jalalayn' LIMIT 1),
  19.99, false, 'published', 'intermediate', 4800, 35
),
(
  'Introduction to Usul al-Fiqh — Al-Waraqat',
  'A beginner-friendly introduction to Islamic legal theory through Imam al-Juwayni''s concise primer. Learn how scholars derive rulings from the Quran and Sunnah, and understand the principles behind Islamic jurisprudence.',
  (SELECT id FROM instructors WHERE name LIKE '%Faizal%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Al-Waraqat' LIMIT 1),
  0, true, 'published', 'beginner', 720, 58
),
(
  'Minhajul Abidin — The Path of the Seekers',
  'A spiritual journey through Imam al-Ghazali''s seven stages of the spiritual path. This course combines traditional text study with reflective exercises, guiding students toward inner transformation and nearness to Allah.',
  (SELECT id FROM instructors WHERE name LIKE '%Rasheed%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Minhajul Abidin' LIMIT 1),
  14.99, false, 'draft', 'intermediate', 1200, 0
),
(
  'Hadith Methodology — Nukhbatul Fikr',
  'An advanced course on the science of hadith criticism. Students will learn to classify hadith narrations, evaluate chains of transmission, and understand the nuanced terminology used by hadith scholars throughout Islamic history.',
  (SELECT id FROM instructors WHERE name LIKE '%Rasheed%' LIMIT 1),
  (SELECT id FROM kutub WHERE title = 'Nukhbatul Fikr' LIMIT 1),
  24.99, false, 'draft', 'advanced', 1500, 0
);

-- ─── Course Sessions (for published courses only) ───

-- Sessions for: Complete Fathul Mueen
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Introduction to Fathul Mueen & Its Author', 1, 45, 'Overview of the text, its author Zainuddin al-Malibari, and the methodology of study.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Taharah — Purification (Part 1)', 2, 55, 'Types of water, removing impurities, and the conditions of wudu.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Taharah — Purification (Part 2)', 3, 50, 'Ghusl, Tayammum, and menstrual rulings.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Salah — Prayer Essentials', 4, 60, 'Conditions, pillars, and obligations of the five daily prayers.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Salah — Congregational Prayer & Jumu''ah', 5, 50, 'Rules of congregational prayer, Friday prayer, and Eid prayers.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Siyam — Fasting', 6, 45, 'Obligations, invalidators, and virtues of fasting in Ramadan and beyond.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Zakat — Obligatory Charity', 7, 50, 'Types of wealth subject to zakat, calculation methods, and distribution.'),
((SELECT id FROM courses WHERE title LIKE '%Fathul Mueen%' LIMIT 1), 'Kitab al-Hajj — Pilgrimage', 8, 55, 'The rituals of Hajj and Umrah explained step by step.');

-- Sessions for: Aqeedatut-Tahawiyyah
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'Introduction: Who Was Imam Tahawi?', 1, 40, 'The life, era, and scholarly legacy of Imam Abu Ja''far at-Tahawi.'),
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'The Oneness of Allah (Tawhid)', 2, 50, 'The divine attributes and the meaning of monotheism in Islamic theology.'),
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'Belief in the Angels & Scriptures', 3, 45, 'The nature of angels, divine books, and their role in Islamic belief.'),
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'Prophethood & the Seal of Prophets', 4, 50, 'The concept of prophethood, miracles, and the finality of Prophethood.'),
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'The Last Day & Divine Decree', 5, 55, 'Eschatology in Islam — resurrection, judgment, and destiny.'),
((SELECT id FROM courses WHERE title LIKE '%Tahawiyyah%' LIMIT 1), 'Faith (Iman) — Its Definition & Components', 6, 45, 'The nature of faith, its increase and decrease, and the status of sinners.');

-- Sessions for: Alfiyyah Ibn Malik
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Alfiyyah%' LIMIT 1), 'Introduction to the Alfiyyah & Arabic Grammar', 1, 60, 'Overview of the poem, its author, and the landscape of Arabic grammatical sciences.'),
((SELECT id FROM courses WHERE title LIKE '%Alfiyyah%' LIMIT 1), 'Al-Kalam — Types of Speech', 2, 55, 'Nouns, verbs, particles, and the structure of Arabic sentences.'),
((SELECT id FROM courses WHERE title LIKE '%Alfiyyah%' LIMIT 1), 'Al-Mu''rab wal-Mabni — Declinable & Indeclinable Words', 3, 60, 'Understanding i''rab and the grammatical case system.'),
((SELECT id FROM courses WHERE title LIKE '%Alfiyyah%' LIMIT 1), 'An-Nakirah wal-Ma''rifah — Indefinite & Definite Nouns', 4, 55, 'Definiteness, the definite article, and types of proper nouns.'),
((SELECT id FROM courses WHERE title LIKE '%Alfiyyah%' LIMIT 1), 'Al-Mubtada wal-Khabar — Subject & Predicate', 5, 60, 'The nominal sentence, its components, and advanced formations.');

-- Sessions for: Riyadhus Saliheen
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Sincerity (Ikhlas)', 1, 40, 'Hadiths on the importance of pure intention in all deeds.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Repentance (Tawbah)', 2, 45, 'Prophetic guidance on seeking forgiveness and returning to Allah.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Patience (Sabr)', 3, 40, 'Hadiths on endurance, contentment, and trust in Allah''s decree.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Truthfulness (Sidq)', 4, 35, 'The virtue of truthfulness and warnings against lying.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Knowledge (Ilm)', 5, 50, 'Hadiths on the merit of seeking knowledge and teaching it.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Good Manners (Adab)', 6, 45, 'Prophetic etiquette in social interactions, eating, and worship.'),
((SELECT id FROM courses WHERE title LIKE '%Riyadhus%' LIMIT 1), 'The Book of Dhikr — Remembrance of Allah', 7, 40, 'Hadiths on the virtues and forms of remembering Allah.');

-- Sessions for: Tafsir al-Jalalayn
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Introduction to Tafsir Sciences', 1, 50, 'What is Tafsir? Types, methodology, and the authority of the Jalalayn.'),
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Surah Al-Fatihah — The Opening', 2, 45, 'Detailed commentary on the most recited chapter of the Quran.'),
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Surah Al-Baqarah — The Cow (Part 1)', 3, 60, 'Verses on guidance, hypocrisy, and the story of Adam.'),
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Surah Al-Baqarah — The Cow (Part 2)', 4, 60, 'Verses on Ibrahim, the Qiblah, and fasting.'),
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Surah Al-Baqarah — The Cow (Part 3)', 5, 55, 'Verses on Hajj, commerce, and Ayatul Kursi.'),
((SELECT id FROM courses WHERE title LIKE '%Jalalayn%' LIMIT 1), 'Surah Al-''Imran — The Family of ''Imran', 6, 55, 'Commentary on the Battle of Uhud, Maryam, and Isa (AS).');

-- Sessions for: Introduction to Usul al-Fiqh
INSERT INTO course_sessions (course_id, title, session_order, duration_minutes, description) VALUES
((SELECT id FROM courses WHERE title LIKE '%Waraqat%' LIMIT 1), 'What is Usul al-Fiqh?', 1, 35, 'The definition, scope, and importance of Islamic legal theory.'),
((SELECT id FROM courses WHERE title LIKE '%Waraqat%' LIMIT 1), 'Sources of Islamic Law', 2, 45, 'Quran, Sunnah, Ijma'', and Qiyas as the four primary sources.'),
((SELECT id FROM courses WHERE title LIKE '%Waraqat%' LIMIT 1), 'Al-Amr wan-Nahy — Commands & Prohibitions', 3, 40, 'Understanding how commands and prohibitions create legal rulings.'),
((SELECT id FROM courses WHERE title LIKE '%Waraqat%' LIMIT 1), 'Al-''Aam wal-Khass — General & Specific', 4, 40, 'How general texts are specified and restricted by other evidence.'),
((SELECT id FROM courses WHERE title LIKE '%Waraqat%' LIMIT 1), 'Ijtihad & Taqlid — Independent Reasoning & Following', 5, 50, 'The qualifications of a mujtahid and the permissibility of following scholars.');

-- ─── Announcements ───
INSERT INTO announcements (title, body, type, target_audience, is_active) VALUES
(
  'Welcome to Suffa Online  Dars Platform',
  'Assalamu Alaikum! We are delighted to welcome you to the Alathurpadi Dars online learning platform. Explore our courses and begin your journey into classical Islamic scholarship.',
  'info',
  'all',
  true
),
(
  'New Course: Alfiyyah Ibn Malik Now Available',
  'Our advanced Arabic Grammar course covering the complete Alfiyyah has been published. Enroll now to master the foundations of Arabic syntax with Ustadh Ibrahim Faizi.',
  'success',
  'students',
  true
),
(
  'Ramadan Special — All Courses Free During Ramadan',
  'In the spirit of the blessed month, we are offering free access to all courses. Use this opportunity to deepen your knowledge and strengthen your connection with the Quran.',
  'info',
  'all',
  true
);
