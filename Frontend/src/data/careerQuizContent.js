// Career Discovery Quiz content, split by the young person's registered
// educational level (see accounts.YouthProfile.EducationLevel on the
// backend). SHS and Tertiary share one quiz (unchanged from the original
// single-quiz design) since both resolve to the same trait-keyed
// CareerPath/tertiary-institution recommendations; JHS and Primary get
// their own age-appropriate question banks and next-level guidance.
//
// Every question bank tags each option with one of the same 5 trait keys
// so all three tracks can share one scoring function (see computeTopTrait).

export const SHS_TERTIARY_QUESTIONS = [
  {
    category: 'Activities You Enjoy',
    question: 'Which activity do you enjoy the most?',
    options: [
      { icon: 'query_stats', title: 'Solving puzzles, coding, or analyzing problems', trait: 'TECH' },
      { icon: 'groups', title: 'Helping and supporting people', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Designing, writing, or creating content', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Leading teams or organizing projects', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building, repairing, or working with tools', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'School Subjects',
    question: 'Which school subjects do you enjoy the most?',
    options: [
      { icon: 'query_stats', title: 'Mathematics, Computer Science, or Physics', trait: 'TECH' },
      { icon: 'groups', title: 'Biology, Health Science, or Psychology', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Literature, Art, or Music', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Business, Economics, or Accounting', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Technical Drawing, Engineering, or Agriculture', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Makes You Happy',
    question: 'What kind of work would make you happiest?',
    options: [
      { icon: 'query_stats', title: 'Solving technical or scientific problems', trait: 'TECH' },
      { icon: 'groups', title: "Helping people improve their lives", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creating new ideas, designs, or stories', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Managing people or running a business', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Designing, building, or fixing things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Problem-Solving Style',
    question: 'How do you usually solve problems?',
    options: [
      { icon: 'query_stats', title: 'Analyze the situation carefully and find a logical solution', trait: 'TECH' },
      { icon: 'groups', title: 'Talk to people and work together to find a solution', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Think creatively and try new ideas', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Take charge and make decisions quickly', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Learn by doing and experimenting', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Your Personality',
    question: 'Which of these best describes your personality?',
    options: [
      { icon: 'query_stats', title: 'Curious and analytical', trait: 'TECH' },
      { icon: 'groups', title: 'Caring and compassionate', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creative and imaginative', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Confident and ambitious', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Practical and hands-on', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Work Environment',
    question: 'What type of work environment do you prefer?',
    options: [
      { icon: 'query_stats', title: 'Technology company or office', trait: 'TECH' },
      { icon: 'groups', title: 'Hospital, school, or community organization', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creative studio or media company', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Corporate office or business environment', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Workshop, laboratory, construction site, or outdoors', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Fulfills You',
    question: 'Which achievement would make you feel most fulfilled?',
    options: [
      { icon: 'query_stats', title: 'Creating technology that solves real-world problems', trait: 'TECH' },
      { icon: 'groups', title: "Improving someone's life through healthcare, teaching, or counselling", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Producing creative work that inspires others', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Building a successful business or leading an organization', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Designing or constructing something useful', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Your Strengths',
    question: 'Which skill do people compliment you on the most?',
    options: [
      { icon: 'query_stats', title: 'Logical thinking and problem-solving', trait: 'TECH' },
      { icon: 'groups', title: 'Kindness and communication', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creativity and imagination', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Leadership and decision-making', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Practical or technical abilities', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Motivates You',
    question: 'What motivates you most in a career?',
    options: [
      { icon: 'query_stats', title: 'Innovation and solving complex challenges', trait: 'TECH' },
      { icon: 'groups', title: "Making a positive impact on people's lives", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Expressing creativity and originality', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Financial success and leadership opportunities', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building practical solutions that improve everyday life', trait: 'PRACTICAL' },
    ],
  },
]

export const SHS_TERTIARY_RESULTS = {
  TECH: {
    title: 'Technology & Computing Careers',
    icon: 'query_stats',
    desc: 'You enjoy logical thinking and solving complex problems. Consider software engineering, data science, cybersecurity, or AI-related roles.',
  },
  PEOPLE: {
    title: 'Healthcare, Education & Social Services',
    icon: 'groups',
    desc: "You're driven to support and uplift others. Consider healthcare, teaching, counselling, or community and social work roles.",
  },
  CREATIVE: {
    title: 'Arts, Media & Design Careers',
    icon: 'palette',
    desc: 'You think imaginatively and enjoy creating. Consider design, media production, writing, or the arts.',
  },
  BUSINESS: {
    title: 'Business, Finance & Entrepreneurship',
    icon: 'trending_up',
    desc: "You're motivated by leading, organizing, and building. Consider entrepreneurship, business management, finance, or marketing roles.",
  },
  PRACTICAL: {
    title: 'Engineering, Construction & Agriculture',
    icon: 'handyman',
    desc: 'You like hands-on, practical work building and fixing real things. Consider engineering, construction trades, or agricultural careers.',
  },
}

export const JHS_QUESTIONS = [
  {
    category: 'Subjects You Enjoy',
    question: 'Which subject do you enjoy the most at school?',
    options: [
      { icon: 'query_stats', title: 'Mathematics, ICT, or Integrated Science', trait: 'TECH' },
      { icon: 'groups', title: 'Social Studies or Religious & Moral Education', trait: 'PEOPLE' },
      { icon: 'palette', title: 'English, Creative Arts, or French', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Business or Career Technology (trade-focused)', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Basic Design & Technology (BDT) or Pre-Technical Skills', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Activities You Enjoy',
    question: 'What do you enjoy doing most in your free time?',
    options: [
      { icon: 'query_stats', title: 'Solving puzzles or exploring how gadgets and apps work', trait: 'TECH' },
      { icon: 'groups', title: 'Helping and spending time with friends and family', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Drawing, singing, or telling stories', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Organizing games or small trading with friends', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building, repairing, or making things with your hands', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Natural Strengths',
    question: 'What are you naturally good at?',
    options: [
      { icon: 'query_stats', title: 'Working with numbers and logical thinking', trait: 'TECH' },
      { icon: 'groups', title: 'Listening to and caring for people', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Imagination and creativity', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Leading and convincing others', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Using your hands to make or fix things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Problem-Solving Style',
    question: 'When you face a problem, what do you usually do?',
    options: [
      { icon: 'query_stats', title: 'Think it through step by step', trait: 'TECH' },
      { icon: 'groups', title: 'Talk to someone about it and ask for help', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Come up with a new, creative idea', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Take charge and decide quickly', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Try it out with your hands until it works', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Technology Interest',
    question: 'How do you feel about computers and technology?',
    options: [
      { icon: 'query_stats', title: 'I love exploring how they work', trait: 'TECH' },
      { icon: 'groups', title: 'I like using them to connect with people', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I like using them to create art, music, or videos', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I like using them for business or selling things', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I prefer working with real tools and machines', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Communication & Leadership',
    question: 'In a group project, what role do you usually take?',
    options: [
      { icon: 'query_stats', title: 'The one who figures out the tricky part', trait: 'TECH' },
      { icon: 'groups', title: 'The peacemaker who keeps everyone happy', trait: 'PEOPLE' },
      { icon: 'palette', title: 'The one with creative ideas for how it should look', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'The leader who organizes the group', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'The one who builds or puts things together', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Science & Maths',
    question: 'How do you feel about Science and Maths?',
    options: [
      { icon: 'query_stats', title: 'I enjoy them a lot', trait: 'TECH' },
      { icon: 'groups', title: 'I prefer subjects about people and society', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I prefer subjects where I can be creative', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I prefer subjects about money and business', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I like the practical, hands-on parts best', trait: 'PRACTICAL' },
    ],
  },
]

export const JHS_PROGRAMME_RESULTS = {
  TECH: {
    title: 'General Science / Technical (ICT)',
    icon: 'query_stats',
    desc: 'Your interest in technology and problem-solving points toward General Science or a Technical programme with a computing focus. These can lead to careers like Software Engineering, Computer Science, Cybersecurity, and Information Technology at the tertiary level.',
    suggestedProgrammes: ['General Science', 'Technical (Electrical/Electronics)', 'ICT-focused Technical/Vocational'],
  },
  PEOPLE: {
    title: 'General Arts / Home Economics',
    icon: 'groups',
    desc: 'You enjoy helping and connecting with people. General Arts (with Economics/Government) or Home Economics can lead toward Healthcare, Education, Social Work, and Counselling careers.',
    suggestedProgrammes: ['General Arts', 'Home Economics'],
  },
  CREATIVE: {
    title: 'Visual Arts / General Arts',
    icon: 'palette',
    desc: 'Your creativity and imagination suit Visual Arts or General Arts, opening paths into Design, Media, Fashion, and the Creative Arts.',
    suggestedProgrammes: ['Visual Arts', 'General Arts'],
  },
  BUSINESS: {
    title: 'Business',
    icon: 'trending_up',
    desc: 'Your leadership and organizing strengths point toward the Business programme, opening paths into Accounting, Marketing, Entrepreneurship, and Management.',
    suggestedProgrammes: ['Business (Accounting/Management-in-Living)'],
  },
  PRACTICAL: {
    title: 'Technical / Vocational / Agricultural Science',
    icon: 'handyman',
    desc: 'Your hands-on, practical strengths point toward Technical, Vocational, or Agricultural Science programmes, opening paths into Engineering, Construction Trades, and Agriculture.',
    suggestedProgrammes: ['Technical', 'Agricultural Science', 'Vocational (Home Economics/Visual Arts trade)'],
  },
}

// Ghana's most consistently top-performing SHS by WASSCE results/reputation,
// spanning multiple regions (not just wherever the quiz-taker lives) since
// these are aspirational, nationally-recognized schools every JHS student
// should know about, not a "nearest school" lookup. Names match exactly
// what's seeded in accounts.Institution (Wikipedia-sourced SHS list) so a
// counsellor cross-checking the admin institution list finds the same schools.
export const TOP_SHS_INSTITUTIONS = [
  { name: "Presbyterian Boys' Secondary School (PRESEC-Legon)", region: 'Greater Accra' },
  { name: "St. Augustine's College", region: 'Central' },
  { name: 'Achimota School', region: 'Greater Accra' },
  { name: 'Opoku Ware School', region: 'Ashanti' },
  { name: 'Adisadel College', region: 'Central' },
  { name: 'Mfantsipim School', region: 'Central' },
  { name: "Wesley Girls' High School", region: 'Central' },
  { name: 'Holy Child School', region: 'Central' },
  { name: 'Prempeh College', region: 'Ashanti' },
  { name: 'Ghana National College', region: 'Central' },
]

export const PRIMARY_QUESTIONS = [
  {
    category: 'Favourite Subject',
    question: 'Which subject do you enjoy most at school?',
    options: [
      { icon: 'query_stats', title: 'Numbers and Maths', trait: 'TECH' },
      { icon: 'groups', title: 'Learning about people and the world around us', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Art and Creative Writing', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Learning about money and trading', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Making and building things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Favourite Activity',
    question: 'What do you like doing most when you play?',
    options: [
      { icon: 'query_stats', title: 'Playing with numbers, puzzles, or games on a computer/phone', trait: 'TECH' },
      { icon: 'groups', title: 'Playing and helping my friends', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Drawing, singing, or telling stories', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Playing "shop" or organizing games for my friends', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building things with blocks or fixing toys', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Numbers',
    question: 'How do you feel about counting and numbers?',
    options: [
      { icon: 'query_stats', title: 'I love numbers and solving number puzzles', trait: 'TECH' },
      { icon: 'groups', title: "I don't mind them, but I prefer talking to people", trait: 'PEOPLE' },
      { icon: 'palette', title: 'I prefer drawing pictures to counting numbers', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I like counting money and "buying and selling" games', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I like using numbers to measure and build things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Science',
    question: 'How do you feel about learning how things work?',
    options: [
      { icon: 'query_stats', title: 'I love finding out how things work', trait: 'TECH' },
      { icon: 'groups', title: 'I enjoy learning about people, animals, and plants', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I enjoy imagining and creating new things', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I enjoy learning how businesses work', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I enjoy taking things apart and putting them back together', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Helping Others',
    question: 'Do you enjoy helping people?',
    options: [
      { icon: 'query_stats', title: 'I prefer solving problems on my own', trait: 'TECH' },
      { icon: 'groups', title: 'Yes, I love helping and caring for others', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I like making things that make people happy', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I like organizing and leading my friends', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I like helping by building or fixing things for people', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Drawing & Creativity',
    question: 'Do you enjoy drawing or creative activities?',
    options: [
      { icon: 'query_stats', title: 'Not really, I prefer working things out', trait: 'TECH' },
      { icon: 'groups', title: 'I enjoy creative activities with my friends', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Yes! I love drawing, painting, and making up stories', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I like designing posters for my "shop" or games', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I like creating things with my hands, like models', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Technology',
    question: 'Do you enjoy using computers, tablets, or phones?',
    options: [
      { icon: 'query_stats', title: 'Yes, I love exploring how apps and games work', trait: 'TECH' },
      { icon: 'groups', title: 'I like using them to chat with family and friends', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I like using them to draw or make videos', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'I like using them to play trading or business games', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I prefer playing outside and building things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Speaking & Leading',
    question: 'Do you enjoy speaking up or leading your friends?',
    options: [
      { icon: 'query_stats', title: 'I prefer figuring things out quietly by myself', trait: 'TECH' },
      { icon: 'groups', title: 'I enjoy talking and being kind to everyone', trait: 'PEOPLE' },
      { icon: 'palette', title: 'I enjoy performing, singing, or acting in front of others', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Yes, I love being the leader and organizing my friends', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'I prefer showing people how to build or make things', trait: 'PRACTICAL' },
    ],
  },
]

export const PRIMARY_GUIDANCE = {
  TECH: {
    title: 'Keep Building Your Number & Tech Skills',
    icon: 'query_stats',
    desc: "You enjoy numbers, puzzles, and figuring out how things work. As you move to JHS, pay close attention to Mathematics and Integrated Science/ICT classes — they'll open doors to exciting fields like technology and engineering later on.",
    focusAreas: ['Mathematics', 'Integrated Science', 'ICT/Computing'],
  },
  PEOPLE: {
    title: 'Keep Growing Your Care for Others',
    icon: 'groups',
    desc: 'You enjoy helping and connecting with people. As you move to JHS, subjects like Social Studies, English, and Religious & Moral Education will help you build skills for careers in healthcare, teaching, and community work later on.',
    focusAreas: ['Social Studies', 'English Language', 'Religious & Moral Education'],
  },
  CREATIVE: {
    title: 'Keep Exploring Your Creativity',
    icon: 'palette',
    desc: 'You enjoy drawing, storytelling, and imaginative play. At JHS, subjects like Creative Arts and English will help you build on your creative talents for the future.',
    focusAreas: ['Creative Arts', 'English Language'],
  },
  BUSINESS: {
    title: 'Keep Developing Your Leadership',
    icon: 'trending_up',
    desc: 'You enjoy organizing, leading, and trading games. At JHS, subjects like Mathematics and Social Studies (and Career Technology options) will help build a foundation for business and leadership later on.',
    focusAreas: ['Mathematics', 'Social Studies', 'Career Technology'],
  },
  PRACTICAL: {
    title: 'Keep Building With Your Hands',
    icon: 'handyman',
    desc: 'You enjoy building, fixing, and making things. At JHS, subjects like Basic Design & Technology and Integrated Science will help you build on these practical strengths.',
    focusAreas: ['Basic Design & Technology', 'Integrated Science'],
  },
}

const DEFAULT_TRAIT = 'PEOPLE'

/** Tally each answered option's trait and return the most common one (first
 * seen wins ties). Shared across all three quiz tracks. */
export function computeTopTrait(answers, questions) {
  const tally = {}
  Object.entries(answers).forEach(([qIndex, optIndex]) => {
    const trait = questions[qIndex]?.options[optIndex]?.trait
    if (trait) tally[trait] = (tally[trait] || 0) + 1
  })
  const entries = Object.entries(tally)
  if (entries.length === 0) return DEFAULT_TRAIT
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

/** Maps a YouthProfile.EducationLevel value to which quiz to show. Anything
 * not explicitly Primary or JHS (shs, shs_graduate, tertiary,
 * dropout_re_entry, teen_mother_program, unset, or a non-youth visitor)
 * keeps today's original SHS/Tertiary quiz unchanged. */
export function getQuizTrack(educationLevel) {
  if (educationLevel === 'primary') return 'PRIMARY'
  if (educationLevel === 'jhs') return 'JHS'
  return 'SHS_TERTIARY'
}
