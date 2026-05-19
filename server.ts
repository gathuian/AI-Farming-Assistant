import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to safely obtain Gemini client
let _aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!_aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes('MY_GEMINI_API_KEY')) {
      console.warn('WARNING: GEMINI_API_KEY is not configured or holds a placeholder. Falling back to offline simulator mode.');
      throw new Error('MISSING_KEY');
    }
    _aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return _aiClient;
}

// 1. Endpoint: AI Farming Onboarding Plan Generator
app.post('/api/gemini/farming-plan', async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    res.status(400).json({ error: 'Missing profile parameters.' });
    return;
  }

  try {
    const ai = getGeminiClient();
    const prompt = `You are an expert agricultural extension officer and smart farming consultant specializing in low-literacy, high-impact guidance. 
Create a detailed, fully structured farming plan based on the following profile:
- Selected venture: ${profile.ventureType === 'both' ? 'Both Crop & Animal farming' : profile.ventureType}
- Specific goals (what they want to grow or keep): ${profile.goals}
- Land size: ${profile.landSize}
- Capital budget: $${profile.budget} (or equivalent in local currency)
- Has equipment: ${profile.hasEquipment ? 'Yes' : 'No'}
- Agronomic knowledge level: ${profile.knowledgeLevel}
- Location / Region: ${profile.location}
- Soil / Climate profile: ${profile.climate}

Deliver the response strictly in JSON format matching this schema:
{
  "guide": {
    "title": "Clean, encouraging title for the profile",
    "introduction": "Brief, simple, and warm welcome explaining what they must watch out for first in their specific region.",
    "stepByStepProcess": ["Step 1 detailed instructions in simple terms", "Step 2 detailed instructions...", "Step 3...", "Step 4..."],
    "diseasesAndPrevention": [
      {
        "name": "Disease/pest name with emojis",
        "symptoms": "Simple visual symptoms readable by beginners",
        "prevention": "Clear instructions (avoiding heavy chemicals if possible, emphasizing physical/compost methods)"
      }
    ],
    "harvestingAndStoring": "How to harvest gently without spoiling, and how to store crops or animal yields dry, clean, and safe from vermin.",
    "marketingAdvice": "Ways to sell their product locally (markets, processing plants, bulk contracts), supply/demand trends, and alternative practices.",
    "valueAdditionAgribusiness": "How to turn raw product into business (e.g., milk into cheese/yoghurt, tomatoes into ketchup/dried jars), including a simple costing breakdown.",
    "vulnerabilitiesAndTrends": "Future trends (e.g. organic farming, solar drip irrigation) and critical weather/disease vulnerabilities."
  },
  "businessPlan": {
    "title": "Smart Farm Business Setup Blueprint",
    "overview": "Explanation of how to turn $${profile.budget} into a functioning commercial farm.",
    "marketAnalysis": "A clear description of who wants to buy this item in ${profile.location}.",
    "costEstimates": [
      { "item": "Seedlings/Breeding stock", "cost": Math.round(profile.budget * 0.35) },
      { "item": "Fencing, housing & infrastructure", "cost": Math.round(profile.budget * 0.3) },
      { "item": "Vaccines, inputs, crop feed or compost", "cost": Math.round(profile.budget * 0.15) },
      { "item": "Labor, energy or local marketing", "cost": Math.round(profile.budget * 0.1) },
      { "item": "Emergency reserve saving cash", "cost": Math.round(profile.budget * 0.1) }
    ],
    "marketingStrategy": "Straightforward tips on how to sell and price their product to stand out."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            guide: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                introduction: { type: Type.STRING },
                stepByStepProcess: { type: Type.ARRAY, items: { type: Type.STRING } },
                diseasesAndPrevention: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      symptoms: { type: Type.STRING },
                      prevention: { type: Type.STRING }
                    },
                    required: ['name', 'symptoms', 'prevention']
                  }
                },
                harvestingAndStoring: { type: Type.STRING },
                marketingAdvice: { type: Type.STRING },
                valueAdditionAgribusiness: { type: Type.STRING },
                vulnerabilitiesAndTrends: { type: Type.STRING }
              },
              required: ['title', 'introduction', 'stepByStepProcess', 'diseasesAndPrevention', 'harvestingAndStoring', 'marketingAdvice', 'valueAdditionAgribusiness']
            },
            businessPlan: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                overview: { type: Type.STRING },
                marketAnalysis: { type: Type.STRING },
                costEstimates: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      cost: { type: Type.NUMBER }
                    },
                    required: ['item', 'cost']
                  }
                },
                marketingStrategy: { type: Type.STRING }
              },
              required: ['title', 'overview', 'marketAnalysis', 'costEstimates', 'marketingStrategy']
            }
          },
          required: ['guide', 'businessPlan']
        }
      }
    });

    const resultText = response.text;
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    if (error.message === 'MISSING_KEY') {
      res.status(200).json(getOfflineFarmingPlan(profile));
    } else {
      console.error('Gemini Plan Error:', error);
      res.status(500).json({ error: error.message || 'Error communicating with AI helper.' });
    }
  }
});

// 2. Endpoint: AI Weather Grounded News and Local Demand Guide
app.post('/api/gemini/weather-news', async (req, res) => {
  const { location, ventureType, goals } = req.body;
  const loc = location || 'Highland Valleys';

  try {
    const ai = getGeminiClient();
    const prompt = `Search the web and find active current regional farming info, weather forecasts, market prices, and farming news for the location: "${loc}". 
Consider that the user is interested in ${ventureType || 'farming crops and animals'} with focus on ${goals || 'sustainable yield optimization'}.

Produce a highly tailored JSON response with:
1. Current weather status (temp, simple conditions, humidity, advice for planting/protecting animals next 3 days).
2. A list of 3 recent farming news articles or local agricultural blog issues specifically relevant to region: "${loc}".
3. Strategic local market demand trends and farming alternatives (e.g. if crop tomatoes has low prices due to local oversupply, advise farming high-demand onions or chillies, or processing tomatoes to paste).

Format strictly as JSON with the following structure:
{
  "weather": {
    "temp": "Current Temperature (e.g., 22°C or 72°F)",
    "condition": "Condition summary (e.g. Rainy and windy, sunny, dry, cold)",
    "humidity": "Humidity %",
    "precipChance": "Rain chance %",
    "advice": "Simple, visual instruction for farmers (e.g., Protect nursery layers from rain. Warm brooder chicks!)",
    "location": "${loc}",
    "forecast": [
      { "day": "Day 1 (e.g., Wed)", "temp": "23°C", "condition": "Light Showers" },
      { "day": "Day 2 (e.g., Thu)", "temp": "24°C", "condition": "Sunny Intervals" },
      { "day": "Day 3 (e.g., Fri)", "temp": "21°C", "condition": "Heavy Morning Rain" }
    ]
  },
  "news": [
    {
      "title": "Title of dynamic agricultural news/blog topic from web search",
      "summary": "Farmer-friendly 2-sentence summary of what this means for their crops or animals.",
      "source": "Name of news source or site"
    }
  ],
  "alternatives": {
    "title": "Local Supply & Demand Insights",
    "demandStatus": "Description of current market supply and demand trends in ${loc}.",
    "recommendation": "Recommendations of high-value crops/livestock products with low competition or best local alternatives (e.g. switching to beetroot, pumpkin, or setting up dairy cheese making)."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.STRING },
                condition: { type: Type.STRING },
                humidity: { type: Type.STRING },
                precipChance: { type: Type.STRING },
                advice: { type: Type.STRING },
                location: { type: Type.STRING },
                forecast: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      temp: { type: Type.STRING },
                      condition: { type: Type.STRING }
                    },
                    required: ['day', 'temp', 'condition']
                  }
                }
              },
              required: ['temp', 'condition', 'advice', 'location', 'forecast']
            },
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                required: ['title', 'summary', 'source']
              }
            },
            alternatives: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                demandStatus: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              },
              required: ['title', 'demandStatus', 'recommendation']
            }
          },
          required: ['weather', 'news', 'alternatives']
        }
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    if (error.message === 'MISSING_KEY') {
      res.status(200).json(getOfflineWeatherNews(loc));
    } else {
      console.error('Gemini Weather Error:', error);
      res.status(500).json({ error: error.message || 'Error fetching weather grounded advice.' });
    }
  }
});

// 3. Endpoint: AI Custom Smart Farming Assistant (Low-literacy friendly companion chat)
app.post('/api/gemini/chat', async (req, res) => {
  const { question, location, profileType } = req.body;
  if (!question) {
    res.status(400).json({ error: 'Question content cannot be empty.' });
    return;
  }

  try {
    const ai = getGeminiClient();
    const systemInstruction = `You are "AI Elder Farmer", a friendly, extraordinarily clear, and supportive agricultural expert helper app. 
Your goal is to explain complex farming methods to users, keeping in mind some users may have limited literacy or low agricultural knowledge.
1. Use simple, humble, literal words. Emojis can add visual context (e.g., 🐄, 🍂, 💦).
2. Bullet points must be short and direct.
3. Explicitly state the exact "Do's" and "Don'ts" for their questions.
4. Avoid complex chemical formula jargon or intimidating industrial text. Keep explanations warm and easy to read.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Question from farmer in ${location || 'Rural region'}: "${question}". They farm components: ${profileType || 'crops & animals'}. Details please.`,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    if (error.message === 'MISSING_KEY') {
      res.status(200).json({ text: getOfflineChatFallback(question) });
    } else {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({ error: error.message || 'Error processing your chat request.' });
    }
  }
});

// --- OFFLINE SIMULATORS (Graceful robust fallbacks) ---

function getOfflineFarmingPlan(profile: any) {
  const isCrops = profile.ventureType === 'plants' || profile.ventureType === 'both';
  const isAnimals = profile.ventureType === 'animals' || profile.ventureType === 'both';

  return {
    guide: {
      title: `🌟 Custom Smart Plan for ${profile.location || 'Your Farm'}`,
      introduction: `Welcome to your customized farming path! Farming ${profile.goals || 'your selected crops/animals'} on ${profile.landSize || 'your land'} with a budget of $${profile.budget} is fully possible. Since your climate is ${profile.climate || 'local moderate'}, we have designed this specifically for your success, assuming organic soil feed to optimize costs.`,
      stepByStepProcess: [
        `1. Preparation: Clean ${profile.landSize} of wild grass. Mix dry leaves, manure, and water inside a compost pile. Work the fertile black compost deep into planting zones.`,
        profile.hasEquipment 
          ? `2. Equipment Setup: Since you have basic implements, maintain them well. Ensure hoes and sprayers are clean before using to limit fungal virus spreading.`
          : `2. Manual/Alternative Bed Prep: Since you do not have complex tractors, make raised dirt seedbeds using handmade hoes. This improves loose soil drainage perfectly.`,
        `3. Timing and Watering: Grow in systematic row alignments. Water twice daily (very early morning and sundown). Feed compost mulch around roots to preserve soil water during peak heat times.`,
        `4. Continuous Health Scanning: Look under crop leaves every morning. Look for spots, aphids, or animal limping and isolate sick species immediately.`
      ],
      diseasesAndPrevention: [
        {
          name: '🍂 Leaf Spotted Blight & Root Rot',
          symptoms: 'Yellow circles on oldest leaves, slow growth rates, watery roots.',
          prevention: 'Water only the roots directly. Space plants 40cm apart so the natural wind dries the leaves. Spray mild soap-and-water mix for aphids.'
        },
        {
          name: '🐛 Stalk-Boring Caterpillars',
          symptoms: 'Tiny round holes in crop stems with dry power around the stem entry.',
          prevention: 'Mix dry wood ash with a pinch of red chilli powder and dust inside leaf funnels when plants are knee-high.'
        }
      ],
      harvestingAndStoring: 'Harvest during dry hours to prevent fungus rot. Let grain maize dry thoroughly in the sun on clean sheets until kernels make dry click sounds. Maintain a raised wood storage platform away from dirt floors to exclude mice.',
      marketingAdvice: 'Form small cooperatives with 3-4 neighboring farmers to sell yields together in town markets. This reduces motorcycle transport costs and secures better wholesale prices from traders.',
      valueAdditionAgribusiness: isAnimals 
        ? 'Process fresh milk into Homemade Probiotic Yoghurt or Cultured Cream. Culturing milk doubles its shelf life from 5 hours to 10 days, and doubles your dairy income using simple boiling pots.'
        : 'Slice surplus tomatoes, carrots or fruits, and sun-dry them on wood screens. Package inside clean plastic bags to sell as dry snacks or off-season gourmet stew ingredients.',
      vulnerabilitiesAndTrends: 'Future Trend: Solar-Powered Drip Irrigation. Small low-pressure gravity drip kits cost under $40, saving 80% of watering time and providing stable yields regardless of delayed rainfall.'
    },
    businessPlan: {
      title: '📋 Simplified Financial Allocation Budget',
      overview: `A blueprint for smart capital allocation using your $${profile.budget} budget to maximize survival and yield potential.`,
      marketAnalysis: `Steady local crop/livestock demand detected in ${profile.location || 'your nearby trade nodes'}. Processing raw items yields far higher returns than raw sales.`,
      costEstimates: [
        { item: 'Certified Premium Seeds/Chicks', cost: Math.round(profile.budget * 0.35) },
        { item: 'Local Soil Feed, Manure & Bio-Pesticides', cost: Math.round(profile.budget * 0.20) },
        { item: 'Security fencing / Housing wood units', cost: Math.round(profile.budget * 0.25) },
        { item: 'Emergency vaccine reserve and tool care', cost: Math.round(profile.budget * 0.10) },
        { item: 'Local transport & direct retail marketing bags', cost: Math.round(profile.budget * 0.10) }
      ],
      marketingStrategy: 'Package clean, graded items in breathable nets with clear handwritten dates. Showcase freshness. Hand out samples to hotel kitchens to secure weekly orders.'
    }
  };
}

function getOfflineWeatherNews(location: string) {
  return {
    weather: {
      temp: '23°C / 73°F',
      condition: 'Mostly Sunny & Mild',
      humidity: '62%',
      precipChance: '15%',
      advice: '☀️ Best weather for soil turning, weed uprooting, and drying fresh feeds. Keep animals well watered under shadings!',
      location: location,
      forecast: [
        { day: 'Today', temp: '23°C', condition: 'Sunny' },
        { day: 'Tomorrow', temp: '25°C', condition: 'Warm & Clear' },
        { day: 'Next Day', temp: '22°C', condition: 'Light Evening Drizzle' }
      ]
    },
    news: [
      {
        title: '📈 Smallholder Farmers Shift to Value Addition to Beat Raw Milk Price Slumps',
        summary: 'Faced with fluctuating milk collection rates, local farming co-ops are installing yoghurt mixers and low-cost pasteurization. Net profits rose 45%.',
        source: 'Global Farming Review'
      },
      {
        title: '🌱 Organic Micro-fertilizers Showing Stable Resistance to Local Wilts',
        summary: 'A new study confirms adding dry compost mixed with natural wood ashes around seed tubers increases plant immunity against wilting diseases.',
        source: 'Sustainable Agriculture Daily'
      },
      {
        title: '💧 Gravity Drip Irrigation Kits Become Affordable for Vegetable Farmers',
        summary: 'New polymer micro-drippers work without diesel generators, letting dryland farmers grow cabbages year-round.',
        source: 'Rural Agri Innovations'
      }
    ],
    alternatives: {
      title: '💡 Smart Alternatives for Supply Stability',
      demandStatus: `High supply of raw vegetables during peak rains often causes local price drops in ${location}.`,
      recommendation: 'To beat this, consider planting high-value onions, rosemary herbs, or garlic which store dry for up to 6 months. Or start value-addition: convert extra tomatoes into canned tomato concentrates.'
    }
  };
}

function getOfflineChatFallback(question: string) {
  const q = question.toLowerCase();
  if (q.includes('disease') || q.includes('rot') || q.includes('sick') || q.includes('wilt')) {
    return `🍂 Hello! Regarding crop or animal sickness:
1. **Isolate First**: Separate sick chickens, cattle, or pull out wilting tomato stems immediately to keep germs from jumping to healthy ones.
2. **Control Humidity**: Keep animal housing dry. Avoid splashing muddy water on crop leaves.
3. **Natural Spray**: Mix 1 spoon of biological mild soap with vegetable oil in a warm water bottle, spray on aphids or whitefly pests early in the cool morning.
Do not let water gather in stagnant puddles—that is where disease mold multiplies! Let's keep our farm clean!`;
  }
  if (q.includes('money') || q.includes('budget') || q.includes('cost') || q.includes('price')) {
    return `💰 Hello! Managing money is the absolute shield of a farming business:
- **Do**: Dedicate at least 15% of your money as a reserve list. Animals can fall sick or rain can delay. Having reserve cash means you do not have to borrow at predatory high interest.
- **Do**: Weigh or measure feed precisely. Giving too much feed is wasteful; too little stunts growth. Use a cheap kitchen cup to measure poultry feed!
- **Don't**: Buy fancy machines early on. Use manual spades and build wood sheds first; let your first profits pay for major machines later.`;
  }
  return `🌾 Hello! I am your AI Elder Farmer. 
Your question is precious. To get the best yields:
- Keep soil fed with dark organic compost made from leaves and dry manure.
- Ensure your animals have access to clear drinking water under solid roof shade.
- Write down every single dollar or shilling spent in a small notepad daily.
Feel free to ask me about seeds, cattle vaccine periods, pricing, or how to turn raw milk into rich cheese easily!`;
}

// 4. Vite Dev Server Integrations and Static Asset Handlers
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Farming Assistant Server is running on port ${PORT}`);
  });
}

startServer();
