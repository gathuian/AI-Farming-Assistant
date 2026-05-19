import React, { useState, useEffect } from 'react';
import { BlogPost, CommunityQuestion, BlogComment, CommunityAnswer } from '../types';
import { INITIAL_BLOGS, INITIAL_QUESTIONS } from '../data';
import { Volume2, Heart, MessageSquare, Plus, CheckCircle2, User, Image, PlusCircle } from 'lucide-react';

interface BlogViewProps {
  speakText: (text: string, force?: boolean) => void;
}

export default function BlogView({ speakText }: BlogViewProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [questions, setQuestions] = useState<CommunityQuestion[]>([]);

  // Blog creation forms
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogCategory, setBlogCategory] = useState<'crop' | 'livestock' | 'business' | 'other'>('crop');
  const [blogContent, setBlogContent] = useState('');
  const [blogImagePreset, setBlogImagePreset] = useState('https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80');

  // Question creation forms
  const [showQForm, setShowQForm] = useState(false);
  const [qTopic, setQTopic] = useState('');
  const [qQuestion, setQQuestion] = useState('');
  const [qAuthor, setQAuthor] = useState('');

  // Comment & Answer states
  const [commentsInputs, setCommentsInputs] = useState<Record<string, string>>({});
  const [answersInputs, setAnswersInputs] = useState<Record<string, string>>({});
  const [activeBlogComments, setActiveBlogComments] = useState<string | null>(null);

  useEffect(() => {
    const savedBlogs = localStorage.getItem('farming_blogs');
    const savedQuestions = localStorage.getItem('farming_questions');

    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      setBlogs(INITIAL_BLOGS);
      localStorage.setItem('farming_blogs', JSON.stringify(INITIAL_BLOGS));
    }

    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      setQuestions(INITIAL_QUESTIONS);
      localStorage.setItem('farming_questions', JSON.stringify(INITIAL_QUESTIONS));
    }
  }, []);

  const saveBlogs = (updated: BlogPost[]) => {
    setBlogs(updated);
    localStorage.setItem('farming_blogs', JSON.stringify(updated));
  };

  const saveQuestions = (updated: CommunityQuestion[]) => {
    setQuestions(updated);
    localStorage.setItem('farming_questions', JSON.stringify(updated));
  };

  // Like a Blog
  const handleLikeBlog = (id: string, title: string) => {
    const next = blogs.map(b => {
      if (b.id === id) {
        return { ...b, likes: b.likes + 1 };
      }
      return b;
    });
    saveBlogs(next);
    speakText(`Upvoted list article: ${title}`, true);
  };

  // Submit Blog
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) return;

    const newBlog: BlogPost = {
      id: 'blog_' + Date.now(),
      title: blogTitle,
      author: blogAuthor || 'Anonymous Farmer',
      category: blogCategory,
      content: blogContent,
      image: blogImagePreset,
      likes: 1,
      comments: [],
      createdAt: new Date().toISOString()
    };

    const next = [newBlog, ...blogs];
    saveBlogs(next);
    setShowBlogForm(false);
    
    // Clear
    setBlogTitle('');
    setBlogAuthor('');
    setBlogContent('');
    
    speakText(`Success! Published your story: ${blogTitle}`, true);
  };

  // Submit Comment to blog
  const handleCommentSubmit = (blogId: string) => {
    const textBox = commentsInputs[blogId];
    if (!textBox || !textBox.trim()) return;

    const newComment: BlogComment = {
      id: 'com_' + Date.now(),
      author: 'Farmer peer',
      comment: textBox,
      createdAt: new Date().toISOString()
    };

    const next = blogs.map(b => {
      if (b.id === blogId) {
        return { ...b, comments: [...b.comments, newComment] };
      }
      return b;
    });

    saveBlogs(next);
    setCommentsInputs({ ...commentsInputs, [blogId]: '' });
    speakText("Added comment, thank you!", true);
  };

  // Ask Question
  const handleQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qTopic.trim() || !qQuestion.trim()) return;

    const newQ: CommunityQuestion = {
      id: 'q_' + Date.now(),
      topic: qTopic,
      question: qQuestion,
      author: qAuthor || 'Anonymous Agronomist',
      answers: [],
      createdAt: new Date().toISOString()
    };

    const next = [newQ, ...questions];
    saveQuestions(next);
    setShowQForm(false);
    
    // Clear
    setQTopic('');
    setQQuestion('');
    setQAuthor('');

    speakText(`Congratulations. Published your question topic: ${qTopic}`, true);
  };

  // Answer thread
  const handleAnswerSubmit = (qId: string) => {
    const text = answersInputs[qId];
    if (!text || !text.trim()) return;

    const newAns: CommunityAnswer = {
      id: 'ans_' + Date.now(),
      author: 'Farmer Advisor',
      answer: text,
      likes: 1,
      createdAt: new Date().toISOString()
    };

    const next = questions.map(q => {
      if (q.id === qId) {
        return { ...q, answers: [...q.answers, newAns] };
      }
      return q;
    });

    saveQuestions(next);
    setAnswersInputs({ ...answersInputs, [qId]: '' });
    speakText("Answer submitted successfully. Peer nodes notified!", true);
  };

  // Upvote Answer
  const handleLikeAnswer = (qId: string, ansId: string) => {
    const next = questions.map(q => {
      if (q.id === qId) {
        const nextAns = q.answers.map(a => {
          if (a.id === ansId) {
            return { ...a, likes: a.likes + 1 };
          }
          return a;
        });
        return { ...q, answers: nextAns };
      }
      return q;
    });
    saveQuestions(next);
    speakText("Liked helpful answer.", true);
  };

  return (
    <div className="space-y-8" id="blog-community-sections">
      
      {/* Visual intro card */}
      <div className="bg-white border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
        <div className="p-4 bg-emerald-100 rounded-full text-emerald-800">
          <MessageSquare className="w-10 h-10" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-bold font-sans text-slate-800">
            🌾 Peer-to-Peer Farmer Forum & Live Blog
          </h3>
          <p className="text-xs text-slate-505 font-sans leading-relaxed">
            Write guides about your agricultural successes, and answer topics or questions posted by fellow local farmers.
          </p>
          <button
            onClick={() => speakText("This is the farmers discussion board. Left column, read and post tips. Right column, ask questions and answer your neighbor's worries.", true)}
            className="px-3.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border font-bold rounded-lg flex items-center gap-1.5 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Hear Forum Overview
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Blog column (left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-bold text-slate-800 font-sans text-lg flex items-center gap-1">
              📝 Farmer Stories & Blogs
            </h4>
            <button
              id="write-blog-modal-btn"
              onClick={() => {
                setShowBlogForm(!showBlogForm);
                speakText("Write blog form loaded on screen.", true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Write custom Story
            </button>
          </div>

          {/* New Blog Form (collapsible) */}
          {showBlogForm && (
            <form onSubmit={handleBlogSubmit} className="bg-slate-50 border p-5 rounded-2xl space-y-4 animate-fade-in" id="new-blog-form">
              <h5 className="font-bold text-xs uppercase text-slate-550 border-b pb-2">✍️ Compose New Article</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    maxLength={35}
                    placeholder="e.g. Mama John (Nakuru)"
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                  />
                </div>
                <div className="space-y-1 font-sans">
                  <label className="text-[10px] font-bold text-slate-60s uppercase">Article Category</label>
                  <select
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none"
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value as any)}
                  >
                    <option value="crop">Crops & Plant Planting</option>
                    <option value="livestock">Dairy & Livestock</option>
                    <option value="business">Agribusiness Value</option>
                    <option value="other">General Farm Info</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Blog Title</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g., Simple manual composting using maize husks"
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
              </div>

              {/* cover image selections */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] font-bold text-slate-600 uppercase block">Select Cover Illustration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: '🌱 Crop composting', url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80' },
                    { name: '🐓 Fresh Eggs list', url: 'https://images.unsplash.com/photo-1518013002798-e0377dbad8b7?auto=format&fit=crop&w=600&q=80' },
                    { name: '🐄 Cow silage unit', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80' }
                  ].map((imgItem, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBlogImagePreset(imgItem.url)}
                      className={`p-1.5 border rounded-lg text-center text-[10px] leading-tight flex flex-col items-center gap-1 ${
                        blogImagePreset === imgItem.url ? 'bg-emerald-50 border-emerald-505 font-bold' : 'bg-white'
                      }`}
                    >
                      <span>{imgItem.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Write Your Story/Method</label>
                <textarea
                  required
                  placeholder="Explain exactly how you succeeded, what seeds you used, what vaccines you injected, or how you cut milk waste..."
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white h-24 resize-none"
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-755 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Publish Story on Board
              </button>
            </form>
          )}

          {/* Blogs list */}
          <div className="space-y-6">
            {blogs.map((b) => (
              <div key={b.id} className="bg-white border md:border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4 font-sans">
                <div className="flex gap-4 items-start">
                  <img
                    alt="cover"
                    src={b.image}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl"
                  />
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border">
                      {b.category}
                    </span>
                    <h5 className="font-extrabold text-slate-800 text-sm leading-tight">{b.title}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">By {b.author}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium whitespace-pre-wrap">{b.content}</p>

                {/* upvoting & comments action tabs */}
                <div className="flex items-center gap-4 border-t pt-3.5 text-xs text-slate-405 font-sans font-bold">
                  <button
                    onClick={() => handleLikeBlog(b.id, b.title)}
                    className="flex items-center gap-1 hover:text-rose-600 transition"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                    <span>Helpful ({b.likes})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveBlogComments(activeBlogComments === b.id ? null : b.id);
                      speakText(`Showing comments list.`, true);
                    }}
                    className="flex items-center gap-1 hover:text-emerald-700 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Peer comments ({b.comments.length})</span>
                  </button>

                  <button
                    onClick={() => speakText(`Article summary: ${b.title}. Written by ${b.author}. ${b.content.slice(0, 100)}`, true)}
                    className="ml-auto text-emerald-800 hover:underline flex items-center gap-1 text-[11px]"
                    title="Speak story out aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak Story
                  </button>
                </div>

                {/* Sub Comments list section */}
                {activeBlogComments === b.id && (
                  <div className="pt-3 border-t space-y-3 font-sans animate-fade-in">
                    <div className="space-y-2">
                      {b.comments.map((cm) => (
                        <div key={cm.id} className="p-2.5 bg-slate-50 rounded-xl text-[11px] font-sans">
                          <strong className="text-slate-700 font-bold block">{cm.author}</strong>
                          <span className="text-slate-600 leading-relaxed">{cm.comment}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write dynamic reply..."
                        className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                        value={commentsInputs[b.id] || ''}
                        onChange={(e) => setCommentsInputs({ ...commentsInputs, [b.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(b.id)}
                      />
                      <button
                        onClick={() => handleCommentSubmit(b.id)}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Q&A column (right) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h4 className="font-bold text-slate-800 font-sans text-lg flex items-center gap-1">
              ❓ Farmers Q&A Forum
            </h4>
            <button
              id="ask-q-modal-btn"
              onClick={() => {
                setShowQForm(!showQForm);
                speakText("Ask question form loaded on screen.", true);
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold rounded-xl flex items-center gap-1 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4 animate-spin-once" /> Ask Peer
            </button>
          </div>

          {/* Ask question form */}
          {showQForm && (
            <form onSubmit={handleQSubmit} className="bg-amber-50/15 border border-amber-100 p-5 rounded-2xl space-y-4 animate-fade-in" id="new-q-form">
              <h5 className="font-bold text-xs uppercase text-amber-900 border-b border-amber-50 pb-2">❓ Post Question to Community</h5>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Farmer George"
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none"
                  value={qAuthor}
                  onChange={(e) => setQAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase">What is your problem? (Topic)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato flowers falling before fruit grows"
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none font-bold"
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-650 uppercase">Describe what happened detailed</label>
                <textarea
                  required
                  placeholder="Tell us what fertilizer you added, visual disease symptoms, weather temperature..."
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white h-20 resize-none"
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-705 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-300" /> Ask Question Now
              </button>
            </form>
          )}

          {/* Questions thread list */}
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-white border rounded-2xl p-5 shadow-sm space-y-3 font-sans">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Posted by: {q.author}</span>
                  <h5 className="font-bold text-slate-800 text-xs leading-tight">{q.topic}</h5>
                  <p className="text-[11px] text-slate-650 font-sans">{q.question}</p>
                </div>

                {/* Speak Question */}
                <button
                  onClick={() => speakText(`Farmer ${q.author} asks: ${q.topic}. ${q.question}`, true)}
                  className="text-[10px] font-bold text-slate-400 hover:text-emerald-850 flex items-center gap-1 pb-2 border-b"
                >
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Hear Question Voiceover
                </button>

                {/* Answers list */}
                {q.answers.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold uppercase font-mono text-emerald-800">💡 Peer Answers ({q.answers.length})</span>
                    {q.answers.map((ans) => (
                      <div key={ans.id} className="p-3 bg-slate-50 rounded-xl space-y-1 font-sans border border-slate-100">
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-405 font-bold">
                          <span>By {ans.author}</span>
                          <button
                            onClick={() => handleLikeAnswer(q.id, ans.id)}
                            className="text-slate-400 hover:text-red-500 font-bold"
                          >
                            ⭐ Helpful ({ans.likes})
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-700 leading-relaxed font-sans font-medium">{ans.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add answer form inline */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write answer instructions..."
                    className="flex-1 px-3 py-1.5 border rounded-lg text-[11px] font-sans"
                    value={answersInputs[q.id] || ''}
                    onChange={(e) => setAnswersInputs({ ...answersInputs, [q.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit(q.id)}
                  />
                  <button
                    onClick={() => handleAnswerSubmit(q.id)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                  >
                    Answer
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
